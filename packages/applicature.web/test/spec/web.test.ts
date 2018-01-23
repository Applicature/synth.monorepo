import * as config from 'config';
import * as express from 'express';
import { expect } from 'chai';
import { Web } from '../../src/web';

describe('Web Plugin', () => {
    test('should init web plugin', () => {
        const web = new Web();
    });
    test('should add Routes', () => {
        const app = express();
        const web = new Web(config, app);
        const router = express.Router();
        web.addRouter('one', router);
    });
    test('should enable Router', () => {
        const app = express();
        const web = new Web(config, app);
        const router = express.Router();
        web.addRouter('one', router);
        web.enableRouter('one');
    });
    test('should start Server', () => {
        const app = express();
        const web = new Web(config, app);
        web.startServer();
    });
});
