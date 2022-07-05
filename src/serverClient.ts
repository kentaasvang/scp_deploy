import Client, { ScpClient } from "node-scp";
import { IServerClient } from "./interfaces/serverClient.interface";


export class ServerClient implements IServerClient
{
    readonly serverConfig: IServerConfig;
    readonly client: Promise<ScpClient> | undefined;

    clientInstance: ScpClient | undefined;

    constructor(connectionCredentials: IServerConfig)
    {
        this.serverConfig = connectionCredentials;
    }
    
    public async initiate(): Promise<void>
    {
        this.clientInstance = await Client(
        {
            host: this.serverConfig.host,
            port: this.serverConfig.port,
            username: this.serverConfig.username,
            privateKey: this.serverConfig.privateKey,
        });
    }

    public async exists(path: string): Promise<string | boolean>
    {
        if (this.clientInstance === undefined)
        {
            return false;
        }

        return await this.clientInstance.exists(path);
    }

    public async mkdir(path: string): Promise<void>
    {
        if (this.clientInstance === undefined)
        {
            return;
        }

        return await this.clientInstance.mkdir(path);
    }

    public async uploadDir(src: string, dest: string): Promise<void>
    {
        if (this.clientInstance === undefined)
        {
            return;
        }

        return await this.clientInstance.uploadDir(src, dest);
    }

    public async close(): Promise<void >
    {
        if (this.clientInstance === undefined)
        {
            return;
        }

        return await this.clientInstance.close();
    }
}