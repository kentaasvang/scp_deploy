import { ScpClient } from "node-scp";
import { IAttributes } from "./attributes.interface";

export interface IServerClient {
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
    clientInstance: ScpClient | undefined;

    deploy(): Promise<void>;
}