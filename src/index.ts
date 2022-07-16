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
        validateConfig(config);
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

function validateConfig(config: IConfiguration) 
{
    if (config.attributes.createSymlink && !config.attributes.publicDirectory)
    {
        logger.error(`Can't create symbolic link when public directory isn't specified.`);
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
        /*
        const host: string = core.getInput("host");
        const username: string = core.getInput("user");
        const port: number = parseInt(core.getInput("port"));
        const privateKey: string = core.getInput("private_key");
        const versioning: boolean = core.getInput("versioning") == "true";
        const uploadDirectory: string = core.getInput("source_folder");
        const publicDirectory: string = core.getInput("public_directory");
        const versionsDirectory: string = core.getInput("versions_directory");
        const createFolders: boolean = core.getInput("create_folders");
        const createSymlink: boolean = core.getInput("create_symlink");
        */
        const host: string = "headlinev3.no";
        const username: string = "headline";
        const port: number = 22;
        const privateKey: string = fs.readFileSync("private_key/id_rsa").toString();
        const versioning: boolean = true;
        const sourceFolder: string = "./dist";
        const destinationFolder: string = "/home/headline/TestFolder";
        const publicDirectory: string = "/home/headline/Current";
        const createFolders: boolean = true;
        const createSymlink: boolean = true;

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
                versioning: versioning,
                publicDirectory: publicDirectory,
                createFolders: createFolders,
                createSymlink: createSymlink
            }
        }
    }
}

main();

