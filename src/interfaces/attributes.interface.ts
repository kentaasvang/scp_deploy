
export interface IAttributes {
    workingDirectory: string;
    sourceFolder: string;
    destinationFolder: string | undefined;
    versioning: boolean | undefined;
    publicDirectory: string | undefined;
    versionsDirectory: string | undefined;
}