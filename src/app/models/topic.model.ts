
export interface MessageTopicDataPast {
    range: string;
    topic: string;
    description: string;
}

export interface MessageTopicData {
    pastTopic?: MessageTopicDataPast;
    currentTopic?: string;
}