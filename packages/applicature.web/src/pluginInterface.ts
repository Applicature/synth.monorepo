import * as express from 'express'
export interface IWeb {
    addRouter(id: string, Router: express.Router): void;
    enableRouter(id: string): void;
    startServer(): void;
}

export interface IExpressMiddlewareConfig {
    bodyParserJson?: any;
    bodyParserUrlencoded?: any;
    cookieParser?: any;
    compress?: any;
    methodOverride?: any;
    helmet?: any;
    cors?: any;
}
