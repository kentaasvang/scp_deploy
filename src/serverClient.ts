import Client, { ScpClient } from "node-scp";
import { exit } from "process";
import { IAttributes } from "./interfaces/attributes.interface";
import { IServerClient } from "./interfaces/serverClient.interface";

let SSH = require("simple-ssh");


export class ServerClient implements IServerClient {
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
    readonly client: Promise<ScpClient> | undefined;

    clientInstance: ScpClient | undefined;

    constructor(connectionCredentials: IServerConfig, attributes: IAttributes) {
        this.serverConfig = connectionCredentials;
        this.attributes = attributes;
    }

    public async deploy(): Promise<void> {

        this.clientInstance = await Client({
            host: this.serverConfig.host,
            port: this.serverConfig.port,
            username: this.serverConfig.username,
            privateKey: this.serverConfig.privateKey,
        });


        if (!await this.workingDirectoryExists()) {
            return;
        }

        if (this.attributes.versioning)
        {
            // check that workingDirectory contains Version and Current folder
            if (!await this.checkNeededDirectoriesExists()) exit(1);

            // generate buildnumber -> get build number from version-dir on server? 
            let version = await this.generateNewVersionNumber();

            // create new folder with build number
            this.attributes.workingDirectory = this.attributes.versionsDirectory + "/" + version;
            console.log("here 1");
            console.log(version);
            console.log(this.attributes.workingDirectory);
            await this.clientInstance.mkdir(this.attributes.workingDirectory);

            // TODO: create symlink from new build folder to current
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
            console.log("False!");
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

        let uploadDir: string = this.attributes.uploadDirectory;
        let workingdirectory: string = this.attributes.workingDirectory;

        return await this.clientInstance.uploadDir(uploadDir, workingdirectory);
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
        
        ssh.exec("ln -sfn /home/headline/Versions/2 /home/headline/Current", {
            out: function(out: any) {
                console.log(out);
            }
        }).start();
    }
}


