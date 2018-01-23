import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';
import * as httpStatus from 'http-status';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import * as winston from 'winston';
import { IExpressMiddlewareConfig, IWeb } from './pluginInterface';
import { Hashtable } from './structure';

export class Web implements IWeb {
    // ref to Express instance
    private app: express.Application;
    private config: any;
    private routes: Hashtable<express.Router> = {};
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
    };

    constructor(pluginConfig: any, serverApp: express.Application) {
        this.config = pluginConfig;
        this.app = serverApp;
        process.on('unhandledRejection', (err) => {
            winston.error('unhandledRejection', err);
            throw err;
        });

        process.on('uncaughtException', (err) => {
            winston.error('uncaughtException', err);
            throw err;
        });
    }

    public addRouter(id: string, Router: express.Router) {
        this.routes[id] = Router;
    }

    public enableRouter(id: string) {
        this.app.use(this.getRouter(id));
    }

    public startServer() {

        this.middleware();

        // listen on port listen.port
        const listenPort = this.config.get('listen.port');
        const httpServer = new http.Server(this.app);
        httpServer.listen(listenPort, () => {
            winston.info(`server started on port ${listenPort}`);
        });
    }

    private getRouter(id: string) {
        return this.routes[id];
    }

    // Configure Express middleware.
    private margeMiddlewareConfiguration(): void {
        this.pluginMiddlewareConfig = {
            ...this.pluginMiddlewareConfig,
            ...this.config.get('middleware'),
        };
    }

    // Run configuration methods on the Express instance
    private middleware(): void {
        this.margeMiddlewareConfiguration();
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
        // error handler, send stacktrace only during development
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) =>
            res.status(err.status ? err.status : 500).json({
                // message: err.isPublic ? err.message : httpStatus[err.status],
                // stack: config.env && config.env === 'development' ? err.stack : {},
            }),
        );

    }
}
