<template>
    <div class='vehicle-import-page'>
        <div class='vehicle-import-page-header'>
            <img src='@/assets/images/phone/ssas-logo.png' />
            <div class='px-2'>
                <p>Willkommen, {{ name }}!</p>
            </div>
        </div>

        <div v-if='!hasAccess' class='no-access-box'>
            <p>Keine Zugriffsrechte!</p>
        </div>

        <div :hidden='isBuyMenuOpen || isOrderMenuOpen' class='row pt-2'>
            <div class='col-2'>
                <div class='btn-group-vertical p-2 w-100'>
                    <button class='btn btn-dark' @click='openOrderMenu()'>
                        Meine Bestellungen
                    </button>
                </div>
            </div>
            <div class='col-8'>
                <input v-model='nameSearch' class='form-control mt-1 mb-1' placeholder='Fahrzeugnamen suchen...' type='text' @blur='onFocus(false)' @focus='onFocus(true)' @input='search()' />

                <div class='vehicles-list'>
                    <button v-for='vehicle in vehicles' v-bind:key='vehicle.model' class='icon-button col-4 p-2' @click='openBuyMenu(vehicle)'>
                        <div class='vehicle-entry'>
                            <img :src='getVehicleImage(vehicle.model)' />

                            <div class='row'>
                                <div class='col-6'>
                                    <h1>{{ vehicle.displayName }}</h1>
                                </div>

                                <div class='col-6'>
                                    <h1>{{ vehicle.displayClass }}</h1>
                                </div>
                                <div class='col-12'>
                                    <h1>
                                        Verfügbare Anzahl: {{ vehicle.amountOfOrderableVehicles }} </h1>
                                </div>

                                <div class='col price-box'>
                                    <h2>
                                        ${{
                                            vehicle.price
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                        }} </h2>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div class='col-2'>
                <div class='m-2'>
                    <label>Kategorien:</label>
                    <select id='class-select' ref='classSelection' name='class' @change='onChangeClass()'>
                        <option value='ALL'>Alle</option>
                        <option value='COMPACT'>Compact</option>
                        <option value='SEDAN'>Sedan</option>
                        <option value='SUV'>SUV</option>
                        <option value='COUPE'>Coupe</option>
                        <option value='MUSCLE'>Muscle</option>
                        <option value='SPORT'>Sport</option>
                        <option value='MOTORCYCLE'>Motorräder</option>
                        <option value='CYCLE'>Fahrrad</option>
                        <option value='OFF_ROAD'>Off-Road</option>
                        <option value='INDUSTRIAL'>Industrial</option>
                        <option value='UTILITY'>Utility</option>
                        <option value='VAN'>Van</option>
                        <option value='COMMERCIAL'>Commercial</option>
                    </select>
                </div>
            </div>
        </div>
        <div :hidden='!isBuyMenuOpen' class='row'>
            <div class='col-2'>
                <div class='btn-group-vertical p-2 w-100'>
                    <button class='btn btn-dark' @click='closeBuyMenu()'>Zurück</button>
                </div>
            </div>
            <div class='col-9 p-3 showcase-entry'>
                <div class='row'>
                    <div class='col-6'>
                        <img :src='getVehicleImage(buyMenuVehicleModel)' class='showcase-image' />
                        <p class='text-muted pt-1' style='font-style: italic'>
                            Dies ist nur ein Vorschaubild. </p>
                    </div>
                    <div class='col'>
                        <h1>{{ buyMenuVehicleName }} {{ buyMenuVehicleClass }}</h1>
                        <h2>
                            {{
                                buyMenuVehiclePrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            }} </h2>
                        <p>
                            Nach dem erfolgreichen Kauf dauert es einen (1) bis vier (4) Tage bis das Fahrzeug nach Los Santos verschifft wurde. Jede Bestellung wird einzelnd abgearbeitet. </p>
                        <button class='btn btn-buy w-100 text-white' @click='requestOrder()'>
                            Fahrzeug kostenpflichtig bestellen
                        </button>
                        <h3 v-if="warningMessage !== ''" class='text-danger p-2'>
                            {{ warningMessage }} </h3>
                        <h3 v-if='successMessageVisible' class='text-success p-2'>
                            Fahrzeug wurde erfolgreich bestellt! </h3>
                    </div>
                </div>
            </div>
        </div>
        <div :hidden='!isOrderMenuOpen' class='row'>
            <div class='col-2'>
                <div class='btn-group-vertical p-2 w-100'>
                    <button class='btn btn-dark' @click='closeOrderMenu()'>Zurück</button>
                </div>
            </div>
            <div class='col-9'>
                <input v-model='nameSearch' class='form-control mt-1 mb-1' placeholder='Fahrzeugnamen suchen...' type='text' @blur='onFocus(false)' @focus='onFocus(true)' @input='search()' />

                <div class='vehicles-list row'>
                    <div v-for='vehicle in orderedVehicles' v-bind:key='vehicle.id' class='icon-button col-4 p-2'>
                        <div class='vehicle-entry'>
                            <h1>
                                Bestellnummer: #{{ vehicle.id.toString().padStart(6, 0) }} </h1>

                            <img :src='getVehicleImage(vehicle.model)' />

                            <div class='row'>
                                <div class='col-6'>
                                    <h1>{{ vehicle.displayName }}</h1>
                                </div>

                                <div class='col-6'>
                                    <h1>{{ vehicle.displayClass }}</h1>
                                </div>
                            </div>

                            <p>Bestellt von: {{ vehicle.orderedBy }}.</p>
                            <p v-if='vehicle.deliveryRequestedBy'>
                                Lieferauftrag erstellt von: {{ vehicle.deliveryRequestedBy }} am {{ getDate(vehicle.deliveryRequestedAtJson) }}. </p>

                            <div class='m-2'>
                                <button v-if='!vehicle.deliveryRequestedBy' :disabled='!getButtonState(vehicle)' class='btn btn-primary w-100' @click='requestDeliveryTask(vehicle.id)'>
                                    {{ getButtonString(vehicle) }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if='orderedVehicles.length === 0'>
                    <h3 class='text-muted p-5'>Sie haben noch keine Bestellungen.</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {onFocus} from "@/scripts/helpers/helpers";
import {CatalogVehicleInterface} from "@/scripts/interfaces/vehicles/catalog-vehicle.interface";
import {OrderedVehicleInterface} from "@/scripts/interfaces/vehicles/ordered-vehicle.interface";

export default class VehicleImportPage extends Vue {
    @Ref() private readonly classSelection!: HTMLSelectElement;

    private name = "Max Mustermann";
    private hasAccess = false;

    private isBuyMenuOpen = false;
    private buyMenuVehicleModel = "";
    private buyMenuVehicleName = "";
    private buyMenuVehicleClass = "";
    private buyMenuVehiclePrice = "";

    private isOrderMenuOpen = false;
    private orderMenuInterval: number | undefined;
    private orderedVehicles: OrderedVehicleInterface[] = [];

    private warningMessage = "";
    private successMessageVisible = false;

    private nameSearch = "";

    private vehicles: CatalogVehicleInterface[] = [];
    private cachedVehicles: CatalogVehicleInterface[] = this.vehicles;

    public mounted(): void {
        alt.on("vehicledealer:setup", (args: any[]) => this.setup(args[0], args[1], args[2]));
        alt.on("vehicledealer:setwarning", (args: any[]) => this.setWarningMessage(args[0]));
        alt.on("vehicledealer:setorders", (args: any[]) => this.setOrders(args[0]));
        alt.on("vehicledealer:ordersuccessfull", () => this.orderSuccessfull());
        alt.on("vehicledealer:update", (args: any[]) => this.update(args[0]));
    }

    public unmounted(): void {
        alt.off("vehicledealer:setup");
        alt.off("vehicledealer:setwarning");
        alt.off("vehicledealer:setorders");
        alt.off("vehicledealer:ordersuccessfull");
        alt.off("vehicledealer:update");
    }

    public resetPage(): void {
        this.isBuyMenuOpen = false;
        this.isOrderMenuOpen = false;
        this.nameSearch = "";
        this.warningMessage = "";
    }

    private setup(name: string, hasAcccess: boolean, vehicles: CatalogVehicleInterface[]): void {
        this.name = name;
        this.hasAccess = hasAcccess;
        this.vehicles = vehicles;

        this.cachedVehicles = this.vehicles;
    }

    private setWarningMessage(message: string): void {
        this.successMessageVisible = false;
        this.warningMessage = message;
    }

    private setOrders(orderedVehicles: OrderedVehicleInterface[]): void {
        this.orderedVehicles = orderedVehicles.sort((a, b) => {
            return a.id - b.id;
        });
    }

    private orderSuccessfull(): void {
        this.successMessageVisible = true;
        this.warningMessage = "";

        setTimeout(() => {
            this.successMessageVisible = false;
        }, 2000);
    }

    private update(vehicle: CatalogVehicleInterface): void {
        const cachedIndex = this.cachedVehicles.findIndex((v) => v.model === vehicle.model);
        this.cachedVehicles[cachedIndex] = vehicle;

        const index = this.vehicles.findIndex((v) => v.model === vehicle.model);
        if (index !== -1) {
            this.vehicles[index] = vehicle;
        }
    }

    private openBuyMenu(vehicle: CatalogVehicleInterface): void {
        this.isBuyMenuOpen = true;

        this.buyMenuVehicleModel = vehicle.model;
        this.buyMenuVehicleName = vehicle.displayName;
        this.buyMenuVehicleClass = vehicle.displayClass;
        this.buyMenuVehiclePrice = "$" + vehicle.price;
    }

    private closeBuyMenu(): void {
        this.isBuyMenuOpen = false;
        this.warningMessage = "";
    }

    private requestOrder(): void {
        alt.emitServer("vehicledealer:reqeustorder", this.buyMenuVehicleModel);
    }

    private openOrderMenu(): void {
        this.isOrderMenuOpen = true;

        if (this.orderMenuInterval) {
            clearInterval(this.orderMenuInterval);
        }

        // Hack to update the status of the buttons in order menu.
        this.orderMenuInterval = setInterval(() => {
            const orderedVehicles = this.orderedVehicles;
            this.orderedVehicles = [];
            this.orderedVehicles = orderedVehicles;
            this.$forceUpdate();
        }, 1000);

        alt.emitServer("vehicledealer:getorders");
    }

    private closeOrderMenu(): void {
        this.isOrderMenuOpen = false;

        if (this.orderMenuInterval) {
            clearInterval(this.orderMenuInterval);
        }
    }

    private requestDeliveryTask(orderedVehicleId: number): void {
        alt.emitServer("vehicledealer:requestdelivery", orderedVehicleId);
    }

    private getVehicleImage(vehicleModel: string): string {
        return ("http://assets/southcentral-assets/vehicles/" + vehicleModel + ".jpg");
    }

    private search(): void {
        this.vehicles = this.cachedVehicles;

        if (this.nameSearch === "") {
            if (this.classSelection.value === "ALL") {
                this.vehicles = this.cachedVehicles;
            } else {
                this.onChangeClass();
            }
            return;
        }

        if (this.classSelection.value === "ALL") {
            this.vehicles = this.vehicles.filter(
                (v) => v.displayName.toLowerCase().includes(this.nameSearch.toLowerCase()));
        } else {
            this.vehicles = this.vehicles.filter((v) => v.displayName.toLowerCase().includes(
                this.nameSearch.toLowerCase()) && v.classId.toLowerCase() == this.classSelection.value.toLowerCase());
        }
    }

    private onChangeClass(): void {
        this.vehicles = this.cachedVehicles;

        if (this.classSelection.value === "ALL") {
            if (this.nameSearch === "") {
                this.vehicles = this.cachedVehicles;
            } else {
                this.vehicles = this.vehicles.filter(
                    (v) => v.displayName.toLowerCase().includes(this.nameSearch.toLowerCase()));
            }
            return;
        }

        if (this.nameSearch === "") {
            this.vehicles = this.vehicles.filter(
                (v) => v.classId.toLowerCase() === this.classSelection.value.toLowerCase());
        } else {
            this.vehicles = this.vehicles.filter((v) => v.displayName.toLowerCase().includes(
                this.nameSearch.toLowerCase()) && v.classId.toLowerCase() === this.classSelection.value.toLowerCase());
        }
    }

    private getButtonString(vehicle: OrderedVehicleInterface): string {
        if (this.isDatePast(vehicle.deliverdAt)) {
            return "Lieferauftrag erstellen";
        } else {
            return "Verfügbar am " + this.getDate(vehicle.deliverdAt);
        }
    }

    private getButtonState(vehicle: OrderedVehicleInterface): boolean {
        if (this.isDatePast(vehicle.deliverdAt)) {
            return !this.isDatePast(vehicle.deliveryRequestedAtJson);
        } else {
            return false;
        }
    }

    private getDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            weekday: "short", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private isDatePast(dateJson: string): boolean {
        const date = new Date(JSON.parse(dateJson));
        return new Date() > date && JSON.parse(dateJson) !== "0001-01-01T00:00:00";
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>

<style lang='scss' scoped>
.vehicle-import-page {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.vehicle-import-page-header {
    background-image: url("../../../../assets/images/phone/ssas-header.jpg");
    background-position: center center;
    background-size: 100vw;

    & img {
        width: 20%;
        padding: 1vw;
    }

    & div {
        background-color: #db8b02;

        & p {
            font-weight: 500;
            margin: 0;
        }
    }
}

.no-access-box {
    position: absolute;
    z-index: 9999;
    color: whitesmoke;
    background-color: rgba(0, 0, 0, 0.8);
    height: 100%;
    width: 100%;

    & p {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.vehicles-list {
    overflow-x: hidden;
    overflow-y: scroll;
    height: 19vw;
}

.vehicle-entry {
    width: 100%;
    overflow: hidden;
    background-color: whitesmoke;

    & img {
        height: 10vw;
    }

    & p {
        font-size: 0.8vw;
        padding-left: 0.52vw;
        padding-right: 0.52vw;
        font-style: italic;
        margin: unset;
    }

    & h1 {
        font-size: 0.9vw;
        padding: 0.52vw;
        width: 100%;
        text-align: left;
        margin: unset;
    }

    & h2 {
        font-size: 1.1vw;
        padding: 0.4vw;
        color: whitesmoke;
        background-color: #db8b02;
        margin: unset;
    }
}

.showcase-entry {
    & img {
        height: 12vw;
    }

    & h1 {
        font-size: 0.9vw;
        padding: 0.52vw;
        width: 100%;
        text-align: left;
    }

    & h2 {
        font-size: 1.1vw;
        padding: 0.4vw;
        background-color: #db8b02;
        color: whitesmoke;
    }

    & h3 {
        font-size: 0.9vw;
    }

    & .btn-buy {
        background-color: #27ae60;
        height: 3vw;
    }
}
</style>
