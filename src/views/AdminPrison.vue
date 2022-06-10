<template>
    <div class='adminprison'>
        <div class='card w-25 m-5'>
            <div class='card-body'>
                <h5 class='card-title'>Admin Prison</h5>
                <h6 class='card-subtitle mb-2 text-muted'>
                    Du hast offenbar Mist gebaut. </h6>
                <p class='card-text'>
                    Laufe die roten Checkpoints ab. Wenn du mit deiner Strafe durch bist, kommst du in die Charakterauswahl zurück. </p>

                <div v-if='leftCheckpoints === 1'>
                    <p class='text-muted'>Du musst noch einen Checkpoint ablaufen.</p>
                </div>
                <div v-else>
                    <p class='text-muted'>
                        Du musst noch {{ leftCheckpoints }} Checkpoints ablaufen. </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";

export default class AdminPrison extends Vue {
    private leftCheckpoints = 0;

    public mounted(): void {
        alt.emit("adminprison:ready");

        alt.on("adminprison:start", (totalCheckpoints: number) => this.start(totalCheckpoints));
        alt.on("adminprison:update", (leftCheckpoints: number) => this.update(leftCheckpoints));
    }

    public unmounted() {
        alt.off("adminprison:start");
        alt.off("adminprison:update");
    }

    private start(totalCheckpoints: number): void {
        this.leftCheckpoints = totalCheckpoints;
    }

    private update(leftCheckpoints: number): void {
        this.leftCheckpoints = leftCheckpoints;
    }
}
</script>

<style lang='scss' scoped>
.adminprison {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>
