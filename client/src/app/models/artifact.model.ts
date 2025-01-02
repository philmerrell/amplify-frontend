export interface Artifact {
    artifactId: string; // multiple artifacts can have the same id, its the version that separate them
    version: number;
    name: string;
    type: string;
    description: string;
    contents: number[]; // will be encoded
    tags: string[];
    createdAt: string;
}