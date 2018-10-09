export const subscriberProjectIdMock = 'projectId';

export const GcSubscriberMock = {
    getProjectId:
        jest.fn().mockImplementation((cb: (err: Error, res: any) => void) => cb(null, subscriberProjectIdMock)),
    projectPath: jest.fn().mockImplementation((projectId: string) => projectId),
    subscriptionPath:
        jest.fn().mockImplementation((projectId: string, subscriptionName: string) => projectId + subscriptionName),
    topicPath: jest.fn().mockImplementation((projectId: string, topicName: string) => projectId + topicName),

    createSubscription: jest.fn().mockImplementation(() => [ { on: (): undefined => undefined } ]),
} as any;
