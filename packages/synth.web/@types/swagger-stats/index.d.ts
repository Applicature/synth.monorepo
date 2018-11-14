declare module 'swagger-stats' {
    namespace Stats {
        function getMiddleware(...args: Array<any>): any
    }

    export = Stats;
}
