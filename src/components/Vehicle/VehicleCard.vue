<template>
    <div class='vehicle-card'>
        <h1>
            <div class='veh-name'>{{ vehicle.displayName }}</div>
            <span class='veh-class'>{{ vehicle.displayClass }}</span>
        </h1>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";

export default class VehicleCard extends Vue {
    @Prop() private readonly vehicle!: VehicleInterface;
}
</script>

<style scoped>
.vehicle-card {
    width: 95%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0.2vw;
    border-radius: 0.3vw;
    pointer-events: all !important;
}

.vehicle-card h1 {
    font-size: 0.8vw;
    color: white;
    margin: unset;
    padding: 0.5vw 1vw;
    pointer-events: none !important;
}

.vehicle-card .veh-name {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
}

.vehicle-card .veh-class {
    color: rgb(204, 204, 204);
    font-style: italic;
    font-size: 0.5vw;
    pointer-events: none !important;
}
</style>
