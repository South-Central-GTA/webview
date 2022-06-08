import alt from "@/scripts/services/alt.service";

class EventBusService {
    public async sendEventWithResponse<Type>(
        eventName: string,
        ...args: any[]
    ): Promise<Type> {
        return new Promise<Type>((resolve) => {
            alt.emitServer(eventName, ...args);

            alt.on(eventName, (args: any[]) => {
                alt.off(eventName);
                return resolve(args[0]);
            });
        });
    }
}

// Export a singleton instance in the global namespace
export const eventBusService = new EventBusService();
