<template>
    <div class='vehicle-tuning'>
        <h4 class='pb-5'>Tuning</h4>
        <div class='row scrollable'>
            <div class='col-12' v-for='[key, value] in tuningParts' v-bind:key='key' >
                <range-slider-menu :title='getName(key)' :maxValue='value' v-on:update-range='updateType(key, $event)' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import RangeSliderMenu from "@/components/VehicleService/Menus/RangeSliderMenu.vue";
import {playerVehicleWorkshopService} from '@/scripts/services/player-vehicle-workshop.service';
import {VehicleModType} from "@/scripts/enums/vehicle-mod.type";
import {VehicleModKitInterface} from "@/scripts/interfaces/vehicles/vehicle-mod-kit.interface";

@Options({
    components: {
        RangeSliderMenu,
    },
})
export default class VehicleColor extends Vue {
    private tuningParts: Map<VehicleModType, number> = new Map<VehicleModType, number>();

    public setup(vehicleModel: string): void {
        fetch("http://assets/southcentral-assets/dumps/vehicleModKits.json").then(async (response) => {
            let datas: VehicleModKitInterface[] = await response.json();
            datas = datas.filter(d => d.VehicleModels.includes(vehicleModel));

            for (const data of datas) {
                for (const mod of data.Mods) {
                    if (!Object.values(VehicleModType).includes(mod.Type)) {
                        continue;
                    }
                    
                    this.tuningParts.set(mod.Type, mod.Index - 1);
                }
            }
        });
    }
    
    private updateType(type: VehicleModType, value?: number): void {
        if (value === null) {
            playerVehicleWorkshopService.resetOrderService(type);
        } else {
            playerVehicleWorkshopService.orderService(type, value);
        }
    }
    
    private getName(type: VehicleModType): string {
        return playerVehicleWorkshopService.getName(type);
    }
}
</script>

<style scoped>
.vehicle-tuning {
    padding: 1vw;
    height: 100%;
}

.scrollable {
    overflow-y: auto;
    height: 48vw;
}

.scrollable::-webkit-scrollbar {
    display: none;
}
</style>
