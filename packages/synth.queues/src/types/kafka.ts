export interface KafkaConsumerConfig {
    [key: string]: string | object;
}

export interface KafkaProducerConfig {
    [key: string]: string | object;
}

export interface KafkaAdminConfig {
    [key: string]: string | object;
}

export interface KafkaTopicConfig {
    [key: string]: string | object;
}

export interface KafkaConfig {
    consumerConfig: KafkaConsumerConfig;
    producerConfig: KafkaProducerConfig;
    adminConfig: KafkaAdminConfig;
    topicConfig?: KafkaTopicConfig;
}
