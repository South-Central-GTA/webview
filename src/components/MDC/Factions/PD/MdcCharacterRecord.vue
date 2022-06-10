<template>
    <div class='mdc-character-record'>
        <div class='content h-100 row m-4'>
            <div class='col-3'>
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

                <p v-if='vehicles.length === 0'>
                    <b>Fahrzeuge:</b> Keine Suchergebnisse! </p>
                <p v-if='vehicles.length !== 0'><b>Fahrzeuge:</b></p>
                <ul v-if='vehicles.length !== 0' class='list-holder'>
                    <li v-for='vehicle in vehicles' v-bind:key='vehicle.id'>
                        {{ vehicle.displayName }} - {{ vehicle.displayClass }} - {{ vehicle.numberPlateText }}
                    </li>
                </ul>

                <p>
                    <b>Lizenzen:</b> <span v-if='
              !hasDrivingLicense &&
              !hasBoatsLicense &&
              !hasFlyingLicense &&
              !hasWeaponLicense
            '>Keine Suchergebnisse!</span>
                </p>
                <div class='row'>
                    <div v-if='hasDrivingLicense' class='col-6'>
                        <label class='form-label'>Führerschein:</label><br />
                        <div class='btn-group w-100'>
                            <button class='bg-warning' type='button' @click='warnDriverLicense()'>
                                Verwarnung
                            </button>
                            <button class='bg-danger mx-1' type='button' @click='removeDriverLicense()'>
                                Entziehen
                            </button>
                        </div>
                    </div>
                    <div v-if='hasBoatsLicense' class='col-6'>
                        <label class='form-label'>Bootsschein:</label><br />
                        <div class='btn-group w-100'>
                            <button class='bg-warning' type='button' @click='warnBoatLicense()'>
                                Verwarnung
                            </button>
                            <button class='bg-danger mx-1' type='button' @click='removeBoatLicense()'>
                                Entziehen
                            </button>
                        </div>
                    </div>
                    <div v-if='hasFlyingLicense' class='col-6'>
                        <label class='form-label'>Flugschein:</label><br />
                        <div class='btn-group w-100'>
                            <button class='bg-warning' type='button' @click='warnFlyingLicense()'>
                                Verwarnung
                            </button>
                            <button class='bg-danger mx-1' type='button' @click='removeFlyingLicense()'>
                                Entziehen
                            </button>
                        </div>
                    </div>
                    <div v-if='hasWeaponLicense' class='col-6'>
                        <label class='form-label'>Waffenschein:</label><br />
                        <div class='btn-group w-100'>
                            <button class='bg-danger' type='button' @click='removeWeaponLicense()'>
                                Entziehen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class='col-3'>
                <h4>Records:</h4>

                <div v-if='records.length !== 0' class='big-list-holder'>
                    <p v-for='record in records' v-bind:key='record.id'>
                        <button v-if='isOperator' type='button' @click='deleteRecord(record.id)'>
                            X
                        </button>
                        {{ record.reason }}<br /> <span class='date-text'>{{ record.creatorCharacterName }} -
              {{ getDate(record.createdAtJson) }}</span>
                    </p>
                </div>

                <div class='position-absolute mb-5 bottom-0'>
                    <input v-model='recordInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createRecord()'>
                        Record hinzufügen
                    </button>
                </div>
            </div>
            <div class='col-3'>
                <h4>Notizen:</h4>

                <div v-if='notes.length !== 0' class='big-list-holder'>
                    <p v-for='note in notes' v-bind:key='note.id'>
                        <button v-if='isOperator' type='button' @click='deleteNote(note.id)'>
                            X
                        </button>
                        {{ note.note }}<br /> <span class='date-text'>{{ note.creatorCharacterName }} -
              {{ getDate(note.createdAtJson) }}</span>
                    </p>
                </div>

                <div class='position-absolute mb-5 bottom-0'>
                    <input v-model='noteInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createNote()'>
                        Notiz hinzufügen
                    </button>
                </div>
            </div>
            <div class='col-3'>
                <h4>Tickets:</h4>

                <div v-if='tickets.length !== 0' class='big-list-holder'>
                    <p v-for='ticket in tickets' v-bind:key='ticket.referenceId'>
                        [{{ ticket.referenceId }}] {{ ticket.reason }}<br />Bezahlt: {{ ticket.payed ? "Ja" : "Nein" }}<br />
                        <span class='date-text'>{{ ticket.creatorCharacterName }} -
              {{ getDate(ticket.createdAtJson) }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import MdcService from "@/scripts/services/mdc.service";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";
import {CriminalRecordInterface} from "@/scripts/interfaces/mdc/criminal-record.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";
import {PoliceTicketInterface} from "@/scripts/interfaces/mdc/police-ticket.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {MdcNoteInterface} from "@/scripts/interfaces/mdc/mdc-note.interface";
import {PersonalLicenseType} from "@/scripts/enums/personal-license.type";
import {MdcSearchType} from "@/scripts/enums/mdc-search.type";

@Options({
    components: {},
})
export default class MdcCharacterRecord extends Vue {
    private isOperator: boolean = false;

    private characterId: number = 0;
    private characterName: string = "";
    private phoneNumbers: string[] = [];
    private records: CriminalRecordInterface[] = [];
    private notes: MdcNoteInterface[] = [];
    private tickets: PoliceTicketInterface[] = [];
    private houses: HouseInterface[] = [];
    private vehicles: VehicleInterface[] = [];
    private hasDrivingLicense: boolean = false;
    private hasBoatsLicense: boolean = false;
    private hasFlyingLicense: boolean = false;
    private hasWeaponLicense: boolean = false;
    private driverLicenseId: number = -1;
    private boatLicenseId: number = -1;
    private flyingLicenseId: number = -1;
    private weaponLicenseId: number = -1;

    private noteInput: string = "";
    private recordInput: string = "";

    public mounted(): void {
        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
    }

    public unmounted(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public setup(character: CharacterInterface, records: CriminalRecordInterface[], tickets: PoliceTicketInterface[], notes: MdcNoteInterface[], vehicles: VehicleInterface[], houses: HouseInterface[], bankAccounts: BankAccountInterface[], phoneNumbers: string[]): void {
        this.characterId = character.id;
        this.characterName = character.name;

        this.phoneNumbers = [];
        phoneNumbers.forEach((phoneNumber: string) => {
            this.phoneNumbers.push(phoneNumber.substring(0, 3) + " - " + phoneNumber.substring(3, phoneNumber.length));
        });

        this.records = records;
        this.tickets = tickets;
        this.notes = notes;
        this.vehicles = vehicles;
        this.houses = houses;

        const driverLicense = character.licenses.find((l) => l.type === PersonalLicenseType.DRIVING);
        if (driverLicense) {
            this.hasDrivingLicense = true;
            this.driverLicenseId = driverLicense.id;
        } else {
            this.hasDrivingLicense = false;
        }

        const boatsLicense = character.licenses.find((l) => l.type === PersonalLicenseType.BOATS);
        if (boatsLicense) {
            this.hasBoatsLicense = true;
            this.boatLicenseId = boatsLicense.id;
        } else {
            this.hasBoatsLicense = false;
        }

        const flyingLicense = character.licenses.find((l) => l.type === PersonalLicenseType.FLYING);
        if (flyingLicense) {
            this.hasFlyingLicense = true;
            this.flyingLicenseId = flyingLicense.id;
        } else {
            this.hasFlyingLicense = false;
        }

        const weaponLicense = character.licenses.find((l) => l.type === PersonalLicenseType.WEAPON);
        if (weaponLicense) {
            this.hasWeaponLicense = true;
            this.weaponLicenseId = weaponLicense.id;
        } else {
            this.hasWeaponLicense = false;
        }
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private createRecord(): void {
        if (this.recordInput.length === 0) {
            return;
        }

        alt.emitServer("policemdc:createrecord", this.characterId, this.recordInput);

        this.recordInput = "";
    }

    private deleteRecord(id: number): void {
        alt.emitServer("policemdc:deleterecord", id);
    }

    private createNote(): void {
        if (this.noteInput.length === 0) {
            return;
        }

        alt.emitServer("policemdc:createnote", this.characterId, MdcSearchType.NAME, this.noteInput);

        this.noteInput = "";
    }

    private deleteNote(id: number): void {
        alt.emitServer("policemdc:deletenote", id);
    }

    private warnDriverLicense(): void {
        alt.emitServer("policemdc:warnlicense", PersonalLicenseType.DRIVING, this.driverLicenseId);
    }

    private removeDriverLicense(): void {
        alt.emitServer("policemdc:removelicense", PersonalLicenseType.DRIVING, this.driverLicenseId);
    }

    private warnBoatLicense(): void {
        alt.emitServer("policemdc:warnlicense", PersonalLicenseType.BOATS, this.boatLicenseId);
    }

    private removeBoatLicense(): void {
        alt.emitServer("policemdc:removelicense", PersonalLicenseType.BOATS, this.boatLicenseId);
    }

    private warnFlyingLicense(): void {
        alt.emitServer("policemdc:warnlicense", PersonalLicenseType.FLYING, this.flyingLicenseId);
    }

    private removeFlyingLicense(): void {
        alt.emitServer("policemdc:removelicense", PersonalLicenseType.FLYING, this.flyingLicenseId);
    }

    private removeWeaponLicense(): void {
        alt.emitServer("policemdc:removelicense", PersonalLicenseType.WEAPON, this.weaponLicenseId);
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
.mdc-character-record {
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
