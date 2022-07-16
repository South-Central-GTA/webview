<template>
    <div class='prison'>
        <div class='card w-25 m-5'>
            <div class='card-body'>
                <h5 class='card-title'>Gefängnis</h5>
                <h6 class='card-subtitle mb-2 text-muted'>
                    Los Santos Police Department </h6>
                <p class='card-text'>
                    Die Zeit läuft auch ab wenn du mit diesem Charakter nicht online bist. </p>
                <button class='btn btn-secondary p-2' type='button' @click='requestCharacterSelection()'>
                    Zurück zur Charakterauswahl
                </button>

                <p class='text-muted'>
                    Dein Charakter ist noch bis {{ jailedUntil }} im Gefängnis. </p>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";

export default class Prison extends Vue {
    private jailedUntil = "";

    public mounted(): void {
        alt.emit("prison:ready");

        alt.on("prison:start", (jailedUntilDateJson: string) => this.start(jailedUntilDateJson));
    }

    public unmounted(): void {
        alt.off("prison:start");
    }

    private start(jailedUntilDateJson: string): void {
        this.jailedUntil = this.getDate(jailedUntilDateJson);
    }

    private requestCharacterSelection(): void {
        alt.emit("prison:requestcharacterselection");
    }

    private getDate(dateJson: string): string {
        if (dateJson === "") {
            return "";
        }

        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "long", day: "numeric",
        });
    }
}
</script>

<style lang='scss' scoped>
.prison {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>
