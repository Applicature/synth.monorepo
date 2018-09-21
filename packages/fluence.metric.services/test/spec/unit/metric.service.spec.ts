import { env } from 'process';
import { MetricService } from '../../../src';

describe('test', () => {
    let metricService: MetricService;
    const saveMetricMock = jest.fn().mockImplementation(() => Promise.resolve(undefined));
    const nodeEnv = env.NODE_ENV;

    class MetricServiceMock extends MetricService {
        public getServiceId() {
            return 'mock';
        }

        protected async saveMetric(...args: Array<any>): Promise<void> {
            return saveMetricMock(...args);
        }
    }

    beforeAll(() => {
        metricService = new MetricServiceMock(null);
    });

    beforeEach(() => {
        saveMetricMock.mockClear();
    });

    it('activeBlockchainNodes should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.activeBlockchainNodes(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.active.nodes.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('blockchainCalled should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.blockchainCalled(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.calls.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('healthyBlockchainNodes should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.healthyBlockchainNodes(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.healthy.nodes.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('healthyBlockchainNodes should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.unhealthyBlockchainNodes(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.unhealthy.nodes.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('clientsRegistered should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.clientsRegistered(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `clients.registered.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('clientsEmailVerified should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.clientsEmailVerified(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `clients.email.verified.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('clientsPasswordRestored should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.clientsPasswordRestored(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `clients.password.restored.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('projectsCreated should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.projectsCreated(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `projects.created.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('projectsActivated should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.projectsActivated(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `projects.activated.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('projectsInactivated should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.projectsInactivated(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `projects.inactivated.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('transactionsFoundInBlock should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.transactionsFoundInBlock(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.transactions.found.in.block.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('contractsEventFoundInBlock should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.contractsEventFoundInBlock(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.contracts.event.found.in.block.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('addressFoundInBlock should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.addressFoundInBlock(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.address.found.in.block.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('transactionsSuccessfullySent should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.transactionsSuccessfullySent(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.transaction.successfully.sent.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('transactionsUnsuccessfullySent should transfer right params', () => {
        const blockchainId = 'blockchainId';
        const networkId = 'networkId';
        const count = 1;
        const timestamp = new Date();

        metricService.transactionsUnsuccessfullySent(blockchainId, networkId, count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `${blockchainId}.${networkId}.transaction.unsuccessfully.sent.${nodeEnv}`,
            count,
            timestamp
        );
    });

    it('incomingHttpRequests should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.incomingHttpRequests(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `incoming.http.requests.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('httpRequestsSuccessfullyExecuted should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.httpRequestsSuccessfullyExecuted(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `http.requests.successfully.executed.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('httpRequestsUnsuccessfullyExecuted should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.httpRequestsUnsuccessfullyExecuted(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `http.requests.unsuccessfully.executed.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('httpRequestsTimeout should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.httpRequestsTimeout(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `http.requests.timeout.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksSuccessfullyCalled should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksSuccessfullyCalled(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.successfully.called.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksUnsuccessfullyCalled should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksUnsuccessfullyCalled(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.unsuccessfully.called.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksDelayedOnOneSec should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksDelayedOnOneSec(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.delay.on.1.sec.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksDelayedOnThreeSec should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksDelayedOnThreeSec(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.delay.on.3.sec.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksDelayedOnFiveSec should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksDelayedOnFiveSec(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.delay.on.5.sec.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksDelayedOnTenSec should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksDelayedOnTenSec(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.delay.on.10.sec.${ nodeEnv }`,
            count,
            timestamp
        );
    });

    it('webhooksDelayedOnSixtySec should transfer right params', () => {
        const count = 1;
        const timestamp = new Date();

        metricService.webhooksDelayedOnSixtySec(count, timestamp);

        expect(saveMetricMock).toHaveBeenCalledTimes(1);
        expect(saveMetricMock).toHaveBeenCalledWith(
            `webhook.delay.on.60.sec.${ nodeEnv }`,
            count,
            timestamp
        );
    });
});
