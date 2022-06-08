import alt from "@/scripts/services/alt.service";
import LiteEvent from "@/scripts/systems/lite-event";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

export default class BankingService {
    private static instance: BankingService;

    private constructor() {
        // do something construct...
    }

    static getInstance() {
        if (!BankingService.instance) {
            BankingService.instance = new BankingService();
            // ... any one time initialization goes here ...
        }
        return BankingService.instance;
    }

    get hasBankAccount() {
        return this.bankAccounts.length != 0;
    }

    get getBankAccounts() {
        return this.bankAccounts;
    }

    get onChange() {
        return this.onBankAccountsChanged.expose();
    }

    private readonly onBankAccountsChanged = new LiteEvent<BankAccountInterface[]>();
    private bankAccounts: BankAccountInterface[] = [];

    public listenToEvents(): void {
        alt.on("bank:updatebankaccounts", (args: any[]) =>
            this.updateBankAccounts(args[0])
        );
    }

    private updateBankAccounts(bankAccounts: BankAccountInterface[]): void {
        this.bankAccounts = bankAccounts;
        this.onBankAccountsChanged.trigger(this.bankAccounts);
    }
}
