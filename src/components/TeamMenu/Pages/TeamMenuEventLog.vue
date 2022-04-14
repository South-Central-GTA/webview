<template>
    <div class="team-menu-event-log">
        <h2>Eventlog</h2>
        <input @input="search()" v-model="searchInput" type="text" class="form-control-dark mb-2"
               placeholder="Suche nach ausführenden Personen"/>
        <div class="table-holder">
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Befehl Name</th>
                    <th>Argumente</th>
                    <th>Account Name</th>
                    <th>Datum</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(command, index) in commands" v-bind:key="index" class="entry">
                        <td>{{ command.name }}</td>
                        <td>{{ command.arguments }}</td>
                        <td>{{ command.accountName }}</td>
                        <td>{{ getDate(command.loggedAtJson) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import alt from '@/scripts/services/alt.service';
import {Vue} from "vue-class-component";
import {LogCommandInterface} from "@/scripts/interfaces/log-command.interface";

export default class TeamMenuEventLog extends Vue {
    private commands: LogCommandInterface[] = []
    private cachedCommands: LogCommandInterface[] = []
    private searchInput = "";

    public mounted(): void {
        alt.on("eventlog:setup", (args: any) => this.setup(args[0]));
    }

    public unmounted(): void {
        alt.off("eventlog:setup");
    }

    private setup(commands: LogCommandInterface[]): void {
        this.commands = commands;
        this.cachedCommands = this.commands;
    }

    private search(): void {
        if (this.searchInput === "") {
            this.commands = this.cachedCommands;
            return;
        }

        this.commands = this.cachedCommands.filter(c => c.accountName.toLowerCase().includes(this.searchInput.toLowerCase()));
    }
    
    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            month: 'long',
            year: 'numeric',
            day: 'numeric'
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