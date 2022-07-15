import Client, { ScpClient } from "node-scp";
import { exit } from "process";
import { IAttributes } from "./interfaces/attributes.interface";
import { IConfiguration } from "./interfaces/configuration.interface";
import { IServerClient } from "./interfaces/serverClient.interface";

let SSH = require("simple-ssh");


export class ServerClient implements IServerClient 
{
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
    readonly client: Promise<ScpClient> | undefined;

    clientInstance: ScpClient | undefined;

    constructor(config: IConfiguration) 
    {
        this.serverConfig = config.serverConfig;
        this.attributes = config.attributes;
    }

    public async deploy(): Promise<void> 
    {
        this.clientInstance = await Client({
            host: this.serverConfig.host,
            port: this.serverConfig.port,
            username: this.serverConfig.username,
            privateKey: this.serverConfig.privateKey,
        });

        /**
         * if not versioning
         *      delete content of public folder
         *      upload new files to public folder
         * 
         * if versioning
         *      create new folder with version as name
         *      upload files to publish files to new folder 
         */

        if (!await this.workingDirectoryExists())
            return;

        if (this.attributes.versioning)
        {
            if (!await this.checkNeededDirectoriesExists()) 
                exit(1);

            let version = await this.generateNewVersionNumber();

            this.attributes.workingDirectory = this.attributes.versionsDirectory + "/" + version;
            await this.clientInstance.mkdir(this.attributes.workingDirectory);

            await this.createSymlinkFromWorkingDirToCurrent();
        }

        await this.upload();
        await this.close();
    }

    private async checkNeededDirectoriesExists(): Promise<boolean> {
            
        let result = await this.clientInstance?.list(this.attributes.workingDirectory);
        let dirNames: string[] = this.getNamesFromList(result);

        // TODO: should not be hardcoded! 
        let pubDir: string | undefined = dirNames.find(dir => dir == "Current");
        let workDir: string | undefined = dirNames.find(dir => dir == "Versions");

        if (pubDir === undefined || workDir === undefined)
        {
            return false;
        }

        return true;
    }
    
    private async generateNewVersionNumber(): Promise<number> {
        let versionFolders = await this.clientInstance?.list(this.attributes.versionsDirectory)

        let dirNames: string[] = this.getNamesFromList(versionFolders);

        if (dirNames.length == 0) return 1;

        let dirNamesAsNumber: number[] = [];

        dirNames.forEach(dirName => {
            dirNamesAsNumber.push(parseInt(dirName, 10));
        });

        // sort in ascending order
        dirNamesAsNumber.sort((a, b) => a - b );

        console.log(dirNamesAsNumber);
        return ++dirNamesAsNumber[dirNamesAsNumber.length - 1];
    }


    private getNamesFromList(result: any): string[] {
        let dirNames: string[] = [];

        Object.keys(result).forEach(idx => {
           dirNames.push(result[idx].name);  
        });

        return dirNames;
    }

    private async workingDirectoryExists(): Promise<string | boolean> {
        if (this.clientInstance === undefined) {
            return false;
        }

        return await this.clientInstance.exists(this.attributes.workingDirectory);
    }

    private async upload(): Promise<void> {
        if (this.clientInstance === undefined) {
            return;
        }

        let deployFiles: string = this.attributes.sourceFolder;
        let workingdirectory: string = this.attributes.workingDirectory;

        return await this.clientInstance.uploadDir(deployFiles, workingdirectory);
    }

    private async close(): Promise<void> {
        if (this.clientInstance === undefined) {
            return;
        }

        return await this.clientInstance.close();
    }

    private async createSymlinkFromWorkingDirToCurrent(): Promise<void> {
        var ssh = new SSH({
            host: this.serverConfig.host,
            user: this.serverConfig.username,
            key: this.serverConfig.privateKey
        });
        
        ssh.exec("ln -sfn /home/headline/Versions/1 /home/headline/Current", {
            out: function(out: any) {
                console.log(out);
            }
        }).start();
    }
}


