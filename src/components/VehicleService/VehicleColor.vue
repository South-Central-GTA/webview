<template>
    <div class='vehicle-color'>
        <h4>Lackierung</h4>
        <div class='row'>
            <div class='col-12 pt-5'>
                <range-slider-menu ref='primaryColor' title='Primärfarbe' maxValue='158' v-on:update-range='updatePrimaryColor($event)' />
            </div>
            <div class='col-12 pt-5'>
                <range-slider-menu ref='secondaryColor' title='Sekundärfarbe' maxValue='158' v-on:update-range='updateSecondaryColor($event)' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import {playerVehicleWorkshopService} from '@/scripts/services/player-vehicle-workshop.service';
import RangeSliderMenu from "@/components/VehicleService/Menus/RangeSliderMenu.vue";
import {VehicleModType} from "@/scripts/enums/vehicle-mod.type";

@Options({
    components: {
        RangeSliderMenu,
    },
})
export default class VehicleColor extends Vue {
    private updatePrimaryColor(value?: number) {
        if (value === null) {
            playerVehicleWorkshopService.resetOrderService(VehicleModType.Colour1);
        } else {
            playerVehicleWorkshopService.orderService(VehicleModType.Colour1, value);
        }
    }

    private updateSecondaryColor(value?: number) {
        if (value === null) {
            playerVehicleWorkshopService.resetOrderService(VehicleModType.Colour2);
        } else {
            playerVehicleWorkshopService.orderService(VehicleModType.Colour2, value);
        }
    }

}
</script>

<style scoped>
.vehicle-color {
    padding: 1vw;
    height: 100%;
}
</style>
