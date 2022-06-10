<template>
    <div class='team-menu-player-catalog'>
        <h2>Online Spielerliste</h2>
        <input v-model='searchInput' class='form-control-dark mb-2' placeholder='Suche nach aktuellen Discord Namen.' type='text' @input='search()' />
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Aktueller Name</th>
                    <th>Discord ID</th>
                    <th>Charakter Name</th>
                    <th>Charakter Id</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='player in players' v-bind:key='player.id' class='entry' @click='openUserRecord(player.accountId)'>
                    <td>{{ player.id }}</td>
                    <td>{{ player.accountName }}</td>
                    <td>{{ player.discordId }}</td>
                    <td>{{ player.characterName }}</td>
                    <td>{{ player.characterId }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {PlayerInterface} from "@/scripts/interfaces/player.interface";

export default class TeamMenuPlayerCatalog extends Vue {
    private players: PlayerInterface[] = [];
    private cachePlayers: PlayerInterface[] = [];
    private searchInput = "";

    public open(): void {
        alt.emitServerWithResponse<PlayerInterface[]>("playercatalog:open")
            .then((players: PlayerInterface[]) => {
                this.players = players;
                this.cachePlayers = this.players;
            });
    }

    private openUserRecord(accountId: number): void {
        alt.emitServer("userrecord:request", accountId);
    }

    private search(): void {
        if (this.searchInput === "") {
            this.players = this.cachePlayers;
            return;
        }

        this.players = this.cachePlayers.filter(
            (p) => p.accountName.toLowerCase().includes(this.searchInput.toLowerCase()));
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
