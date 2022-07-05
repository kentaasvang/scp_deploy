import { ScpClient } from "node-scp";

export interface IServerClient 
{
    readonly serverConfig: IServerConfig;

    clientInstance: ScpClient | undefined;

    initiate(): Promise<void>;
    mkdir(path: string): Promise<void>;
    uploadDir(src: string, dest: string): Promise<void>;
    close(): Promise<void>;
    exists(path: string): Promise<string | boolean>
}
