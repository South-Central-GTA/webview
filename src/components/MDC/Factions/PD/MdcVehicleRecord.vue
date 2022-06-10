<template>
    <div class='mdc-vehicle-record'>
        <div class='content h-100 row m-4'>
            <div class='col-4'>
                <h3>{{ displayName }}</h3>
                <h4>Informationen:</h4>
                <p><b>Klasse:</b> {{ displayClass }}</p>
                <p><b>Nummernschild:</b> {{ numberPlate }}</p>
                <p>
                    <b>Besitzer:</b> {{ ownerName.length !== 0 ? ownerName : "Unbekannt" }} </p>
            </div>
            <div class='col-6'>
                <h4>Notizen:</h4>

                <div v-if='notes.length !== 0' class='big-list-holder'>
                    <p v-for='note in notes' v-bind:key='note.id'>
                        <button v-if='isOperator' type='button' @click='deleteNote(note.id)'>
                            X
                        </button>
                        {{ note.note }}<br /><span class='date-text'>{{ note.creatorCharacterName }} -
              {{ getDate(note.createdAtJson) }}</span>
                    </p>
                </div>

                <div class='position-absolute mb-5 bottom-0'>
                    <input v-model='noteInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createNote()'>
                        Notiz erstellen
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
import {MdcNoteInterface} from "@/scripts/interfaces/mdc/mdc-note.interface";
import {MdcSearchType} from "@/scripts/enums/mdc-search.type";

@Options({
    components: {},
})
export default class MdcVehicleRecord extends Vue {
    private isOperator: boolean = false;

    private vehicleId: number = 0;
    private displayName: string = "";
    private displayClass: string = "";
    private numberPlate: string = "";
    private ownerName: string = "";
    private notes: MdcNoteInterface[] = [];

    private noteInput: string = "";

    public mounted(): void {
        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
    }

    public unmounted(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public setup(vehicleId: number, displayName: string, displayClass: string, numberPlate: string, ownerName: string, notes: MdcNoteInterface[]): void {
        this.vehicleId = vehicleId;
        this.displayName = displayName;
        this.displayClass = displayClass;
        this.numberPlate = numberPlate;
        this.ownerName = ownerName;
        this.notes = notes;
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private createNote(): void {
        if (this.noteInput.length === 0) {
            return;
        }

        alt.emitServer("policemdc:createnote", this.vehicleId, MdcSearchType.VEHICLE, this.noteInput);

        this.noteInput = "";
    }

    private deleteNote(id: number): void {
        alt.emitServer("policemdc:deletenote", id);
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
.mdc-vehicle-record {
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
