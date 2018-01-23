import {expect} from 'chai';
import {Web} from '../../src/web';
import {Router} from 'express';
import * as config from 'config';

describe('Web Plugin', () => {
    it('should init web plugin', () => {
        const web = new Web();
    });
    it('should add Routes', () => {
        const app = expres();
        const web = new Web(config, app);
        const router = Router();
        web.addRouter('one', router);
    });
    it('should enable Router', () => {
        const app = expres();
        const web = new Web(config, app);
        const router = Router();
        web.addRouter('one', router);
        web.enableRouter('one');
    });
    it('should start Server', () => {
        const app = expres();
        const web = new Web(config, app);
        web.startServer()
    });
});
