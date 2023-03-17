import Client, { ScpClient } from "node-scp";
import { ILogger } from "../logger/logger";
import { IClientSettings } from "../settings/clientSettings";

let SSH = require("simple-ssh");

export interface IServerClient 
{
    readonly settings: IClientSettings;
    readonly logger: ILogger;
    readonly clientInstance: ScpClient | undefined;

    deploy(): Promise<void>;
}

export class ServerClient implements IServerClient 
{
    readonly settings: IClientSettings;
    readonly client: Promise<ScpClient> | undefined;
    readonly logger: ILogger;

    clientInstance: ScpClient | undefined;

    constructor(settings: IClientSettings, logger: ILogger) 
    {
        this.settings = settings;
        this.logger = logger;
    }

    public async deploy(): Promise<void> 
    {
        this.clientInstance = await Client(
        {
            host: this.settings.host,
            port: this.settings.port,
            username: this.settings.username,
            privateKey: this.settings.privateKey,
        });
        
        let sourceDirExists = await this.directoryExists(this.settings.destinationFolder);
        if (sourceDirExists)
            await this.upload();
            
        this.closeConnection();
    }
    
    private async directoryExists(path: string): Promise<boolean> 
    {
        this.logger.info(`Checking to see if '${path}' exists`);
        let exists = await this.clientInstance?.exists(path);
        let result = exists !== false;
        this.logger.info(`Path exists: ${result}`);
        return result;
    }

    private async upload(): Promise<void> 
    {
        this.logger.info("Uploading files..");
        let sourceFolder: string = this.settings.sourceFolder;
        let destinationFolder: string = this.settings.destinationFolder;

        await this.clientInstance?.uploadDir(sourceFolder, destinationFolder);
        this.logger.info(`Files successfully uploaded to '${destinationFolder}'`);
    }

    private closeConnection(): void
    {
        this.logger.info("Closing connection to server..");
        this.clientInstance?.close();
        this.logger.info("Connection to server is closed.");
    }
}


