import { ScpClient } from "node-scp";
import { IAttributes } from "./attributes.interface";
import { ILogger } from "./logger.interface";

export interface IServerClient {
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
    readonly logger: ILogger
    clientInstance: ScpClient | undefined;

    deploy(): Promise<void>;
}