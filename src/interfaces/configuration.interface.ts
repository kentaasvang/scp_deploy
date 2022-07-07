import { IAttributes } from "./attributes.interface";

export interface IConfiguration
{
    readonly actionConfig: IActionConfig;
    readonly serverConfig: IServerConfig;
    readonly attributes: IAttributes;
}