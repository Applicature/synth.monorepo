import {Hashtable, MultivestError, Plugin, PluginManager} from '@applicature-private/applicature-sdk.plugin-manager';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import {ValidationError} from 'express-validation';
import * as helmet from 'helmet';
import * as http from 'http';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as raven from 'raven';
import * as swStats from 'swagger-stats';
import * as winston from 'winston';
import {WebMultivestError} from './error';
import {IExpressMiddlewareConfig, IWeb} from './pluginInterface';
import {ValidationDefaultService as ValidationService} from './services/validation/validation.default.service';
// onst apiSpec = require('swagger.json');
class WebPlugin extends Plugin<void> implements IWeb {
    // ref to Express instance
    private app: express.Application;
    private httpServer: http.Server;
    private routes: Hashtable<express.Router> = {};
    private toEnable: Array<string> = [];
    private sentry: string;
    private pluginMiddlewareConfig: IExpressMiddlewareConfig = {
        bodyParserJson: {
            limit: '50mb',
        },
        bodyParserUrlencoded: {extended: false},
        compress: {},
        cookieParser: {},
        cors: {},
        enableCompressing: false,
        helmet: {},
        methodOverride: '',
        morgan: 'common',
        swStats: null,
    };

    constructor(pluginManager: PluginManager) {
        super(pluginManager);
        this.app = express();
    }

    public addRouter(id: string, Router: express.Router) {
        this.routes[id] = Router;
    }

    public enableRouter(id: string) {
        this.toEnable.push(id);
    }

    public getPluginId(): string {
        return 'web';
    }

    public init(): void {
        this.registerService(ValidationService);
    }

    public getApp(): express.Application {
        return this.app;
    }

    public setupServer() {
        this.middleware();

        this.toEnable.forEach((id: string) => {
            this.app.use(this.getRouter(id));
        });

        // error handler, send stacktrace only during development
        this.app.use((
            error: Error, req: express.Request, res: express.Response, next: express.NextFunction
        ) => {
            let status;

            if (error instanceof MultivestError) {
                winston.warn(error.message, error.stack);
            }

            if (this.sentry) {
                raven.errorHandler()(error, req, res, next);
            }

            let message = error.message;
            let details;

            if (error instanceof WebMultivestError) {
                const webError = error as WebMultivestError;

                message = error.message;
                status = webError.status;
            }
            else if (error instanceof ValidationError) {
                message = 'VALIDATION_ERROR';
                status = 400;

                details = error.errors;
            }
            else if (error.message === 'validation error') {
                message = 'VALIDATION_ERROR';
                status = 400;

                // @ts-ignore
                const validationError = error as ValidationError;

                details = validationError.errors;
            }
            else {
                status = 500;
            }

            let showStack = false;

            if (['test', 'development'].indexOf(config.get('env')) >= 0) {
                showStack = true;
            }

            res.status(status).json({
                details,
                message,
                stack: showStack ? error.stack : null,
            });
        });
    }

    public startServer() {
        this.setupServer();
        // listen on port listen.port
        const listenPort = config.get('multivest.web.port');
        this.httpServer = new http.Server(this.app);
        this.httpServer.listen(listenPort, () => {
            winston.info(`server started on port ${listenPort}`);
        });
    }

    public closeServer() {
        this.httpServer.close();
    }

    private getRouter(id: string) {
        return this.routes[id];
    }

    // Configure Express middleware.
    private mergeMiddlewareConfiguration(): void {
        if (config.has('logger.sentry')) {
            this.sentry = config.get('logger.sentry');
        }
        this.pluginMiddlewareConfig = {
            ...this.pluginMiddlewareConfig,
            ...config.get('multivest.web.middleware'),
        };
    }

    // Run configuration methods on the Express instance
    private middleware(): void {
        this.mergeMiddlewareConfiguration();
        this.app.use(morgan(this.pluginMiddlewareConfig.morgan));
        // parse body params and attache them to req.body
        this.app.use(bodyParser.json(this.pluginMiddlewareConfig.bodyParserJson));
        this.app.use(bodyParser.urlencoded(this.pluginMiddlewareConfig.bodyParserUrlencoded));
        this.app.use(cookieParser(this.pluginMiddlewareConfig.cookieParser));
        if (this.pluginMiddlewareConfig.enableCompressing) {
            this.app.use(compress(this.pluginMiddlewareConfig.compress));
        }
        this.app.use(methodOverride(this.pluginMiddlewareConfig.methodOverride));
        // secure apps by setting various HTTP headers
        this.app.use(helmet(this.pluginMiddlewareConfig.helmet));

        // enable CORS - Cross Origin Resource Sharing
        this.app.use(cors(this.pluginMiddlewareConfig.cors));

        if (this.sentry) {
            raven.config(this.sentry).install();
            this.app.use(raven.requestHandler());
        }
        this.app.use(passport.initialize());
        // this.app.use(passport.serialize());
        if (this.pluginMiddlewareConfig.swStats) {
            this.app.use(swStats.getMiddleware({
                authentication: true,
                onAuthenticate: (req: any, username: string, password: string) => {
                    // simple check for username and password
                    // @ts-ignore
                    return((username === this.pluginMiddlewareConfig.swStats.username)
                    // @ts-ignore
                        && (password === this.pluginMiddlewareConfig.swStats.password));
                },
                uriPath: `${config.get('api.namespace')}${this.pluginMiddlewareConfig.swStats.urlPath}`,
            }));
        }
    }
}

export {WebPlugin as Plugin};
