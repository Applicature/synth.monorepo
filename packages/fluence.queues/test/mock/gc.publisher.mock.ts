export const publisherProjectIdMock = 'projectId';

export const GcPublisherMock = {
    getProjectId:
        jest.fn().mockImplementation((cb: (err: Error, res: any) => void) => cb(null, publisherProjectIdMock)),
    projectPath: jest.fn().mockImplementation((projectId: string) => projectId),
    topicPath: jest.fn().mockImplementation((projectId: string, topicName: string) => projectId + topicName),

    createTopic: jest.fn().mockImplementation(() => [{}]),
    deleteTopic: jest.fn().mockImplementation(() => []),
    listTopics: jest.fn().mockImplementation(() => []),
    publish: jest.fn().mockImplementation(() => []),
} as any;
