export class ServerEventTimeoutError extends Error {
    constructor() {
        super("Server took to long to answer request.");
    }
}
