import { countReset } from "console";
import Client, { ScpClient } from "node-scp";
import { exit, versions } from "process";
import { IAttributes } from "./interfaces/attributes.interface";
import { IConfiguration } from "./interfaces/configuration.interface";
import { ILogger } from "./interfaces/logger.interface";
import { IServerClient } from "./interfaces/serverClient.interface";

let SSH = require("simple-ssh");


export class ServerClient implements IServerClient 
{
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
    readonly client: Promise<ScpClient> | undefined;
    readonly logger: ILogger;

    clientInstance: ScpClient | undefined;

    constructor(config: IConfiguration, logger: ILogger) 
    {
        this.serverConfig = config.serverConfig;
        this.attributes = config.attributes;
        this.logger = logger;
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
        let sourceFolder: string = this.attributes.sourceFolder;
        let destinationFolder: string = this.attributes.destinationFolder;

        await this.clientInstance?.uploadDir(sourceFolder, destinationFolder);
        this.logger.info(`Uploaded source-files to '${destinationFolder}'`);
    }

    private async closeConnection(): Promise<void | undefined> 
    {
        this.logger.info("Closing connection to server..");
        return await this.clientInstance?.close();
    }
}


