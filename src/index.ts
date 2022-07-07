import { exit } from "process";
import { IServerClient } from "./interfaces/serverClient.interface";
import { ServerClient } from "./serverClient";
import { IConfiguration } from "./interfaces/configuration.interface";

import fs = require("fs");

import core = require("@actions/core");

async function main(): Promise<number> {
    try {
        let config: IConfiguration = Config.get();
        let client: IServerClient = new ServerClient(config.serverConfig, config.attributes);
        let action: Action = new Action(client);

        await action.run()

        exit(0);
    } catch (error: any) {
        core.setFailed(error.message); 
        exit(1);
    }
}


class Action {
    client: IServerClient;

    public constructor(client: IServerClient) {
        this.client = client;
    }

    public async run(): Promise<void> {
        await this.client.deploy();
    }
}


class Config
{
    public static get(): IConfiguration {

        const host: string = core.getInput("host");
        const username: string = core.getInput("user");
        const workingDirectory: string = core.getInput("workingDirectory");
        const port: number = parseInt(core.getInput("port"));
        const privateKey: string = core.getInput("private_key");
        const versioning: boolean = core.getInput("versioning") == "true";
        const uploadDirectory: string = core.getInput("upload_directory");

        return {
            serverConfig: {
                host: host,
                username: username,
                port: port,
                privateKey: privateKey
            },
            attributes: {
                workingDirectory: workingDirectory,
                uploadDirectory: uploadDirectory,
                versioning: versioning
            }
        }
    }
}


main();