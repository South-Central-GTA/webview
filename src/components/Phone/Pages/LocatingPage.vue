<template>
    <div class='locating-page'>
        <div class='pt-5'>
            <div class='position-relative'>
                <h5>Fahrzeuge Tracking App</h5>
                <font-awesome-icon class='tracking-app-icon' icon='map-marker' />
            </div>
            <p class='subtitle'>Wir wissen, wo Sie nachts parken.</p>
        </div>

        <div v-if='isLoading && !loadedOnce' class='loading'>
            <h1>{{ loadingText }}</h1>
        </div>

        <div v-else>
            <div v-if='!isTracking' class='m-2'>
                <div v-if='characterVehicles.length !== 0'>
                    <h6>Privatfahrzeuge</h6>
                    <div class='list'>
                        <div v-for='vehicle in characterVehicles' v-bind:key='vehicle.id'>
                            <vehicle-card class='vehicle-entry' v-bind:vehicle='vehicle' @click='chooseVehicle(vehicle.id)' />
                        </div>
                    </div>
                </div>
                <div v-if='groupVehicles.length !== 0' class='pt-1'>
                    <h6>Gruppen Fahrzeuge</h6>
                    <div class='list'>
                        <div v-for='vehicle in groupVehicles' v-bind:key='vehicle.id'>
                            <vehicle-card class='vehicle-entry' v-bind:vehicle='vehicle' @click='chooseVehicle(vehicle.id)' />
                        </div>
                    </div>
                </div>
                <div v-if='
            groupVehicles.length === 0 && this.characterVehicles.length === 0
          '>
                    Sie besitzen keine Fahrzeuge.
                </div>
            </div>
            <div v-else>
                <button class='mt-5 btn stop-tracking-button' type='button' @click='stopTracking()'>
                    Tracking beenden
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import VehicleCard from "@/components/Vehicle/VehicleCard.vue";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";

@Options({
    components: {
        VehicleCard,
    },
})
export default class LocatingPage extends Vue {
    private hasData = false;
    private isLoading = false;
    private loadedOnce = false;
    private isTracking = false;
    private loadingText = "";
    private loadingInt = 0;
    private characterVehicles: VehicleInterface[] = [];
    private groupVehicles: VehicleInterface[] = [];

    public mounted(): void {
        alt.on("locating:setvehicles", (args: any[]) => this.setVehicles(args[0]));
    }

    public unmounted(): void {
        alt.off("locating:setvehicles");
    }

    public open(): void {
        if (this.loadedOnce) {
            alt.emitServer("locating:requestapp");
        } else {
            alt.emitServer("locating:requestapp");

            setTimeout(() => {
                this.isLoading = false;
                this.loadedOnce = true;
            }, 2000);
        }

        this.isLoading = true;

        let step = 0;
        this.loadingText = "Anmeldung läuft ...";

        if (this.loadingInt !== undefined) {
            clearInterval(this.loadingInt);
        }
        this.loadingInt = setInterval(() => {
            if (step === 0) {
                this.loadingText = "Anmeldung läuft .";
            }
            if (step === 1) {
                this.loadingText = "Anmeldung läuft ..";
            }
            if (step === 2) {
                this.loadingText = "Anmeldung läuft ...";
            }

            step++;
            if (step === 3) {
                step = 0;
            }
            if (!this.isLoading) {
                clearInterval(this.loadingInt);
            }
        }, 500);
    }

    public reset(): void {
        this.hasData = false;
        this.resetLoading();
    }

    public resetLoading(): void {
        this.isLoading = false;
        this.loadedOnce = false;
    }

    private setVehicles(vehicles: VehicleInterface[]): void {
        this.characterVehicles = vehicles.filter((v) => !v.isGroupVehicle);
        this.groupVehicles = vehicles.filter((v) => v.isGroupVehicle);

        this.hasData = true;
    }

    private chooseVehicle(vehicleDbId: number): void {
        this.isTracking = true;
        alt.emitServer("locating:trackvehicle", vehicleDbId);
    }

    private stopTracking(): void {
        this.isTracking = false;
        alt.emitServer("locating:stop");
    }
}
</script>

<style lang='scss' scoped>
.locating-page {
    overflow: hidden;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background: linear-gradient(
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.8)
    ),
    url("../../../assets/images/patterns/locatingappbackground.png");

    background-position: center center;
    background-size: 25vw;
}

.loading {
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background-position: center center;
    background-size: 25vw;
    z-index: 100;
}

.loading h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1vw;
    width: 100%;
    color: var(--gray);
}

.loading .logo {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 5vw;
}

.tracking-app-icon {
    position: absolute;
    top: 0;
    right: 5%;
    color: #89ce3fff;
}

::-webkit-scrollbar-thumb {
    background: #89ce3fff;
}

.subtitle {
    font-style: italic;
    margin: 0;
    padding: 0;
}

.stop-tracking-button {
    height: 20.5vw !important;
    background-color: rgba(80, 131, 55, 1);
    color: white !important;
    width: 90%;
    margin-top: auto;
    border-radius: 0vw;
}

.list {
    overflow-y: auto;
    height: 10.5vw;
}

.vehicle-entry {
    border-radius: 0vw;
    background-color: rgba(80, 131, 55, 1);

    &:hover {
        background-color: rgb(63, 105, 43);
    }
}
</style>
