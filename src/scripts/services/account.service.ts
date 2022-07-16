import alt from "@/scripts/services/alt.service";
import LiteEvent from "@/scripts/systems/lite-event";
import {AccountInterface} from "@/scripts/interfaces/account.interface";

export default class AccountService {
    private static instance: AccountService;
    private readonly onAccountChanged = new LiteEvent<AccountInterface>();
    private _account?: AccountInterface;

    private constructor() {
        // do something construct...
    }

    get accountChanged() {
        return this.onAccountChanged.expose();
    }

    get account() {
        return this._account;
    }

    static getInstance() {
        if (!AccountService.instance) {
            AccountService.instance = new AccountService();
            // ... any one time initialization goes here ...
        }
        return AccountService.instance;
    }

    public listenToEvents(): void {
        alt.on("account:sync", (account: AccountInterface) => this.setup(account));
    }

    private setup(account: AccountInterface): void {
        this._account = account;

        if (this._account !== undefined) {
            this.onAccountChanged.trigger(this._account);
        }
    }
}
