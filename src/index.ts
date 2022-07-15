import { exit } from "process";
import { IServerClient } from "./interfaces/serverClient.interface";
import { ServerClient } from "./serverClient";
import { IConfiguration } from "./interfaces/configuration.interface";


const 
    fs = require("fs"),
    core = require("@actions/core");


async function main(): Promise<number> 
{
    try 
    {
        let config: IConfiguration = Config.get();
        let client: IServerClient = new ServerClient(config);
        let action: Action = new Action(client);

        await action.run()
        exit(0);
    } 
    catch (error: any) 
    {
        core.setFailed(error.message); 
        exit(1);
    }
}


class Action 
{
    client: IServerClient;

    public constructor(client: IServerClient) 
    {
        this.client = client;
    }

    public async run(): Promise<void> 
    {
        await this.client.deploy();
    }
}


class Config
{
    public static get(): IConfiguration {
/*
        const host: string = core.getInput("host");
        const username: string = core.getInput("user");
        const workingDirectory: string = core.getInput("workingDirectory");
        const port: number = parseInt(core.getInput("port"));
        const privateKey: string = core.getInput("private_key");
        const versioning: boolean = core.getInput("versioning") == "true";
        const uploadDirectory: string = core.getInput("source_folder");
        const publicDirectory: string = core.getInput("public_directory");
        const versionsDirectory: string = core.getInput("versions_directory");
        */
        const host: string = "headlinev3.no";
        const username: string = "headline";
        const port: number = 22;
        const privateKey: string = fs.readFileSync("private_key/id_rsa").toString();
        const versioning: boolean = true;
        const sourceFolder: string = "./dist";
        const workingDirectory: string = "/home/headline";
        const publicDirectory: string = "Current";
        const versionsDirectory: string = "Versions";

        return {
            serverConfig: {
                host: host,
                username: username,
                port: port,
                privateKey: privateKey
            },
            attributes: {
                workingDirectory: workingDirectory,
                sourceFolder: sourceFolder,
                versioning: versioning,
                publicDirectory: workingDirectory + "/" + publicDirectory,
                versionsDirectory: workingDirectory + "/" + versionsDirectory,
            }
        }
    }
}


main();