import { IAttributes } from "./attributes.interface";

export interface IConfiguration {
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
}