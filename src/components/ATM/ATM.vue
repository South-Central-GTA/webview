<template>
    <div :hidden='!active' class='atm center' v-bind:class='{ enable: active, disable: !active }'>
        <button class='atm-close-button float-end' type='button' @click='close()'>
            <font-awesome-icon class='center' icon='sign-out-alt' />
        </button>

        <active-bank-account ref='activeBankAccount' :hidden='currentTab !== 1' v-on:back='resetTab()' v-on:close='close()' />

        <img class='logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='bank-accounts-block'>
            <div v-for='bankAccount in bankAccounts' v-bind:key='bankAccount.id'>
                <div class='bank-account' @click='openBankAccount(bankAccount)'>
                    <h1>{{ bankAccount.bankDetails }}</h1>
                    <h2 v-if='bankAccount.status !== 0'>${{ bankAccount.amount }}</h2>
                    <h2 v-if='bankAccount.status === 0'>Wird noch eingerichtet ...</h2>
                    <h2 v-if='bankAccount.type === 0'>Privatkonto</h2>
                    <h2 v-if='bankAccount.type === 1'>Gruppenkonto</h2>
                </div>
            </div>
        </div>
        <div v-if='bankAccounts.length === 0' class='no-bank-accounts-block'>
            <h2>Keine Konten verfügbar...</h2>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import banking from "@/scripts/services/banking.service";
import ActiveBankAccount from "./Pages/ActiveBankAccount.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

@Options({
    components: {
        ActiveBankAccount,
    },
})
export default class ATM extends Vue {
    @Ref() private readonly activeBankAccount!: ActiveBankAccount;

    private active = false;
    private bankAccounts: BankAccountInterface[] = [];
    private currentTab = 0;
    private currentBankAccount!: BankAccountInterface;

    public mounted(): void {
        banking
            .getInstance()
            .onChange.on((bankAccounts: BankAccountInterface[]) => this.update(bankAccounts));

        alt.on("atm:openmenu", () => this.open());
    }

    public unmounted(): void {
        alt.off("atm:openmenu");
    }

    public resetTab(): void {
        this.openTab(0);
    }

    private open(): void {
        this.active = true;
    }

    private update(bankAccounts: BankAccountInterface[]): void {
        this.bankAccounts = bankAccounts;

        if (this.currentTab === 1) {
            const bankAccount = this.bankAccounts.find((b) => b.id === this.currentBankAccount.id);

            if (bankAccount) {
                this.activeBankAccount.setup(bankAccount);
            }
        }
    }

    private close(): void {
        this.active = false;
        this.resetTab();
        alt.emit("menu:close");
    }

    private openTab(id: number): void {
        this.currentTab = id;
    }

    private openBankAccount(bankAccount: BankAccountInterface): void {
        if (bankAccount === undefined || bankAccount.status === 0) return;

        this.currentBankAccount = bankAccount;
        this.activeBankAccount.setup(bankAccount);
        this.openTab(1);
    }
}
</script>

<style scoped>
.atm {
    width: 40vw;
    height: 25vw;
    background-color: white;
    border-radius: 1vw;

    text-align: center;
    overflow: hidden;

    background-image: url("../../assets/images/patterns/checks.png");
    background-position: center center;
    background-size: 20vw;
}

.logo {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -20%);
    height: 20%;
}

.bank-header {
    position: absolute;
    top: 39%;
    left: 50%;
    transform: translate(-50%, -39%);
    width: 100%;
    font-size: 0.9vw;
}

.bank-accounts-block {
    position: absolute;
    overflow-y: auto;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -0%);
    width: 100%;
    height: 25vh;
    pointer-events: all;
}

.no-bank-accounts-block h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(59, 59, 59, 0.7);
    font-size: 0.9vw;
}

.bank-account {
    background-color: rgb(37, 37, 37);
    padding: 0.8vw;
    margin: 0.3vw 10vw;
}

.bank-account h1 {
    color: white;
    font-size: 0.6vw;
    margin: unset;
}

.bank-account h2 {
    padding-top: 0.2vw;
    color: white;
    font-size: 0.5vw;
    margin: unset;
}

.bank-account h3 {
    padding-bottom: 0.2vw;
    color: white;
    font-size: 0.5vw;
    margin: unset;
}
</style>
