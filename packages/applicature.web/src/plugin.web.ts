import {Hashtable, MultivestError, Plugin, PluginManager} from '@applicature/multivest.core';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
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
    private pluginMiddlewareConfig: IExpressMiddlewareConfig = {
        bodyParserJson: {
            limit: '50mb',
        },
        bodyParserUrlencoded: {extended: false},
        compress: {},
        cookieParser: {},
        cors: {},
        helmet: {},
        methodOverride: '',
        morgan: 'common',
        raven: '',
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
        this.serviceClasses.push(ValidationService);
    }

    public getApp(): express.Application {
        return this.app;
    }

    public startServer() {
        this.middleware();

        this.toEnable.forEach((id: string) => {
            this.app.use(this.getRouter(id));
        });

        if (this.pluginMiddlewareConfig.raven) {
            this.app.use(raven.errorHandler());
        }

        // error handler, send stacktrace only during development
        this.app.use((
            error: MultivestError, req: express.Request, res: express.Response, next: express.NextFunction,
        ) => {
            let status;

            if (error instanceof WebMultivestError) {
                const webError = error as WebMultivestError;

                status = webError.status;
            }
            else {
                status = 500;
            }

            res.status(status).json({
                message: error.message,
                stack: config.get('env') && config.get('env') === 'development' ? error.stack : null,
            });
        });

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
        this.app.use(compress(this.pluginMiddlewareConfig.compress));
        this.app.use(methodOverride(this.pluginMiddlewareConfig.methodOverride));
        // secure apps by setting various HTTP headers
        this.app.use(helmet(this.pluginMiddlewareConfig.helmet));

        // enable CORS - Cross Origin Resource Sharing
        this.app.use(cors(this.pluginMiddlewareConfig.cors));

        if (this.pluginMiddlewareConfig.raven) {
            raven.config(this.pluginMiddlewareConfig.raven);

            this.app.use(raven.requestHandler());
        }

        this.app.use(swStats.getMiddleware({
            authentication: true,
            onAuthenticate: (req: any, username: string, password: string) => {
                // simple check for username and password
                return((username === config.get('api.stats.username'))
                    && (password === config.get('api.stats.password')));
            },
            uriPath: `${config.get('api.namespace')}${config.get('api.stats.urlPath')}`,
        }));
    }
}

export {WebPlugin as Plugin};
