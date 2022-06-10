<template>
    <div class='team-menu-bank-accounts'>
        <div v-if='!isPopupOpen'>
            <h2>Bankkonten</h2>
            <input v-model='searchBar' class='form-control-dark mb-2' placeholder='Suche nach einer Kontonummer' type='text' @input='search()' />

            <div class='table-holder'>
                <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Kontonummer</th>
                        <th>Kontostand</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='bankAccount in bankAccounts' v-bind:key='bankAccount.id' class='entry' @click='openDetails(bankAccount)'>
                        <td>{{ bankAccount.id }}</td>
                        <td>{{ bankAccount.bankDetails }}</td>
                        <td>{{ bankAccount.amount }}$</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class='details'>
            <button class='icon-button text-white' @click='closeDetails()'>
                <font-awesome-icon class='mx-2' icon='chevron-left' />
                <span>Bankkonto: {{ this.openBankAccount.bankDetails }}</span>
            </button>

            <div class='detail-table-holder'>
                <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>Typ</th>
                        <th>Verwendungszweck</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='entry in this.openBankAccount.history' v-bind:key='entry.id' class='entry'>
                        <td>{{ getType(entry.type) }}</td>
                        <td>{{ entry.purposeOfUse }}</td>
                        <td>{{ entry.income ? "+" : "-" }}{{ entry.amount }}$</td>
                        <td>{{ getDate(entry.sendetAtJson) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class='detail-table-holder'>
                <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>Charakter ID</th>
                        <th>Charakter Name</th>
                        <th>Besitzer</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='access in this.openBankAccount.characterAccesses' v-bind:key='access.characterId' class='entry'>
                        <td>{{ access.characterId }}</td>
                        <td>{{ access.name }}</td>
                        <td>{{ access.owner ? "Ja" : "Nein" }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class='detail-table-holder'>
                <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>Gruppen ID</th>
                        <th>Gruppen Name</th>
                        <th>Besitzer</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='access in this.openBankAccount.groupAccesses' v-bind:key='access.characterId' class='entry'>
                        <td>{{ access.groupId }}</td>
                        <td>{{ access.name }}</td>
                        <td>{{ access.owner ? "Ja" : "Nein" }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {BankHistoryEntryInterface} from "@/scripts/interfaces/bank/bank-history-entry.interface";
import {BankHistoryType} from "@/scripts/enums/bank-history.type";

export default class TeamMenuBankAccounts extends Vue {
    @Ref() private readonly mailContextElement!: HTMLDivElement;

    private bankAccounts: BankAccountInterface[] = [];
    private cachedBankAccounts: BankAccountInterface[] = [];
    private searchBar = "";
    private isPopupOpen = false;

    private openBankAccount!: BankAccountInterface;

    public open(): void {
        alt.emitServerWithResponse<BankAccountInterface[]>("bankaccountcatalog:open")
            .then((bankAccounts: BankAccountInterface[]) => {
                this.bankAccounts = bankAccounts;
                this.cachedBankAccounts = this.bankAccounts;
                this.isPopupOpen = false;
            });
    }

    private openDetails(bankAccount: BankAccountInterface): void {
        this.openBankAccount = bankAccount;
        this.openBankAccount.history.sort((a: BankHistoryEntryInterface, b: BankHistoryEntryInterface) => {
            return this.getTime(b.sendetAtJson) - this.getTime(a.sendetAtJson);
        });

        this.isPopupOpen = true;
    }

    private closeDetails(): void {
        this.isPopupOpen = false;
    }

    private search(): void {
        if (this.searchBar === "") {
            this.bankAccounts = this.cachedBankAccounts;
            return;
        }

        this.bankAccounts = this.cachedBankAccounts.filter(
            (m) => m.bankDetails.toLowerCase().includes(this.searchBar.toLowerCase()));
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: "long", hour: "numeric", minute: "numeric", month: "long", year: "numeric", day: "numeric",
        });
    }

    private getType(type: BankHistoryType): string {
        switch (type) {
            case BankHistoryType.WITHDRAW:
                return "Auszahlung";
            case BankHistoryType.DEPOSIT:
                return "Einzahlung";
            case BankHistoryType.TRANSFER:
                return "Überweisung";
        }
    }

    private getTime(dateJson: string) {
        const date = new Date(JSON.parse(dateJson));
        return date !== null ? date.getTime() : 0;
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.detail-table-holder {
    height: 16.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.details {
    height: 30.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.table,
.entry {
    color: white !important;
}
</style>
