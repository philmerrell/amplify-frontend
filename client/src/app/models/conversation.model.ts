import { Artifact } from "./artifact.model";
import { Model } from "./model.model";
import { Prompt } from "./prompt.model";
import { MessageTopicData } from "./topic.model";
import { WorkflowDefinition } from "./workflow.model";

export interface Conversation {
    id: string;
    name: string;
    messages: Message[];
    compressedMessages?: number[];
    model: Model;
    prompt?: string;
    temperature?: number;
    folderId: string | null;
    promptTemplate?: Prompt | null;
    tags?: string[]
    maxTokens?: number;
    workflowDefinition?: WorkflowDefinition;
    data?: {[key:string]:any}
    codeInterpreterAssistantId?: string;
    isLocal?: boolean;
    groupType?: string;
    artifacts?:  { [key: string]: Artifact[]};
  }

  export interface Message {
    role: Role;
    content: string;
    id: string;
    type: string | undefined;
    data?: any | undefined;
    label?: string;
    codeInterpreterMessageData?: any | undefined;
    topicData?: MessageTopicData;
  }

  export type Role = 'assistant' | 'user' | 'system';
