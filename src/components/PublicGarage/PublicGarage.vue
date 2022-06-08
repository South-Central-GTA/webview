<template>
    <div class='public-garage' v-bind:class='{ enable: active, disable: !active }'>
        <div class='sc-card w-25 center' :hidden='!active'>
            <div class='card-body' :hidden='tabIndex !== 1'>
                <button type='button' class='btn-close-white icon-button float-end' @click='close()'>
                    <font-awesome-icon class='center' icon='times' />
                </button>

                <h5 class='card-title'>Öffentliche Garage</h5>
                <p class='card-text'>
                    Welches Fahrzeug möchtest du aus der Garage holen? </p>

                <div class='list'>
                    <div v-for='vehicle in parkedVehicles' v-bind:key='vehicle.id'>
                        <public-garage-vehicle-card v-bind:vehicle='vehicle' @click='chooseVehicle(vehicle.id)' v-bind:class='{
                selected: vehicle.id === currentVehicleId,
                unselected: vehicle.id !== currentVehicleId,
              }' />
                    </div>
                </div>

                <button type='button' class='btn btn-primary w-100 mt-2' @click='unparkVehicle()'>
                    Ausparken
                </button>
            </div>
            <div class='card-body' :hidden='tabIndex !== 2'>
                <button type='button' class='btn-close-white icon-button float-end' @click='close()'>
                    <font-awesome-icon class='center' icon='times' />
                </button>

                <h5 class='card-title'>Öffentliche Garage</h5>
                <p class='card-text'>Welches Fahrzeug möchtest du spawnen?</p>

                <div class='list'>
                    <div v-for='vehicle in destroyedVehicles' v-bind:key='vehicle.id'>
                        <vehicle-card class='unselected' v-bind:vehicle='vehicle' @click='respawnVehicle(vehicle.id)' />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import PublicGarageVehicleCard from "./PublicGarageVehicleCard.vue";
import VehicleCard from "@/components/Vehicle/VehicleCard.vue";
import {Options, Vue} from "vue-class-component";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";
import {PublicGarageVehicleInterface} from "@/scripts/interfaces/vehicles/public-garage-vehicle.interface";

@Options({
    components: {
        PublicGarageVehicleCard,
        VehicleCard,
    },
})
export default class PublicGarage extends Vue {
    private active = false;
    private tabIndex = -1;
    private parkedVehicles: PublicGarageVehicleInterface[] = [];
    private destroyedVehicles: VehicleInterface[] = [];
    private currentVehicleId = 0;

    public mounted(): void {
        alt.on(
            "publicgarage:setupunpark",
            (vehicles: PublicGarageVehicleInterface[]) => this.setupUnpark(vehicles)
        );
        alt.on(
            "publicgarage:showrespawnvehiclelist",
            (vehicles: VehicleInterface[]) => this.setupRespawn(vehicles)
        );
    }

    public unmounted(): void {
        alt.off("publicgarage:setupunpark");
        alt.off("publicgarage:showrespawnvehiclelist");
    }

    private setupUnpark(vehicles: PublicGarageVehicleInterface[]): void {
        this.parkedVehicles = vehicles;
        this.active = true;
        this.tabIndex = 1;
    }

    private setupRespawn(vehicles: VehicleInterface[]): void {
        this.destroyedVehicles = vehicles;
        this.active = true;
        this.tabIndex = 2;
    }

    private chooseVehicle(id: number): void {
        this.currentVehicleId = id;
    }

    private respawnVehicle(id: number): void {
        alt.emitServer("publicgarage:requestvehiclerespawnprice", id);
        this.close();
    }

    private unparkVehicle(): void {
        alt.emitServer("publicgarage:unparkvehicle", this.currentVehicleId);
        this.close();
    }

    private close(): void {
        this.active = false;
        this.parkedVehicles = [];
        this.destroyedVehicles = [];
        this.currentVehicleId = 0;
        this.tabIndex = -1;

        alt.emit("menu:close");
    }
}
</script>

<style scoped lang='scss'>
.public-garage {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.list {
    overflow-y: auto;
    padding-top: 1vw;
    height: 16.5vw;
}

.selected {
    border-radius: 0.3vw;
    background-color: rgba(0, 0, 0, 0.7) !important;
}

.selected:hover {
    background-color: rgba(0, 0, 0, 0.8) !important;
}

.unselected {
    border-radius: 0.3vw;
    background-color: rgba(0, 0, 0, 0.4) !important;
}

.unselected:hover {
    background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
