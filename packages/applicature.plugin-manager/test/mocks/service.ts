import { Service } from '../../src/entities/service';

export class TestService extends Service {
    getServiceId() {
        return 'test.service';
    }
}
