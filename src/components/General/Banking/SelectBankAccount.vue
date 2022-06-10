<template>
    <div class='select-bank-account'>
        <select :disabled='bankAccounts.length <= 1' class='form-select' @change='onChange($event)'>
            <option :hidden='bankAccounts.length != 0'>Bankkonto benötigt</option>
            <option v-for='(bankAccount, i) in bankAccounts' v-bind:key='bankAccount.id' :hidden='bankAccounts.length == 0' :selected='selectedIndex == i' :value='bankAccount.id'>
                {{ bankAccount.bankDetails }}
            </option>
        </select>
    </div>
</template>

<script lang='ts'>
import banking from "@/scripts/services/banking.service";
import {Vue} from "vue-class-component";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

export default class SelectBankAccount extends Vue {
    private bankAccounts: BankAccountInterface[] = [];
    private selectedIndex = 0;

    get hasBank() {
        return this.bankAccounts.length != 0;
    }

    public mounted(): void {
        banking
            .getInstance()
            .onChange.on((bankAccounts: BankAccountInterface[]) => this.update(bankAccounts));

        this.setup(banking.getInstance().getBankAccounts, false);
    }

    public unmounted(): void {
        banking
            .getInstance()
            .onChange.off((bankAccounts: BankAccountInterface[]) => this.update(bankAccounts));
    }

    public setBankAccount(id: number, fireEvent = false): void {
        if (this.bankAccounts.length == 0) {
            return;
        }

        const bankAccount = this.bankAccounts.find((ba) => ba.id === id);
        if (bankAccount === undefined) {
            return;
        }

        this.selectedIndex = this.bankAccounts.indexOf(bankAccount);

        if (fireEvent) {
            this.$emit("change-bank-account", bankAccount);
        }
    }

    private update(bankAccounts: BankAccountInterface[]): void {
        this.setup(bankAccounts, false);
    }

    private setup(bankAccounts: BankAccountInterface[], fireEvent = true): void {
        this.bankAccounts = bankAccounts;

        if (this.bankAccounts.length != 0) {
            this.setBankAccount(this.bankAccounts[0].id, fireEvent);
            this.$emit("setup", this.bankAccounts[0]);
        }
    }

    private onChange(eventData: any) {
        this.setBankAccount(Number(eventData.target.value), true);
    }
}
</script>

<style scoped>
select {
    width: 100%;
    height: 100%;
    border: none;
    background-color: rgba(0, 0, 0, 0.3);
    color: var(--gray);
    padding: 0.3vw;
    border-radius: 0.3vw;
    font-size: 0.8vw;
    outline: none !important;
}

.form-select {
    font-size: 0.7vw;
}

select:disabled {
    background-color: rgba(0, 0, 0, 0.2);
}

option:checked {
    display: none;
}
</style>
