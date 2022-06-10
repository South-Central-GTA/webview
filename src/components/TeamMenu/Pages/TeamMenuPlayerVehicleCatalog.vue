<template>
    <div class='team-menu-player-vehicle-catalog'>
        <h2>Spielerfahrzeug</h2>
        <input v-model='searchInput' class='form-control-dark mb-2' placeholder='Suche nach Fahrzeug Models (Bsp. Sultan)' type='text' @input='search()' />
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Fahrzeugb ID</th>
                    <th>Fahrzeug Model</th>
                    <th>Fahrzeug Name</th>
                    <th>Charakter Id</th>
                    <th>Charakter Name</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='vehicle in vehicles' v-bind:key='vehicle.id' class='entry'>
                    <td>{{ vehicle.id }}</td>
                    <td>{{ vehicle.model }}</td>
                    <td>{{ vehicle.displayName }}</td>
                    <td>
                        {{
                            vehicle.characterId === -1
                                ? "Kein Besitzer"
                                : vehicle.characterId
                        }}
                    </td>
                    <td>
                        {{ vehicle.characterId === -1 ? "" : vehicle.characterName }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";

export default class TeamMenuPlayerVehicleCatalog extends Vue {
    private vehicles: VehicleInterface[] = [];
    private cachedVehicles: VehicleInterface[] = [];
    private searchInput = "";

    public open(): void {
        alt.emitServerWithResponse<VehicleInterface[]>("playervehiclecatalog:open")
            .then((vehicles: VehicleInterface[]) => {
                this.vehicles = vehicles;
                this.cachedVehicles = this.vehicles;
            });
    }

    private search(): void {
        if (this.searchInput === "") {
            this.vehicles = this.cachedVehicles;
            return;
        }

        this.vehicles = this.cachedVehicles.filter(
            (v) => v.model.toLowerCase().includes(this.searchInput.toLowerCase()));
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
