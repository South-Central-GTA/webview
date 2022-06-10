<template>
    <div class='mdc-patient-record'>
        <div class='content h-100 row m-4'>
            <div class='col-4'>
                <h3>{{ characterName }}</h3>
                <h4>Informationen:</h4>
                <p v-if='phoneNumbers.length === 0'>
                    <b>Handynummern:</b> Keine Suchergebnisse! </p>
                <p v-if='phoneNumbers.length !== 0'><b>Handynummern:</b></p>
                <ul v-if='phoneNumbers.length !== 0' class='list-holder'>
                    <li v-for='phoneNumber in phoneNumbers' v-bind:key='phoneNumber'>
                        {{ phoneNumber }}
                    </li>
                </ul>

                <p v-if='houses.length === 0'><b>Adressen:</b> Keine Suchergebnisse!</p>
                <p v-if='houses.length !== 0'><b>Adressen:</b></p>
                <ul v-if='houses.length !== 0' class='list-holder'>
                    <li v-for='house in houses' v-bind:key='house.id'>
                        {{ house.streetName }} {{ house.subName }} Nr. {{ house.houseNumber }}
                    </li>
                </ul>
            </div>
            <div class='col-4'>
                <h4>Medical History:</h4>

                <div v-if='medicalHistory.length !== 0' class='big-list-holder'>
                    <p v-for='entry in medicalHistory' v-bind:key='entry.id'>
                        <button v-if='isOperator' type='button' @click='deleteMedicalHistory(entry.id)'>
                            X
                        </button>
                        {{ entry.content }}<br /> <span class='date-text'>{{ entry.creatorCharacterName }} -
              {{ getDate(entry.createdAtJson) }}</span>
                    </p>
                </div>

                <div class='position-absolute mb-5 bottom-0'>
                    <input v-model='medicalHistoryInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createMedicalHistory()'>
                        Medical History hinzufügen
                    </button>
                </div>
            </div>
            <div class='col-4'>
                <h4>Allergien:</h4>

                <div v-if='allergies.length !== 0' class='big-list-holder'>
                    <p v-for='entry in allergies' v-bind:key='entry.id'>
                        <button v-if='isOperator' type='button' @click='deleteAllergy(entry.id)'>
                            X
                        </button>
                        {{ entry.content }}<br /> <span class='date-text'>{{ entry.creatorCharacterName }} -
              {{ getDate(entry.createdAtJson) }}</span>
                    </p>
                </div>

                <div class='position-absolute mb-5 bottom-0'>
                    <input v-model='allergyInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createAllergy()'>
                        Neue Allergie hinzufügen
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
import {MdcMedicalEntryInterface} from "@/scripts/interfaces/mdc/mdc-medical-entry.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";
import {MdcAllergyInterface} from "@/scripts/interfaces/mdc/mdc-allergy.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";

@Options({
    components: {},
})
export default class MdcPatientRecord extends Vue {
    private isOperator: boolean = false;

    private characterId: number = 0;
    private characterName: string = "";
    private phoneNumbers: string[] = [];
    private houses: HouseInterface[] = [];
    private medicalHistory: MdcMedicalEntryInterface[] = [];
    private allergies: MdcAllergyInterface[] = [];

    private medicalHistoryInput: string = "";
    private allergyInput: string = "";

    public mounted(): void {
        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
    }

    public unmounted(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public setup(character: CharacterInterface, houses: HouseInterface[], phoneNumbers: string[], medicalHistory: MdcMedicalEntryInterface[], allergies: MdcAllergyInterface[]): void {
        this.characterId = character.id;
        this.characterName = character.name;
        this.houses = houses;
        this.phoneNumbers = phoneNumbers;
        this.medicalHistory = medicalHistory;
        this.allergies = allergies;
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private createMedicalHistory(): void {
        if (this.medicalHistoryInput.length === 0) {
            return;
        }

        alt.emitServer("firemdc:createmedicalhistory", this.characterId, this.medicalHistoryInput);

        this.medicalHistoryInput = "";
    }

    private deleteMedicalHistory(id: number): void {
        alt.emitServer("firemdc:deletemedicalhistory", id);
    }

    private createAllergy(): void {
        if (this.allergyInput.length === 0) {
            return;
        }

        alt.emitServer("firemdc:createallergy", this.characterId, this.allergyInput);

        this.allergyInput = "";
    }

    private deleteAllergy(id: number): void {
        alt.emitServer("firemdc:deleteallergy", id);
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
.mdc-patient-record {
    background-color: #cecece;
    height: 100%;
}

.big-list-holder {
    height: 30vw;
    overflow-x: hidden;
    overflow-y: auto;

    button {
        pointer-events: all !important;
    }
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}
</style>
