<template>
    <div class="team-menu-mail-accounts-log">
        <h2>E-Mail Accounts</h2>
        <input
            @input="search()"
            v-model="mailAddressSearch"
            type="text"
            class="form-control-dark mb-2"
            placeholder="Suche nach der E-Mail"
        />
        <div class="table-holder">
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Mail Addresse</th>
                    <th>Typ</th>
                    <th>Besitzer</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="account in mailAccounts"
                    v-bind:key="account.mailAddress"
                    class="entry"
                >
                    <td>{{ account.mailAddress }}</td>
                    <td>{{ getType(account.type) }}</td>
                    <td>{{ getOwner(account) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {MailAccountInterface} from "@/scripts/interfaces/mail/mail-account.interface";

export default class TeamMenuMailAccountsLog extends Vue {
    private mailAccounts: MailAccountInterface[] = [];
    private cachedMailAccounts: MailAccountInterface[] = [];
    private mailAddressSearch = "";

    public mounted(): void {
        alt.on("mailaccountslog:setup", (args: any[]) => this.setup(args[0]));
    }

    public unmounted(): void {
        alt.off("mailaccountslog:setup");
    }

    private setup(mailAccounts: MailAccountInterface[]): void {
        this.mailAccounts = mailAccounts;
        this.cachedMailAccounts = this.mailAccounts;
    }

    private search(): void {
        if (this.mailAddressSearch === "") {
            this.mailAccounts = this.cachedMailAccounts;
            return;
        }

        this.mailAccounts = this.cachedMailAccounts;
        this.mailAccounts = this.mailAccounts.filter((m) =>
            m.mailAddress?.includes(this.mailAddressSearch.toLowerCase())
        );
    }

    private getType(type: number): string {
        if (type === 0) {
            return "Privatkonto";
        }
        if (type === 1) {
            return "Gruppenkonto";
        }

        return "";
    }

    private getOwner(mailAccount: MailAccountInterface): string {
        const characterAccess = mailAccount.characterAccesses.find(
            (ca) => ca.owner
        );
        if (characterAccess !== undefined) {
            return characterAccess.name;
        } else {
            const groupAccess = mailAccount.groupAccesses.find((ga) => ga.owner);
            if (groupAccess !== undefined) {
                return groupAccess.groupName;
            }
        }

        return "Kein Besitzer";
    }

    private getDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric",
            minute: "numeric",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
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
