<template>
    <div class='team-menu-account-catalog'>
        <h2>Accounts</h2>
        <input v-model='accountSearch' class='form-control-dark mb-2' placeholder='Suche nach aktuellen oder ehemaligen Discord Namen (Bsp. Pride)' type='text' @input='search()' />
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Social Club ID</th>
                    <th>Discord ID</th>
                    <th>Aktueller Discord Name</th>
                    <th>Ehemalige Discord Namen</th>
                    <th>Zuletzt geändert</th>
                    <th>Erstellt am</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='account in accounts' v-bind:key='account.id' class='entry' @click='openUserRecord(account.id)'>
                    <td>{{ account.id }}</td>
                    <td>{{ account.discordId }}</td>
                    <td>{{ account.currentName }}</td>
                    <td>{{ getNameHistoryString(account.nameHistoryJson) }}</td>
                    <td>{{ getDate(account.lastUsageJson) }}</td>
                    <td>{{ getDate(account.createdAtJson) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {AccountInterface} from "@/scripts/interfaces/account.interface";

export default class TeamMenuAccountCatalog extends Vue {
    private accounts: AccountInterface[] = [];
    private chacheAccounts: AccountInterface[] = [];
    private accountSearch = "";

    public open(): void {
        alt.emitServerWithResponse<AccountInterface[]>("accountcatalog:open")
            .then((accounts: AccountInterface[]) => {
                this.accounts = accounts;
                this.chacheAccounts = this.accounts;
            });
    }

    private openUserRecord(accountId: number): void {
        alt.emitServer("userrecord:request", accountId);
    }

    private search(): void {
        if (this.accountSearch === "") {
            this.accounts = this.chacheAccounts;
            return;
        }

        this.accounts = this.chacheAccounts;
        this.accounts = this.accounts.filter((c) => c.currentName
            .toLowerCase()
            .includes(this.accountSearch.toLowerCase()) || this.getNameHistory(c.nameHistoryJson)
            .find((n) => n.includes(this.accountSearch.toLowerCase())));
    }

    private getDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "long", day: "numeric",
        });
    }

    private getNameHistory(nameHistoryJson: string): string[] {
        const names: string[] = JSON.parse(nameHistoryJson);
        return names.map((n) => n.toLowerCase());
    }

    private getNameHistoryString(nameHistoryJson: string): string {
        const names: string[] = JSON.parse(nameHistoryJson);

        if (names.length === 0) {
            return "Keine ehemaligen Namen";
        }

        return names.join(", ");
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.table,
.entry {
    color: white !important;
}
</style>
