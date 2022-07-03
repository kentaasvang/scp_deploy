import core = require("@actions/core");
import github = require("@actions/github");
import Client = require('node-scp');
import fs = require("fs");
import { exit } from "process";

async function main()
{
    try 
    {
        const host: string = core.getInput("host");
        const username: string = core.getInput("user");
        const basePath: string = core.getInput("base_path");
        const dirToUpload: string = core.getInput("dir_to_upload");
        const port: number = parseInt(core.getInput("port"));
        const privateKey: string = core.getInput("private_key");
        const buildNumber: string = core.getInput("build_number");

        let client: Client.ScpClient = await getClient(host, port, username, privateKey);

        // check that base exists (Versions)
        if (!await client.exists(basePath))
        { 
            exit(1);
        }

        // create folder with unique value
        if (await client.exists(basePath + "/" + buildNumber))
        { 
            exit(1);
        }
        
        // create file
        await client.mkdir(basePath + "/" + buildNumber);

        // push dist-folder content to build-file
        await client.uploadDir(dirToUpload, basePath + "/" + buildNumber);

        /**
         * 2. push /dist folder content to this folder
         */

        // 3. Create folder in versionsk
        client.close();
        exit(0);
    }

    catch (error) 
    {
        core.setFailed(error.message); 
        exit(1);
    }
}

async function getClient
(
    host: string, 
    port: number,
    username: string, 
    privateKey: string
) : Promise<Client.ScpClient>
{
    let client = await Client.Client(
    {
        host: host,
        port: port,
        username: username,
        privateKey: privateKey,
    });

//    await client.mkdir(path)

//    client.close() // remember to close connection after you finish
    return client;
}

main();