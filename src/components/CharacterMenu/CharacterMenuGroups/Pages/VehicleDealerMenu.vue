<template>
    <div class='vehicle-dealer-menu'>
        <h6>Fahrzeughändler</h6>

        <div v-if='!showNoPermissionsError'>
            <div v-if='closeToBase'>
                <p v-if='vehicles.length === 0' class='text-muted'>
                    Aktuell befinden sich keine Fahrzeuge im Lager. </p>
                <div v-if='vehicles.length !== 0'>
                    <p class='text-muted'>
                        Klicke das Fahrzeug an welches du aus dem Lager ausparken möchtest. </p>
                    <div class='list row g-1'>
                        <div v-for='vehicle in vehicles' v-bind:key='vehicle.id' class='col-4'>
                            <vehicle-card class='btn btn-secondary' v-bind:vehicle='vehicle' @click='chooseVehicle(vehicle.id)' />
                        </div>
                    </div>
                </div>
                <button v-if='storeVehicleButtonVisible' class='btn btn-secondary' @click='storeVehicle()'>
                    {{ vehicleDisplayName }} ins Lager packen
                </button>
            </div>
            <div v-else>
                <p class='text-muted'>
                    Du kannst Fahrzeuge nur in der Nähe des Hauptsitzes ausparken. </p>
            </div>
        </div>

        <p v-if='showNoPermissionsError' class='text-danger'>
            Dein Charakter hat keine Berechtigung um Fahrzeuge aus dem Lager ein- oder auszuparken. </p>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import VehicleCard from "@/components/Vehicle/VehicleCard.vue";
import {Options, Vue} from "vue-class-component";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";

@Options({
    components: {
        VehicleCard,
    },
})
export default class VehicleDealerMenu extends Vue {
    private closeToBase = false;
    private vehicles: VehicleInterface[] = [];
    private companyId = -1;
    private storeVehicleButtonVisible = false;
    private showNoPermissionsError = false;
    private vehicleDisplayName = "";

    public mounted(): void {
        alt.on("groupmenuvehicledealer:sendvehicles", (args: any[]) => this.setVehicles(args[0]));
        alt.on("groupmenuvehicledealer:showparkinbutton", (args: any[]) => this.setParkinVehicleButton(args[0]));
        alt.on("groupmenuvehicledealer:nopermissions", () => this.showNoPermissions());
    }

    public unmounted(): void {
        alt.off("groupmenuvehicledealer:sendvehicles");
        alt.off("groupmenuvehicledealer:showparkinbutton");
        alt.off("groupmenuvehicledealer:nopermissions");
    }

    public setCloseToBase(closeToBase: boolean): void {
        this.closeToBase = closeToBase;

        this.storeVehicleButtonVisible = false;
        this.showNoPermissionsError = false;

        alt.emitServer("groupmenuvehicledealer:checkvehicle", this.companyId);
    }

    public setup(companyId: number): void {
        this.companyId = companyId;

        alt.emitServer("groupmenuvehicledealer:getvehicles", this.companyId);
    }

    private setVehicles(vehicles: VehicleInterface[]): void {
        this.vehicles = vehicles;
    }

    private setParkinVehicleButton(vehicle: VehicleInterface): void {
        this.storeVehicleButtonVisible = true;
        this.vehicleDisplayName = vehicle.displayName;
    }

    private showNoPermissions(): void {
        this.showNoPermissionsError = true;
    }

    private storeVehicle(): void {
        alt.emitServer("groupmenuvehicledealer:requeststorevehicle", this.companyId);
        this.storeVehicleButtonVisible = false;
    }

    private chooseVehicle(vehicleId: number): void {
        alt.emitServer("groupmenuvehicledealer:spawnvehicle", vehicleId, this.companyId);
    }
}
</script>

<style lang='scss' scoped>
.list {
    overflow-y: auto;
    height: 10vw;
}
</style>
