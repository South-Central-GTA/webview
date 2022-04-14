type eventFn = (...args: any[]) => any;

export default new class AltService implements Alt {
    private _map: Map<string, any> = new Map<string, eventFn>(); 
    
    private altVExists: boolean = window["alt"] !== undefined;

    public emit(eventName: string, ...args: any[]): void {
        if (this.altVExists) {
            alt.emit(eventName, ...args);
        } else {
            console.log(`AltV-Service: Emit Event - ${eventName}`);
            console.log(`AltV-Service: Params for Event - ${JSON.stringify(args)
                .replace("[", "")
                .replace("]", "")}`
            );
        }
    }

    public emitServer(eventName: string, ...args: any[]): void {
        if (this.altVExists) {
            if (args.length === 0) {
                console.log(`Emit to server got sent.`);
                alt.emit("gui:emitserver", eventName, null);
            } else {
                alt.emit("gui:emitserver", eventName, ...args);
            }
        } else {
            console.log(`AltV-Service: Emit Event to Server - ${eventName}`);
            console.log(`AltV-Service: Params for Event to Server - ${JSON.stringify(args)
                .replace("[", "")
                .replace("]", "")}`
            );
        }
    }

    public off(eventName: string): void {
        if (this.altVExists) {
            const listener = this._map.get(eventName);
            if (!listener) {
                return;
            }
            
            alt.off(eventName, listener);
            this._map.delete(eventName);
        }
    }

    public on(eventName: string, listener: (...args: any[]) => void): void {
        if (this.altVExists) {
            if (this._map.has(eventName)) {
                console.error("AltVService: Event name '{" + eventName + "}' was already registered.")
                return;
            }

            alt.on(eventName, listener);
            this._map.set(eventName, listener);
        }
    }
}