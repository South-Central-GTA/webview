import LiteEvent from "@/scripts/systems/lite-event";

export default class MdcService {
    private static instance: MdcService;
    private isOperator: boolean = false;
    private readonly onIsOperator = new LiteEvent<boolean>();

    private constructor() {
        // do something construct...
    }

    get onIsOperatorChanged() {
        return this.onIsOperator.expose();
    }

    static getInstance() {
        if (!MdcService.instance) {
            MdcService.instance = new MdcService();
            // ... any one time initialization goes here ...
        }
        return MdcService.instance;
    }

    public listenToEvents(): void {
        alt.on("mdc:updateoperatorpermission", (args: any[]) => this.onUpdateOperatorPermission(args[0]));
    }

    private onUpdateOperatorPermission(isOperator: boolean): void {
        this.isOperator = isOperator;
        this.onIsOperator.trigger(this.isOperator);
    }
}
