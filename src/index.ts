import { Client, ScpClient } from "node-scp";
import { exit } from "process";
import { IServerClient } from "./interfaces/serverClient.interface";
import { ServerClient } from "./serverClient";

import core = require("@actions/core");
import fs = require("fs");

async function main(): Promise<number>
{
    try 
    {
        let config: IConfiguration = Config.get();
        let client: IServerClient = new ServerClient(config.serverConfig);
        let action: Action = new Action(config.actionConfig, client);
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
    config: IActionConfig;
    client: IServerClient;

    public constructor(config: IActionConfig, client: IServerClient)
    {
        this.config = config;
        this.client = client;
    }

    public async run(): Promise<void>
    {
        // let client: ScpClient = await this.getClient(this.config.serverConfig);
        await this.client.initiate();

        // check that base exists (Versions)
        if (!await this.client.exists(this.config.basePath))
        { 
            exit(1);
        }

        // create folder with unique value
        if (await this.client.exists(this.config.basePath + "/" + this.config.buildNumber))
        { 
            exit(1);
        }
        
        // create file
        await this.client.mkdir(this.config.basePath + "/" + this.config.buildNumber);

        // push dist-folder content to build-file
        await this.client.uploadDir(this.config.dirToUpload, this.config.basePath + "/" + this.config.buildNumber);

        await this.client.close();
    }

    private async getClient(credentials: IServerConfig) : Promise<ScpClient>
    {
        let client = await Client(
        {
            host: credentials.host,
            port: credentials.port,
            username: credentials.username,
            privateKey: credentials.privateKey,
        });

        return client;
    }
}


class Config
{
    public static get(): IConfiguration
    {
//        const host: string = core.getInput("host");
//        const username: string = core.getInput("user");
//        const basePath: string = core.getInput("base_path");
//        const dirToUpload: string = core.getInput("dir_to_upload");
//        const port: number = parseInt(core.getInput("port"));
//        const privateKey: string = core.getInput("private_key");
//        const buildNumber: string = core.getInput("build_number");
        const host: string = "headlinev3.no";
        const username: string = "headline";
        const basePath: string = "/home/headline/Versions";
        const dirToUpload: string = "./dist";
        const port: number = 22;
        const privateKey: string = fs.readFileSync("private_key/id_rsa").toString();
        const buildNumber: string = "42";

        return {
            actionConfig: {
                basePath: basePath,
                dirToUpload: dirToUpload,
                buildNumber: buildNumber
            },
            serverConfig: {
                host: host,
                username: username,
                port: port,
                privateKey: privateKey
            }
        }
    }
}


main();