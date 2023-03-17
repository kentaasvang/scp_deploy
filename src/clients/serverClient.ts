import { countReset } from "console";
import Client, { ScpClient } from "node-scp";
import { exit, versions } from "process";
import { IClientSettings } from "../settings/clientSettings";
import { ILogger } from "../logger/logger.interface";

let SSH = require("simple-ssh");

export interface IServerClient 
{
    readonly config: IClientSettings;
    readonly logger: ILogger;
    readonly clientInstance: ScpClient | undefined;

    deploy(): Promise<void>;
}

export class ServerClient implements IServerClient 
{
    readonly config: IClientSettings;
    readonly client: Promise<ScpClient> | undefined;
    readonly logger: ILogger;

    clientInstance: ScpClient | undefined;

    constructor(config: IClientSettings, logger: ILogger) 
    {
        this.config = config;
        this.logger = logger;
    }

    public async deploy(): Promise<void> 
    {
        this.clientInstance = await Client(
        {
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            privateKey: this.config.privateKey,
        });

        await this.upload();
        await this.closeConnection();
    }
    
    private async directoryExists(path: string): Promise<boolean> 
    {
        let result = await this.clientInstance?.exists(path);
        this.logger.info(`Checking to see if '${path}' exists, result was: ${result}`);
        return result !== false;
    }

    private async upload(): Promise<void> 
    {
        let sourceFolder: string = this.config.sourceFolder;
        let destinationFolder: string = this.config.destinationFolder;

        await this.clientInstance?.uploadDir(sourceFolder, destinationFolder);
        this.logger.info(`Uploaded source-files to '${destinationFolder}'`);
    }

    private async closeConnection(): Promise<void | undefined> 
    {
        this.logger.info("Closing connection to server..");
        return await this.clientInstance?.close();
    }
}


