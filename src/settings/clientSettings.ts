
export interface IClientSettings
{
    readonly host: string;
    readonly username: string;
    readonly port: number;
    readonly privateKey: string;
    readonly sourceFolder: string;
    readonly destinationFolder: string;
}