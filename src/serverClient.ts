import { countReset } from "console";
import Client, { ScpClient } from "node-scp";
import { exit } from "process";
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

        /**
         * if not versioning
         *      delete content of destination-folder
         *      1 .upload content to destination-folder
         * 
         * if versioning
         *      create new folder with versionname in destination-folder
         *      1. upload files source-files to new folder 
         */

        if (!await this.workingDirectoryExists())
        {
            this.logger.error(`working directory ${this.attributes.workingDirectory} doesn't exist on client. Exiting`);
            exit(1);
        }

        if (this.attributes.versioning)
        {
            this.logger.info("Deploying with versioning");
            await this.checkNeededDirectoriesExists();

            let version = await this.generateNewVersionNumber();

            this.attributes.workingDirectory = this.attributes.versionsDirectory + "/" + version;
            this.logger.info(`Changed attributes.workingDirectory to ${this.attributes.workingDirectory}`);
            await this.clientInstance.mkdir(this.attributes.workingDirectory);
            this.logger.info(`Created workingDirectory ${this.attributes.workingDirectory} on remote server`);

            await this.createSymlink(this.attributes.workingDirectory, this.attributes?.publicDirectory);
        }

        await this.upload();
        await this.close();
    }

    private async checkNeededDirectoriesExists(): Promise<void>
    {
            
        let result = await this.clientInstance?.list(this.attributes.workingDirectory);
        let dirNames: string[] = this.getNamesFromList(result);

        // TODO: should not be hardcoded! 
        let pubDir: string | undefined = dirNames.find(dir => dir == "Current");
        let workDir: string | undefined = dirNames.find(dir => dir == "Versions");

        if (pubDir === undefined || workDir === undefined)
        {
            this.logger.error(`Missing directories ${pubDir} and ${workDir} for use with versioning`);
            exit(1);
        }
    }
    
    private async generateNewVersionNumber(): Promise<number> 
    {

        if (this.attributes.versionsDirectory === undefined)
            return -1;

        let versionFolders = await this.clientInstance?.list(this.attributes.versionsDirectory)

        let dirNames: string[] = this.getNamesFromList(versionFolders);

        if (dirNames.length == 0) return 1;

        let dirNamesAsNumber: number[] = [];

        dirNames.forEach(dirName => {
            dirNamesAsNumber.push(parseInt(dirName, 10));
        });

        dirNamesAsNumber.sort((a, b) => a - b );

        return ++dirNamesAsNumber[dirNamesAsNumber.length - 1];
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

    private async workingDirectoryExists(): Promise<string | boolean | undefined> 
    {
        return await this.clientInstance?.exists(this.attributes.workingDirectory);
    }

    private async upload(): Promise<void> 
    {
        let sourceFolder: string = this.attributes.sourceFolder;
        let workingDirectory: string = this.attributes.workingDirectory;

        await this.cleanDirectory(workingDirectory);
        await this.clientInstance?.uploadDir(sourceFolder, workingDirectory);
        this.logger.info(`Uploaded source-files to '${workingDirectory}'`);
    }

    private async cleanDirectory(workingDirectory: string): Promise<void> 
    {
        await this.clientInstance?.emptyDir(workingDirectory);
        this.logger.info(`Cleaned directory '${workingDirectory}'`)
    }

    private async close(): Promise<void | undefined> 
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


