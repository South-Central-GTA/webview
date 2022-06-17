<template>
    <div class='mdc-apb'>
        <div class='content h-100 row m-4'>
            <div class='col-12'>
                <div v-if='bulletIns.length !== 0' class='big-list-holder'>
                    <p v-for='entry in bulletIns' v-bind:key='entry.id'>
                        <button v-if='isOperator' class='mx-2' type='button' @click='deleteBulletIn(entry.id)'>
                            X
                        </button>
                        <span class='date-text'>{{ entry.creatorCharacterName }} -
              {{ getDate(entry.createdAtJson) }}</span> {{ entry.content }}
                    </p>
                </div>

                <div v-if='isOperator' class='position-absolute mb-5 bottom-0'>
                    <input v-model='bulletInInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createBulletIn()'>
                        Bulletin hinzufügen
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import MdcService from "@/scripts/services/mdc.service";
import {FactionType} from "@/scripts/enums/faction.type";
import {ApbEntryInterface} from "@/scripts/interfaces/mdc/apb-entry.interface";

@Options({
    components: {},
})
export default class MdcApb extends Vue {
    private isOperator: boolean = false;
    private bulletIns: ApbEntryInterface[] = [];
    private factionType: FactionType = FactionType.CITIZEN;

    private bulletInInput: string = "";

    public mounted(): void {
        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
    }

    public unmounted(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public setup(factionType: FactionType, bulletIns: ApbEntryInterface[]): void {
        this.factionType = factionType;
        this.bulletIns = bulletIns;
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private createBulletIn(): void {
        if (this.bulletInInput.length === 0) {
            return;
        }

        alt.emitServer("apb:createbulletin", this.factionType, this.bulletInInput);

        this.bulletInInput = "";
    }

    private deleteBulletIn(id: number): void {
        alt.emitServer("apb:deletebulletin", this.factionType, id);
    }

    private getDate(dateJson: string): string {
        if (dateJson.length === 0) {
            return "";
        }

        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "numeric", day: "numeric",
        });
    }
}
</script>

<style lang='scss' scoped>
.mdc-apb {
    background-color: #cecece;
    height: 100%;
}

.list-holder {
    height: 5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.big-list-holder {
    height: 25vw;
    overflow-x: hidden;
    overflow-y: auto;

    button {
        pointer-events: all !important;
    }
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}

.date-text {
    color: gray;
    text-align: right;
    font-style: italic;
    font-size: 0.6vw;
}
</style>
