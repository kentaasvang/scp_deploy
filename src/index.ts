import { exit } from "process";
import { IServerClient } from "./interfaces/serverClient.interface";
import { ServerClient } from "./serverClient";
import { IConfiguration } from "./interfaces/configuration.interface";
import { ILogger } from "./interfaces/logger.interface";

const 
    fs = require("fs"),
    core = require("@actions/core"),
    logger: ILogger = require("pino")({
        level: "debug"
    });

async function main(): Promise<number> 
{
    try 
    {
        let config: IConfiguration = Config.get();
        let client: IServerClient = new ServerClient(config, logger);
        let action: Action = new Action(client);

        const configLogSafe = 
        { 
            ...config, 
            serverConfig: 
            {
                ...config.serverConfig,
                privateKey: "***"
            }
        };
        logger.info(`Created client w/ config: ${JSON.stringify(configLogSafe)}`);

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
    public static get(): IConfiguration 
    {
        const host: string = core.getInput("host");
        const username: string = core.getInput("user");
        const port: number = parseInt(core.getInput("port"));
        const privateKey: string = core.getInput("private_key");
        const sourceFolder: string = core.getInput("source_folder");
        const destinationFolder: string = core.getInput("destination_folder");

        return {
            serverConfig: 
            {
                host: host,
                username: username,
                port: port,
                privateKey: privateKey
            },
            attributes: 
            {
                sourceFolder: sourceFolder,
                destinationFolder: destinationFolder,
            }
        }
    }
}

main();

