<template>
    <div class='team-menu-helpme'>
        <h2>Offene Help Me's</h2>
        <input v-model='playerNameSearch' class='form-control-dark mb-2' placeholder='Suche nach Spieler Namen' type='text' @input='search()' />
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Betreff</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='ticket in tickets' v-bind:key='ticket.creatorDiscordId' class='entry'>
                    <td>{{ ticket.creatorName }}</td>
                    <td>{{ ticket.context }}</td>
                    <td>
                        <div class='input-group'>
                            <button class='btn btn-primary' @click='takeTicket(ticket.creatorDiscordId)'>
                                Ticket übernehmen
                            </button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {HelpMeTicketInterface} from "@/scripts/interfaces/team-menu/help-me-ticket.interface";

export default class TeamMenuHelpMe extends Vue {
    private tickets: HelpMeTicketInterface[] = [];
    private chacheTickets: HelpMeTicketInterface[] = [];
    private playerNameSearch = "";

    public open(): void {
        alt.emitServerWithResponse<HelpMeTicketInterface[]>("helpme:open")
            .then((tickets: HelpMeTicketInterface[]) => {
                this.tickets = tickets;
                this.chacheTickets = this.tickets;
            });
    }

    public mounted(): void {
        alt.on("helpme:update", (args: any[]) => this.update(args[0]));
    }

    public unmounted(): void {
        alt.off("helpme:update");
    }

    private update(tickets: HelpMeTicketInterface[]): void {
        this.chacheTickets = tickets;

        if (this.playerNameSearch === "") {
            this.tickets = this.chacheTickets;
        }
    }

    private search(): void {
        if (this.playerNameSearch === "") {
            this.tickets = this.chacheTickets;
            return;
        }

        this.tickets = this.chacheTickets;
        this.tickets = this.tickets.filter((t) => t.creatorName.toLowerCase().includes(this.playerNameSearch));
    }

    private takeTicket(playerDiscordId: string): void {
        alt.emitServer("helpme:taketicket", playerDiscordId);
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
