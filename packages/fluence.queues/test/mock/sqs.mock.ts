function getAwsResponse(response: any = {}) {
    return {
        promise: () => Promise.resolve(response),
    };
}

export const SqsMock = {
    createQueue: jest.fn().mockImplementation(getAwsResponse),
    deleteQueue: jest.fn().mockImplementation(getAwsResponse),
    getQueueUrl: jest.fn().mockImplementation(getAwsResponse),
    listQueues: jest.fn().mockImplementation(getAwsResponse),
    receiveMessage: jest.fn().mockImplementation(() => getAwsResponse({ Messages: [] })),
    sendMessage: jest.fn().mockImplementation(getAwsResponse),
} as any;
