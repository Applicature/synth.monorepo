import * as CloudWatch from 'aws-sdk/clients/cloudwatch';
import { env } from 'process';
import { AwsMetricTransport, MetricService } from '../../../src';

describe('AwsMetricTransport unit test', () => {
    let metricService: AwsMetricTransport;
    let putMetricData: any;
    let putMetricDataMock: any;

    beforeAll(() => {
        putMetricData = CloudWatch.prototype.putMetricData;
        putMetricDataMock = jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve() }));
        CloudWatch.prototype.putMetricData = putMetricDataMock;
        metricService = new AwsMetricTransport();
    });

    beforeEach(() => {
        putMetricDataMock.mockClear();
    });

    afterAll(() => {
        CloudWatch.prototype.putMetricData = putMetricData;
    });

    it('saveMetric should transfer right params', async () => {
        const name = 'name';
        const value = 1;
        const timestamp = new Date();
        await (metricService as any).saveMetric(name, value, timestamp);

        expect(putMetricDataMock).toHaveBeenCalledTimes(1);
        expect(putMetricDataMock).toHaveBeenCalledWith({
            MetricData: [
                {
                    MetricName: name,
                    Timestamp: timestamp,
                    Value: value,
                }
            ],
            Namespace: 'FluenceAPI',
        });
    });
});
