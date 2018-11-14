import { Service } from '../../src/entities/service';

export class TestService extends Service {
    public getServiceId() {
        return 'test.service';
    }
}
