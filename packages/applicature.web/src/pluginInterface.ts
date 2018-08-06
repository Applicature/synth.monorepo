import * as express from 'express';

export interface IWeb {
    addRouter(id: string, Router: express.Router): void;
    enableRouter(id: string): void;
    startServer(): void;
    closeServer(): void;
}

export interface IExpressMiddlewareConfig {
    bodyParserJson?: any;
    bodyParserUrlencoded?: any;
    cookieParser?: any;
    enableCompressing: boolean;
    compress?: any;
    methodOverride?: any;
    helmet?: any;
    cors?: any;
    morgan?: any;
    raven?: any;
}
