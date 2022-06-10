<template>
    <div class='phone-manage-bank-accounts'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Konten verwalten</span>
            </button>
        </div>

        <img class='phone-bank-logo pb-3' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='bank-accounts-block'>
            <div v-for='bankAccount in bankAccounts' v-bind:key='bankAccount.id'>
                <div class='bank-account text-center' @click='openBankAccount(bankAccount.id)'>
                    <h1>{{ bankAccount.bankDetails }}</h1>
                    <h2 v-if='bankAccount.status === 0'>Wird noch eingerichtet ...</h2>
                    <h2 v-if='bankAccount.status === 1'>${{ bankAccount.amount }}</h2>
                    <h2 v-if='bankAccount.type === 0' class='fst-italic'>Privatkonto</h2>
                    <h2 v-if='bankAccount.type === 1' class='fst-italic'>Gruppenkonto</h2>
                </div>
            </div>

            <div v-if='bankAccounts.length === 0' class='no-bank-accounts-block'>
                <h2>Keine Konten verfügbar...</h2>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import banking from "@/scripts/services/banking.service";
import {Vue} from "vue-class-component";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

export default class PhoneManageBankAccounts extends Vue {
    private bankAccounts: BankAccountInterface[] = [];

    public mounted(): void {
        banking
            .getInstance()
            .onChange.on((bankAccounts: BankAccountInterface[]) => this.setup(bankAccounts));
    }

    private setup(bankAccounts: BankAccountInterface[]): void {
        this.bankAccounts = bankAccounts;
    }

    private back(): void {
        this.$emit("back");
    }

    private openBankAccount(id: number): void {
        this.$emit("openbankaccount", id);
    }
}
</script>

<style lang='scss' scoped>
.phone-manage-bank-accounts {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.bank-accounts-block {
    overflow: auto;
    margin: auto;
    width: 100%;
    height: 25.4vh;
}

.no-bank-accounts-block h2 {
    text-align: center;
    color: rgba(59, 59, 59, 0.7);
    font-size: 0.9vw;
}

.bank-account {
    background-color: rgb(233, 33, 42);
    padding: 0.8vw;
    margin: 0.3vw 0.9vw;
}

.bank-account:hover {
    background-color: rgb(192, 27, 35);
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
