import { exit } from "process";
import { IServerClient, ServerClient } from "./clients/serverClient";
import { ILogger } from "./logger/logger";
import { IClientSettings } from "./settings/clientSettings";

const 
    fs = require("fs"),
    core = require("@actions/core"),
    logger: ILogger = require("pino")({ level: "debug" }
    );

async function main(): Promise<number> 
{
    let settings: IClientSettings = ClientSettings.get();
    let client: IServerClient = new ServerClient(settings, logger);
    let action: Action = new Action(client);

    const configLogSafe = 
    { 
        ...settings, 
        privateKey: "***"
    };

    logger.debug(`Created client w/ config: ${JSON.stringify(configLogSafe)}`);

    await action.run()
    exit(0);
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

class ClientSettings
{
    public static get(): IClientSettings 
    {
        const host: string = core.getInput("host");
        const username: string = core.getInput("user");
        const port: number = parseInt(core.getInput("port"));
        const privateKey: string = core.getInput("private_key");
        const sourceFolder: string = core.getInput("source_folder");
        const destinationFolder: string = core.getInput("destination_folder");

        return {
            host: host,
            username: username,
            port: port,
            privateKey: privateKey,
            sourceFolder: sourceFolder,
            destinationFolder: destinationFolder,
        }
    }
}

main();

