import core = require("@actions/core");
import github = require("@actions/github");
import Client = require('node-scp');

try 
{
    const host: string = core.getInput("host");
    const user: string = core.getInput("user");
    const password: string = core.getInput("password");
    const path: string = core.getInput("path");
    const port: string = core.getInput("port");

    console.log(`host: ${host}`);
    console.log(`user: ${user}`);
    console.log(`password: ${password}`);

    /**
     * pseudo-code
     * 1. create folder on remote server with incrementing values
     * 2. push /dist folder content to this folder
     */
    test(host, port, user, password, path);
}

catch (error) 
{
    core.setFailed(error.message); 
}

async function test(host: string, port: string, username: string, password: string, path: string) 
{
    let client = await Client.Client(
    {
        host: host,
        port: port,
        username: username,
        password: password,
        path: path
        // privateKey: fs.readFileSync('./key.pem'),
        // passphrase: 'your key passphrase',
    });

    await client.mkdir(path)

    client.close() // remember to close connection after you finish
}
