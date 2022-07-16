
export interface IAttributes 
{
    sourceFolder: string;
    destinationFolder: string;
    versioning: boolean | undefined;
    publicDirectory: string | undefined;
    createFolders: boolean | undefined;
    createSymlink: boolean;
}