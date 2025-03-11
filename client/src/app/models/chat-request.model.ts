import { Message } from "./conversation.model";
import { Model } from "./model.model";

export interface ChatRequest {
    accountId?: string;
    codeInterpreterAssistantId?: string;
    dataSources?: DataSource[];
    endpoint?: string;
    functions?: CustomFunction[];
    function_call?: string;
    maxTokens?: number;
    messages: Message[];
    model: Model;
    prompt: string;
    requestId?: string;
    response_format?: ChatResponseFormat;
    temperature: number;
    [key: string]: any;
}

export type CustomFunction = {
    description: string;
    name: string;
    parameters: JsonSchema;
}

export interface ChatResponseFormat {
    type: string;
}

export interface DataSource {
    id: string;
    metadata?: any;
    key?: string;
    name?: string;
    type?: string;
}

export interface JsonSchema {
    $schema?: string;
    $ref?: string;
    title?: string;
    description?: string;
    default?: any;
    examples?: any[];
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalItems?: boolean | JsonSchema;
    items?: JsonSchema | JsonSchema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: boolean | JsonSchema;
    definitions?: { [key: string]: JsonSchema };
    properties?: { [propertyName: string]: JsonSchema };
    patternProperties?: { [key: string]: JsonSchema };
    dependencies?: { [key: string]: JsonSchema | string[] };
    enum?: any[];
    type?: string | string[];
    format?: string;
    contentMediaType?: string;
    contentEncoding?: string;
    if?: JsonSchema;
    then?: JsonSchema;
    else?: JsonSchema;
    allOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    oneOf?: JsonSchema[];
    not?: JsonSchema;
}