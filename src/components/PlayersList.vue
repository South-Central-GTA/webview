<template>
    <div class='players-list' v-bind:class='{ enable: active, disable: !active }'>
        <div :hidden='!active' class='sc-card text-white w-50 center'>
            <div class='card-body'>
                <h5 class='card-title'>Online Spielerliste</h5>

                <div class='table-holder'>
                    <table class='table table-striped table-hover'>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Charakter Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='player in players' v-bind:key='player.id' class='entry'>
                            <td>{{ player.id }}</td>
                            <td>{{ player.characterName }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {PlayerInterface} from "@/scripts/interfaces/player.interface";

@Options({
    components: {},
})
export default class PlayersList extends Vue {
    private active = false;
    private players: PlayerInterface[] = [];

    public mounted(): void {
        alt.on("playerslist:toggle", (visible: boolean, players: PlayerInterface[]) => this.toggle(visible, players));
    }

    public unmounted(): void {
        alt.off("playerslist:toggle");
    }

    private toggle(visible: boolean, players: PlayerInterface[]): void {
        this.active = visible;
        this.players = players;
    }
}
</script>

<style lang='scss' scoped>
.players-list {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

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
