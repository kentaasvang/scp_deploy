import core = require("@actions/core");
import github = require("@actions/github");
import Client = require('node-scp');
import fs = require("fs");
import { exit } from "process";

async function main()
{
    try 
    {
    //    const host: string = core.getInput("host");
    //    const username: string = core.getInput("user");
    //    const path: string = core.getInput("path");
    //    const port: string = core.getInput("port");
    //    const privateKey: string = core.getInput("private_key");

        const host: string = "headlinev3.no";
        const username: string = "headline";
        const path: string = "/home/headline/test_file";
        const port: number = 22;
        const privateKey: string = fs.readFileSync("./private_key/id_rsa").toString();

        let client: Client.ScpClient = await getClient(host, port, username, privateKey);

        // check that base exists (Versions)
        if (!await client.exists(path))
        { 
            await client.mkdir(path);
        }

        // create sub-directory (file with incrementing value)
        // TODO: check after build-number on node or github.. or date?
        if (!await client.exists(path + "/4000"))
        {
            await client.mkdir(path + "/4000")
        }

        // push dist-folder content to build-file
        await client.uploadDir("./dist", path + "/4000");

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