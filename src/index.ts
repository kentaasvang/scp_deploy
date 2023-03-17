import { exit } from "process";
import { IServerClient, ServerClient } from "./clients/serverClient";
import { ILogger } from "./logger/logger.interface";
import { IClientSettings } from "./settings/clientSettings";

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
        let config: IClientSettings = ClientSettings.get();
        let client: IServerClient = new ServerClient(config, logger);
        let action: Action = new Action(client);

        const configLogSafe = 
        { 
            ...config, 
            privateKey: "***"
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

class ClientSettings
{
    public static get(): IClientSettings 
    {
        // const host: string = core.getInput("host");
        // const username: string = core.getInput("user");
        // const port: number = parseInt(core.getInput("port"));
        // const privateKey: string = core.getInput("private_key");
        // const sourceFolder: string = core.getInput("source_folder");
        // const destinationFolder: string = core.getInput("destination_folder");

        // for testing
        const host: string = "lagdincv.no";
        const username: string = "kent";
        const port: number = 22; 
        const privateKey: string = fs.readFileSync("./private_key/id_rsa", "utf-8");
        const sourceFolder: string = "./dist";
        const destinationFolder: string = "/home/kent/scp_deploy_test" 

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

