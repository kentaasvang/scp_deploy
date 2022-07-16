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

        if (!await this.directoryExists(this.attributes.destinationFolder))
        {
            await this.createDirectory(this.attributes.destinationFolder);
        }

        if (this.attributes.versioning)
        {
            this.logger.info("Deploying with versioning");
            let version = await this.getVersion();

            this.attributes.destinationFolder += `/${version}`;
            this.logger.info(`Changed destinationFolder to ${this.attributes.destinationFolder}`);

            await this.createDirectory(this.attributes.destinationFolder, true);
            this.logger.info(`Created folder with ${this.attributes.destinationFolder} on remote server`);

            if (this.attributes.createSymlink)
            {
                await this.createSymlink(this.attributes.destinationFolder, this.attributes.publicDirectory);
            }
        }

        await this.upload();
        await this.closeConnection();
    }
    
    private async directoryExists(path: string): Promise<boolean> 
    {
        let result = await this.clientInstance?.exists(path);
        this.logger.info(`Checking to see if '${path}' exists, result was: ${result}`);
        return result !== false;
    }

    private async createDirectory(dirPath: string, force: boolean = false): Promise<void>
    {
        if (!this.attributes.createFolders && !force)
        {
            this.logger.error(`Can't create folder '${dirPath}' with create folder-attr set to ${this.attributes.createFolders}`);
            exit(1);
        }

        this.logger.info(`Creating new directory: '${dirPath}`);
        await this.clientInstance?.mkdir(dirPath);
    }
    
    private async getVersion(): Promise<number> 
    {
        let versions = await this.getExistingVersions();

        if (versions.length == 0) 
        {
            this.logger.info("No prior versions found, initiating first version number 1");
            return 1;
        }

        let versionsAsNumbers: number[] = [];

        // parse string to ints and push to array
        versions.forEach(version => {
            versionsAsNumbers.push(parseInt(version, 10));
        });

        // sort array in ascending order
        versionsAsNumbers.sort((a, b) => a - b );

        return ++versionsAsNumbers[versionsAsNumbers.length - 1];
    }

    private async getExistingVersions(): Promise<string[]>
    {
        let versions = await this.clientInstance?.list(this.attributes.destinationFolder)
        let dirNames: string[] = this.getNamesFromList(versions);
        return dirNames;
    }

    private getNamesFromList(result: any): string[] 
    {
        let dirNames: string[] = [];

        Object.keys(result).forEach(idx => 
        {
           dirNames.push(result[idx].name);  
        });

        return dirNames;
    }


    private async upload(): Promise<void> 
    {
        let sourceFolder: string = this.attributes.sourceFolder;
        let destinationFolder: string = this.attributes.destinationFolder;

        await this.cleanDirectory(destinationFolder);
        await this.clientInstance?.uploadDir(sourceFolder, destinationFolder);
        this.logger.info(`Uploaded source-files to '${destinationFolder}'`);
    }

    private async cleanDirectory(workingDirectory: string): Promise<void> 
    {
        await this.clientInstance?.emptyDir(workingDirectory);
        this.logger.info(`Cleaned directory '${workingDirectory}'`)
    }

    private async closeConnection(): Promise<void | undefined> 
    {
        this.logger.info("Closing connection to server..");
        return await this.clientInstance?.close();
    }

    private async createSymlink(source: string, symlinkName: string | undefined): Promise<void> 
    {
        if (symlinkName === undefined)
        {
            this.logger.error(`symlinkName is undefined`);
            exit(1);
        }

        this.logger.info(`Creating symbolic link ${symlinkName} from ${source}`);

        let ssh = new SSH(
        {
            host: this.serverConfig.host,
            user: this.serverConfig.username,
            key: this.serverConfig.privateKey
        });
        
        ssh.exec(`ln -sfn ${source} ${symlinkName}`, {
            out: function(out: any) {
                this.logger.info(out);
            }
        }).start();
    }
}


