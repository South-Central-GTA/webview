export class ServerEventCustomError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
