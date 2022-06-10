<template>
    <div class='team-menu-phone-messages-log'>
        <h2>SMS</h2>
        <input v-model='phoneNumberSearch' class='form-control-dark mb-2' placeholder='Suche nach der Sender Nummer.' type='text' @input='search()' />
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Sender Nummer</th>
                    <th>Empfänger Nummer</th>
                    <th>Nachricht</th>
                    <th>Datum</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='message in messages' v-bind:key='message.id' class='entry'>
                    <td>{{ message.id }}</td>
                    <td>{{ message.senderPhoneNumber }}</td>
                    <td>{{ message.targetPhoneNumber }}</td>
                    <td>{{ message.context }}</td>
                    <td>{{ getDate(message.sendetAt) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {PhoneMessageInterface} from "@/scripts/interfaces/phone/phone-message.interface";

export default class TeamMenuPhoneMessagesLog extends Vue {
    private messages: PhoneMessageInterface[] = [];
    private cachedMessages: PhoneMessageInterface[] = [];
    private phoneNumberSearch = "";

    public open(): void {
        alt.emitServerWithResponse<PhoneMessageInterface[]>("phonemessageslog:open")
            .then((messages: PhoneMessageInterface[]) => {
                this.messages = messages;
                this.cachedMessages = this.messages;
            });
    }

    private search(): void {
        if (this.phoneNumberSearch === "") {
            this.messages = this.cachedMessages;
            return;
        }

        this.messages = this.cachedMessages;
        this.messages = this.messages.filter(
            (m) => m.senderPhoneNumber?.includes(this.phoneNumberSearch.toLowerCase()));
    }

    private getDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "numeric", day: "numeric",
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
