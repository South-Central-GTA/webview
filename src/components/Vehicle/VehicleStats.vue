<template>
    <div class='vehicle-stats sc-card text-white'>
        <h4>{{ name }}</h4>
        <div>
            <h6>Geschwindigkeit</h6>
            <div class='progress'>
                <div class='progress-bar progress-bar-striped progress-bar-animated bg-dark' v-bind:style="{ width: vehicleStats.speed + '%' }"></div>
            </div>
        </div>
        <div>
            <h6>Beschleunigung</h6>
            <div class='progress'>
                <div class='progress-bar progress-bar-striped progress-bar-animated bg-dark' v-bind:style="{ width: vehicleStats.acceleration + '%' }"></div>
            </div>
        </div>
        <div>
            <h6>Bremskraft</h6>
            <div class='progress'>
                <div class='progress-bar progress-bar-striped progress-bar-animated bg-dark' v-bind:style="{ width: vehicleStats.breaks + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {VehicleStatsInterface} from "@/scripts/interfaces/vehicles/vehicle-stats.interface";

export default class VehicleStats extends Vue {
    private name = "test";
    private vehicleStats: VehicleStatsInterface = {
        speed: 0, acceleration: 0, breaks: 0,
    };

    public mounted(): void {
        alt.on("vehicle:updatestats",
            (vehicleStats: VehicleStatsInterface, name: string) => this.update(vehicleStats, name));
    }

    public unmounted(): void {
        alt.off("vehicle:updatestats");
    }

    private update(vehicleStats: VehicleStatsInterface, name: string): void {
        this.name = name;
        this.vehicleStats = vehicleStats;
    }
}
</script>

<style scoped>
.vehicle-stats {
    width: 350px;
    padding: 20px;
}
</style>
