<template>
    <div class='public-garage-vehicle-card'>
        <h1>
            <div class='veh-name'>{{ vehicle.displayName }}</div>
            <span class='veh-class'>{{ vehicle.displayClass }}</span><span class='costs'> ${{ vehicle.costs }} pro Stunde</span>
        </h1>
    </div>
</template>

<script lang='ts'>
import {Prop} from "vue-property-decorator";
import {Vue} from "vue-class-component";
import {PublicGarageVehicleInterface} from "@/scripts/interfaces/vehicles/public-garage-vehicle.interface";

export default class PublicGarageVehicleCard extends Vue {
    @Prop() private readonly vehicle!: PublicGarageVehicleInterface;
}
</script>

<style scoped>
.public-garage-vehicle-card {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0.2vw;
    border-radius: 0.3vw;
    pointer-events: all !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
}

.public-garage-vehicle-card:hover {
    background-color: rgba(0, 0, 0, 0.8) !important;
}

.public-garage-vehicle-card h1 {
    font-size: 0.8vw;
    color: white;
    margin: unset;
    padding: 0.5vw 1vw;
    pointer-events: none !important;
}

.public-garage-vehicle-card .veh-name {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
}

.public-garage-vehicle-card .veh-class {
    color: rgb(204, 204, 204);
    font-style: italic;
    font-size: 0.5vw;
    pointer-events: none !important;
}

.public-garage-vehicle-card .costs {
    float: right;
    font-size: 0.6vw;
    text-align: right;
    padding-top: 0.2vw;
    pointer-events: none !important;
}

</style>
