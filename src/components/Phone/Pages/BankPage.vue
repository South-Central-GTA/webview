<template>
    <div class='bank-page'>
        <div v-if='isLoading && !loadedOnce' class='loading'>
            <img class='logo' src='@/assets/images/phone/maze-bank-logo.png' />
            <h1>{{ loadingText }}</h1>
        </div>

        <create-bank-account ref='createBankAccount' :hidden='currentTab !== 1' v-on:back='resetTab()' />
        <phone-manage-bank-accounts ref='manageBankAccounts' :hidden='currentTab !== 2' v-on:back='resetTab()' v-on:openbankaccount='openBankAccount' />
        <phone-active-bank-account ref='activeBankAccount' :hidden='currentTab !== 3' v-on:back='openTab(2)' v-on:close='openTab(0)' />

        <img class='logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='phone-bank-button-group'>
            <button class='btn' type='button' @click='openTab(1)'>
                Konto eröffnen
            </button>
            <button class='btn' type='button' @click='openTab(2)'>
                Konten verwalten
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import banking from "@/scripts/services/banking.service";
import character from "@/scripts/services/character.service";
import CreateBankAccount from "@/components/Phone/Pages/Components/BankPages/CreateBankAccount.vue";
import PhoneManageBankAccounts from "@/components/Phone/Pages/Components/BankPages/PhoneManageBankAccounts.vue";
import PhoneActiveBankAccount from "@/components/Phone/Pages/Components/BankPages/PhoneActiveBankAccount.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

@Options({
    components: {
        CreateBankAccount, PhoneManageBankAccounts, PhoneActiveBankAccount,
    },
})
export default class BankPage extends Vue {
    @Ref() private readonly createBankAccount!: CreateBankAccount;
    @Ref() private readonly manageBankAccounts!: PhoneManageBankAccounts;
    @Ref() private readonly activeBankAccount!: PhoneActiveBankAccount;
    private currentTab = 0;
    private bankAccounts: BankAccountInterface[] = [];
    private currentBankAccount!: BankAccountInterface;
    private isLoading = false;
    private loadedOnce = false;
    private loadingText = "";
    private loadingInt = 0;

    get isCreatingAccount() {
        return this.createBankAccount.isCreatingAccount;
    }

    get getTab() {
        return this.currentTab;
    }

    public mounted(): void {
        banking
            .getInstance()
            .onChange.on((bankAccounts: BankAccountInterface[]) => this.setup(bankAccounts));
    }

    public unmounted(): void {
        banking
            .getInstance()
            .onChange.off((bankAccounts: BankAccountInterface[]) => this.setup(bankAccounts));
    }

    public open(): void {
        if (this.loadedOnce) {
            alt.emitServer("phonebank:requestapp");
        } else {
            setTimeout(() => {
                alt.emitServer("phonebank:requestapp");

                this.isLoading = false;
                this.loadedOnce = true;
            }, 2000);
        }

        this.isLoading = true;

        let step = 0;
        this.loadingText = "Anmeldung läuft ...";

        if (this.loadingInt !== undefined) {
            clearInterval(this.loadingInt);
        }
        this.loadingInt = setInterval(() => {
            if (step === 0) {
                this.loadingText = "Anmeldung läuft .";
            }
            if (step === 1) {
                this.loadingText = "Anmeldung läuft ..";
            }
            if (step === 2) {
                this.loadingText = "Anmeldung läuft ...";
            }

            step++;
            if (step === 3) {
                step = 0;
            }
            if (!this.isLoading) {
                clearInterval(this.loadingInt);
            }
        }, 500);
    }

    public resetLoading(): void {
        this.isLoading = false;
        this.loadedOnce = false;
    }

    public resetTab(): void {
        this.openTab(0);
        this.activeBankAccount.resetTab();
    }

    private setup(bankAccounts: BankAccountInterface[]): void {
        this.bankAccounts = bankAccounts;

        const ownedBankAccounts = this.bankAccounts.filter(
            (b) => b.characterAccesses.find((ca) => ca.characterId == character.getInstance().getCharacterId)?.owner);
        this.createBankAccount?.setup(ownedBankAccounts.length === 0);

        if (this.currentTab === 3) {
            const bankAccount = this.bankAccounts.find((b) => b.id === this.currentBankAccount.id);
            if (bankAccount) {
                this.activeBankAccount.setup(bankAccount);
            }
        }
    }

    private openBankAccount(id: number): void {
        const bankAccount = this.bankAccounts.find((b) => b.id === id);
        if (bankAccount === undefined || bankAccount.status !== 1) {
            return;
        }

        this.currentBankAccount = bankAccount;
        this.activeBankAccount.setup(this.currentBankAccount);

        this.openTab(3);
    }

    private openTab(id: number): void {
        this.currentTab = id;
    }
}
</script>

<style lang='scss' scoped>
.bank-page {
    height: 100%;

    background-color: rgb(221, 221, 221);
    background-position: center center;
    background-size: 30vw;
}

.loading {
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background-color: rgb(221, 221, 221);
    background-position: center center;
    background-size: 15vw;
    z-index: 100;
}

.loading h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1vw;
    width: 100%;
    color: var(--gray);
}

.loading .order-products-icon {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5vw;
    color: var(--gray);
}

.logo {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 25%;
}
</style>
