export interface CommandInterface {
    name: string;
    description: string;
    parameterDescription: string[];
    greedyArg: boolean;
    aliases: string[];
}
