export interface WorkflowDefinition {
    id: string;
    formatVersion: string;
    version: string;
    folderId: string | null;
    description?: string;
    generatingPrompt?: string;
    name: string;
    code: string;
    tags: string[];
    inputs: Inputs;
    outputs: OutputType[];
}

export interface Inputs {
    parameters: Parameters,
    documents: InputDocument[]
}

export interface OutputType {
    type: string;
    data?: { [key: string]: string };
}

export interface Parameters {
    [key: string]: InputParameter;
}

export interface InputDocument {
    name: string;
    fileExtension: string;
    fileMimeType: string;
}

export interface InputParameter {
    name: string;
    description: string;
    defaultValue: string;
    jsonSchema: string;
}