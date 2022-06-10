<template>
    <div class='team-menu-vehicle-catalog'>
        <h2>Fahrzeug Katalog</h2>
        <div class='row'>
            <div class='col-4'>
                <input v-model='vehicleSearch' class='form-control-dark mb-2' placeholder='Suche nach Model (Bsp. dilettante)' type='text' @input='search()' />
            </div>
            <div class='col-3'>
                <select ref='classSelection' class='form-control-dark' name='class' @change='onChangeClass()'>
                    <option value='ALL'>Alle</option>
                    <option value='BOAT'>Boot</option>
                    <option value='COMMERCIAL'>Commercial</option>
                    <option value='COMPACT'>Compact</option>
                    <option value='COUPE'>Coupe</option>
                    <option value='CYCLE'>Fahrrad</option>
                    <option value='EMERGENCY'>Einsatzfahrzeug</option>
                    <option value='INDUSTRIAL'>Industrial</option>
                    <option value='MILITARY'>Militär</option>
                    <option value='MOTORCYCLE'>Motorräder</option>
                    <option value='MUSCLE'>Muscle</option>
                    <option value='OFF_ROAD'>Off-Road</option>
                    <option value='PLANE'>Flugzeug</option>
                    <option value='SEDAN'>Sedan</option>
                    <option value='SERVICE'>Service</option>
                    <option value='SPORT'>Sport</option>
                    <option value='SPORT_CLASSIC'>Sport Classic</option>
                    <option value='SUPER'>Super</option>
                    <option value='SUV'>SUV</option>
                    <option value='UTILITY'>Utility</option>
                    <option value='VAN'>Van</option>
                </select>
            </div>
            <div class='col-4'>
                <p v-if='warningMessage.length !== 0' class='text-danger'>
                    {{ warningMessage }} </p>
            </div>
        </div>
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Model</th>
                    <th>Name</th>
                    <th>Klasse</th>
                    <th>Max. Tank</th>
                    <th>Treibstoff</th>
                    <th>Preis</th>
                    <th>South Central Points</th>
                    <th>Anzahl an bestellbaren Fahrzeugen</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='vehicle in vehicles' v-bind:key='vehicle.id' class='entry'>
                    <td>{{ vehicle.model }}</td>
                    <td>{{ vehicle.displayName }}</td>
                    <td>{{ vehicle.displayClass }}</td>
                    <td>{{ vehicle.maxTank }}</td>
                    <td>{{ getFuelTypeLabel(vehicle.fuelType) }}</td>
                    <td>
                        ${{
                            vehicle.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }}
                    </td>
                    <td>{{ vehicle.southCentralPoints }}</td>
                    <td>
                        <div class='input-group'>
                            <input v-model='vehicle.amountOfOrderableVehicles' class='form-control-dark' type='number' />
                            <span class='btn btn-primary input-group-text' @click='updateOrderableVehicles(vehicle)'>Stück</span>
                        </div>
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
import {Ref} from "vue-property-decorator";
import {CatalogVehicleInterface} from "@/scripts/interfaces/vehicles/catalog-vehicle.interface";

export default class TeamMenuVehicleCatalog extends Vue {
    @Ref() private readonly classSelection!: HTMLSelectElement;

    private vehicles: CatalogVehicleInterface[] = [];
    private cachedVehicles: CatalogVehicleInterface[] = [];
    private vehicleSearch = "";
    private warningMessage = "";

    public open(): void {
        alt.emitServerWithResponse<CatalogVehicleInterface[]>("vehiclecatalog:open")
            .then((vehicles: CatalogVehicleInterface[]) => {
                this.vehicles = vehicles;
                this.cachedVehicles = this.vehicles;
                this.classSelection.value = "ALL";
            });
    }

    public mounted(): void {
        alt.on("vehiclecatalog:update", (args: any[]) => this.update(args[0]));
    }

    public unmounted(): void {
        alt.off("vehiclecatalog:update");
    }

    private update(vehicle: CatalogVehicleInterface): void {
        const cachedIndex = this.cachedVehicles.findIndex((v) => v.model === vehicle.model);
        this.cachedVehicles[cachedIndex] = vehicle;

        const index = this.vehicles.findIndex((v) => v.model === vehicle.model);
        if (index !== -1) {
            this.vehicles[index] = vehicle;
        }
    }

    private getFuelTypeLabel(type: number): string {
        switch (type) {
            case 0:
                return "Muskelkraft";
            case 1:
                return "Diesel";
            case 2:
                return "Benzin";
            case 3:
                return "Kerosin";
            case 4:
                return "Strom";
        }

        return "";
    }

    private updateOrderableVehicles(vehicle: CatalogVehicleInterface): void {
        if (vehicle.amountOfOrderableVehicles < 0) {
            this.showWarningMessage("Die Zahl an bestellbaren Fahrzeugen darf nicht negativ sein.");
            return;
        }

        alt.emitServer("vehiclecatalog:requestsetorderablevehiclesamount", vehicle.model,
            vehicle.amountOfOrderableVehicles);
    }

    private showWarningMessage(message: string): void {
        this.warningMessage = message;
        setTimeout(() => {
            this.warningMessage = "";
        }, 5000);
    }

    private search(): void {
        this.vehicles = this.cachedVehicles;

        if (this.vehicleSearch === "") {
            if (this.classSelection.value === "ALL") {
                this.vehicles = this.cachedVehicles;
            } else {
                this.onChangeClass();
            }
            return;
        }

        if (this.classSelection.value === "ALL") {
            this.vehicles = this.vehicles.filter(
                (v) => v.displayName.toLowerCase().includes(this.vehicleSearch.toLowerCase()));
        } else {
            this.vehicles = this.vehicles.filter((v) => v.displayName
                .toLowerCase()
                .includes(
                    this.vehicleSearch.toLowerCase()) && v.classId.toLowerCase() === this.classSelection.value.toLowerCase());
        }
    }

    private onChangeClass(): void {
        this.vehicles = this.cachedVehicles;

        if (this.classSelection.value === "ALL") {
            if (this.vehicleSearch === "") {
                this.vehicles = this.cachedVehicles;
            } else {
                this.vehicles = this.vehicles.filter(
                    (v) => v.displayName.toLowerCase().includes(this.vehicleSearch.toLowerCase()));
            }
            return;
        }

        if (this.vehicleSearch === "") {
            this.vehicles = this.vehicles.filter(
                (v) => v.classId.toLowerCase() === this.classSelection.value.toLowerCase());
        } else {
            this.vehicles = this.vehicles.filter((v) => v.displayName
                .toLowerCase()
                .includes(
                    this.vehicleSearch.toLowerCase()) && v.classId.toLowerCase() === this.classSelection.value.toLowerCase());
        }
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
    color: white !important;
}

.table,
.entry {
    color: white !important;
}
</style>
