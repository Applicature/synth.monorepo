import { Hashtable } from '@applicature/synth.plugin-manager';
import * as CloudWatch from 'aws-sdk/clients/cloudwatch';
import * as config from 'config';
import * as logger from 'winston';
import { MetricTransport } from './metric.transport';

export class AwsMetricTransport extends MetricTransport {
    protected provider: CloudWatch;

    constructor() {
        super();

        const cloudWatchCfg = config.has('aws.cloudWatch')
            ? config.get('aws.cloudWatch')
            : { apiVersion: '2010-08-01' };
        this.provider = new CloudWatch(cloudWatchCfg);
    }

    public getServiceId() {
        return 'aws.metric.service';
    }

    public async saveMetric(
        name: string,
        value: number,
        timestamp: Date = new Date(),
        dimensions: Hashtable<string> = null
    ): Promise<void> {
        const metricData: any = {
            MetricName: name,
            Timestamp: timestamp,
            Value: value,
        };

        if (dimensions) {
            metricData.Dimensions = [];
            for (const key of Object.keys(dimensions)) {
                metricData.Dimensions.push({
                    Name: key,
                    Value: dimensions[key]
                });
            }
        }

        try {
            await this.provider.putMetricData({
                MetricData: [
                    metricData
                ],
                Namespace: 'FluenceAPI',
            }).promise();
        } catch (ex) {
            logger.error(`Cant send metric data to AWS CloudWatch. Reason: ${ ex.message }`);
        }
    }
}
