<template>
    <div class="team-menu-housing-catalog">
        <div v-if="!isPopupOpen">
            <h2>Häuser</h2>
            <input
                @input="search()"
                v-model="houseSearch"
                type="text"
                class="form-control-dark mb-2"
                placeholder="Suche nach Haus ID"
            />
            <div class="table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Besitzer Charakter ID</th>
                        <th>Besitzer Gruppen ID</th>
                        <th>Schlüssel Item Ids</th>
                        <th>Preis</th>
                        <th>Interior ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="house in houses"
                        v-bind:key="house.id"
                        class="entry"
                        @click="requestDetails(house)"
                    >
                        <td>{{ house.id }}</td>
                        <td>
                            {{ house.ownerId === -1 ? "Kein Besitzer" : house.ownerId }}
                        </td>
                        <td>
                            {{
                                house.groupOwnerId === -1 ? "Kein Gruppe" : house.groupOwnerId
                            }}
                        </td>
                        <td>{{ house.keyItemIds }}</td>
                        <td>
                            ${{
                                house.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            }}
                        </td>
                        <td>{{ house.interiorId }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="details">
            <button class="icon-button text-white" @click="closeDetails()">
                <font-awesome-icon class="mx-2" icon="chevron-left"/>
                <span>Haus ID: {{ openHouse.id }}</span>
            </button>

            <h6>Türen</h6>
            <div class="detail-table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Tür ID</th>
                        <th>Status</th>
                        <th>Position X</th>
                        <th>Position Y</th>
                        <th>Position Z</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="door in this.openHouse.doors"
                        v-bind:key="door.id"
                        class="entry"
                    >
                        <td>{{ door.id }}</td>
                        <td>{{ door.locked ? "Abgeschlossen" : "Aufgeschlossen" }}</td>
                        <td>{{ door.positionX }}</td>
                        <td>{{ door.positionY }}</td>
                        <td>{{ door.positionZ }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

export default class TeamMenuHouseingCatalog extends Vue {
    private houses: HouseInterface[] = [];
    private cachedHouses: HouseInterface[] = [];
    private houseSearch = "";
    private isPopupOpen = false;

    private openHouse!: HouseInterface;

    public mounted(): void {
        alt.on("housingcatalog:setup", (args: any) => this.setup(args[0]));
        alt.on("housingcatalog:opendetails", (args: any) =>
            this.openDetails(args[0])
        );
    }

    public unmounted(): void {
        alt.off("housingcatalog:setup");
        alt.off("housingcatalog:opendetails");
    }

    private setup(houses: HouseInterface[]): void {
        this.houses = houses;
        this.cachedHouses = this.houses;
    }

    private requestDetails(house: HouseInterface): void {
        alt.emitServer("housingcatalog:requestdetails", house.id);
    }

    private openDetails(house: HouseInterface): void {
        this.openHouse = house;
        this.isPopupOpen = true;
    }

    private closeDetails(): void {
        this.isPopupOpen = false;
    }

    private search(): void {
        if (this.houseSearch === "") {
            this.houses = this.cachedHouses;
            return;
        }

        this.houses = this.cachedHouses.filter(
            (h) => h.id == Number.parseInt(this.houseSearch)
        );
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

.details {
    height: 30.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.detail-table-holder {
    height: 7vw;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
