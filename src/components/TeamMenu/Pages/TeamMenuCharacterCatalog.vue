<template>
    <div class='team-menu-character-catalog'>
        <div v-if='!isPopupOpen'>
            <h2>Charaktere</h2>
            <input v-model='characterSearch' class='form-control-dark mb-2' placeholder='Suche nach Namen (Bsp. Max Mustermann)' type='text' @input='search()' />
            <div class='table-holder'>
                <table class='table table-striped table-hover'>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Aktueller Discord Name</th>
                        <th>Name</th>
                        <th>Online seit</th>
                        <th>Zuletzt geändert</th>
                        <th>Erstellt am</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='character in characters' v-bind:key='character.id' class='entry' @click='requestDetails(character.id)'>
                        <td>{{ character.id }}</td>
                        <td>{{ character.accountName }}</td>
                        <td>{{ character.name }}</td>
                        <td>{{ getDate(character.onlineSinceJson) }}</td>
                        <td>{{ getDate(character.lastUsageJson) }}</td>
                        <td>{{ getDate(character.createdAtJson) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else class='details'>
            <button class='icon-button text-white' @click='closeDetails()'>
                <font-awesome-icon class='mx-2' icon='chevron-left' />
                <span>{{ this.openCharacter.name }}</span>
            </button>

            <div class='modal-body'>
                <div class='row'>
                    <div class='col-6'>
                        <p>
                            <b>OOC Account:</b> [{{ this.openCharacter.accountId }}] {{ this.openCharacter.accountName }}
                        </p>
                    </div>
                    <div class='col-6'>
                        <p>
                            <b>Geschlecht:</b> {{ this.openCharacter.gender === 0 ? "Männlich" : "Weiblich" }} </p>
                    </div>

                    <div class='col-6'>
                        <p>
                            <b>Status:</b> {{ getCharacterState(this.openCharacter.characterState) }} </p>
                    </div>
                    <div class='col-6'>
                        <p><b>Alter:</b> {{ this.openCharacter.age }} Jahre</p>
                    </div>

                    <div class='col-6'>
                        <p><b>Herkunft:</b> {{ this.openCharacter.origin }}</p>
                    </div>
                    <div class='col-6'>
                        <p><b>Körperbau:</b> {{ this.openCharacter.physique }}</p>
                    </div>

                    <div class='col-6'>
                        <p>
                            <b>Berufsfeld Id:</b> {{
                                this.openCharacter.definedJob === undefined
                                    ? "Kein Berufsfeld"
                                    : this.openCharacter.definedJob.id
                                                  }} </p>
                    </div>

                    <div class='col-12'>
                        <p><b>Vorgeschichte:</b> {{ this.openCharacter.story }}</p>
                    </div>
                </div>
                <h6>Fahrzeuge</h6>
                <div class='detail-table-holder'>
                    <table class='table table-striped table-hover'>
                        <thead>
                        <tr>
                            <th>Fahrzeug ID</th>
                            <th>Model</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='vehicle in this.vehicles' v-bind:key='vehicle.id' class='entry'>
                            <td>{{ vehicle.id }}</td>
                            <td>{{ vehicle.displayName }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h6>Immobilien</h6>
                <div class='detail-table-holder'>
                    <table class='table table-striped table-hover'>
                        <thead>
                        <tr>
                            <th>Haus ID</th>
                            <th>Model</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='house in this.houses' v-bind:key='house.id' class='entry'>
                            <td>{{ house.id }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h6>Gruppen</h6>
                <div class='detail-table-holder'>
                    <table class='table table-striped table-hover'>
                        <thead>
                        <tr>
                            <th>Gruppen ID</th>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='group in this.groups' v-bind:key='group.id' class='entry'>
                            <td>{{ group.id }}</td>
                            <td>{{ group.name }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h6>Bankkonten</h6>
                <div class='detail-table-holder'>
                    <table class='table table-striped table-hover'>
                        <thead>
                        <tr>
                            <th>Bankkonto ID</th>
                            <th>Kontostand</th>
                            <th>Typ</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='bankAccount in this.bankAccounts' v-bind:key='bankAccount.id' class='entry'>
                            <td>{{ bankAccount.id }}</td>
                            <td>{{ bankAccount.amount }}$</td>
                            <td>
                                {{ bankAccount.type === 0 ? "Privatkonto" : "Gruppenkonto" }}
                            </td>
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
import {Vue} from "vue-class-component";
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {CharacterCatalogRequestDetailsInterface} from "@/scripts/interfaces/team-menu/haracter-catalog-request-details.interface";

export default class TeamMenuVehicleCatalog extends Vue {
    private characters: CharacterInterface[] = [];
    private cachedCharacters: CharacterInterface[] = [];
    private characterSearch = "";

    private isPopupOpen = false;
    private openCharacter!: CharacterInterface;
    private vehicles: VehicleInterface[] = [];
    private houses: HouseInterface[] = [];
    private groups: GroupInterface[] = [];
    private bankAccounts: BankAccountInterface[] = [];

    public open(): void {
        alt.emitServerWithResponse<CharacterInterface[]>("charactercatalog:open")
            .then((characters: CharacterInterface[]) => {
                this.characters = characters;
                this.cachedCharacters = this.characters;
                this.isPopupOpen = false;
            });
    }

    private requestDetails(characterId: number): void {
        alt.emitServerWithResponse<CharacterCatalogRequestDetailsInterface>("charactercatalog:requestdetails",
            characterId)
            .then((request: CharacterCatalogRequestDetailsInterface) => {

                this.openCharacter = request.character;
                this.vehicles = request.vehicles;
                this.houses = request.houses;
                this.groups = request.groups;
                this.bankAccounts = request.bankAccounts;
                this.isPopupOpen = true;
            });
    }

    private closeDetails(): void {
        this.isPopupOpen = false;
    }

    private search(): void {
        if (this.characterSearch === "") {
            this.characters = this.cachedCharacters;
            return;
        }

        this.characters = this.cachedCharacters.filter(
            (c) => c.name.toLowerCase().includes(this.characterSearch.toLowerCase()));
    }

    private getCharacterState(state: number): string {
        switch (state) {
            case 0:
                return "Spielbar";
            case 1:
                return "Charakter Killed";
            case 2:
                return "Gesperrt";
            case 3:
                return "administrative Änderungen erzwungen";
        }

        return "";
    }

    private getDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "long", day: "numeric",
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

.detail-table-holder {
    height: 7vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.details {
    height: 30.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.table,
.entry {
    color: white !important;
}
</style>
