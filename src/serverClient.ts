import Client, { ScpClient } from "node-scp";
import { IAttributes } from "./interfaces/attributes.interface";
import { IServerClient } from "./interfaces/serverClient.interface";


export class ServerClient implements IServerClient
{
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
    readonly client: Promise<ScpClient> | undefined;

    clientInstance: ScpClient | undefined;

    constructor(connectionCredentials: IServerConfig, attributes: IAttributes)
    {
        this.serverConfig = connectionCredentials;
        this.attributes = attributes;
    }

    public async deploy(): Promise<void>
    {
        this.clientInstance = await Client(
        {
            host: this.serverConfig.host,
            port: this.serverConfig.port,
            username: this.serverConfig.username,
            privateKey: this.serverConfig.privateKey,
        });

        if (!await this.workingDirectoryExists()) 
        {
            return;
        }

        await this.upload();
        await this.close();
    }

    private async workingDirectoryExists(): Promise<string | boolean>
    {
        if (this.clientInstance === undefined)
        {
            return false;
        }

        return await this.clientInstance.exists(this.attributes.workingDirectory);
    }

    private async upload(): Promise<void>
    {
        if (this.clientInstance === undefined)
        {
            return;
        }

        let uploadDir: string = this.attributes.uploadDirectory;
        let workingdirectory: string = this.attributes.workingDirectory;

        return await this.clientInstance.uploadDir(uploadDir, workingdirectory);
    }

    private async close(): Promise<void >
    {
        if (this.clientInstance === undefined)
        {
            return;
        }

        return await this.clientInstance.close();
    }
}

