import { IConfiguration } from "../src/interfaces/configuration.interface";
import { ServerClient } from "../src/serverClient";
import Client, { ScpClient } from "node-scp";


describe("Testing happy path", () => 
{

    let config: IConfiguration = 
    {
        serverConfig: 
        {
            host: "hostname.no",
            username: "username",
            port: 22,
            privateKey: "privateKey"
        },
        attributes: 
        {
            workingDirectory: "/home/username",
            sourceFolder: "./my-source-files",
            destinationFolder: undefined,
            versioning: undefined,
            publicDirectory: undefined,
            versionsDirectory: undefined,
        }
    }

    let client = new ServerClient(config);

    test("Configuration is set correctly", () => 
    {
        expect(client.serverConfig.host).toBe(config.serverConfig.host);
        expect(client.serverConfig.username).toBe(config.serverConfig.username);
        expect(client.serverConfig.port).toBe(config.serverConfig.port);
        expect(client.serverConfig.privateKey).toBe(config.serverConfig.privateKey);
        expect(client.attributes.workingDirectory).toBe(config.attributes.workingDirectory);
    });
});