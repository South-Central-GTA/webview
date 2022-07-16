<template>
    <div class='vehicle-repair'>
        <h4>Reperaturen</h4>
        <button class='btn btn-primary w-100 h-25 mt-3' type='button' @click='orderRepair()'>
            Fahrzeug reparieren
        </button>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {playerVehicleWorkshopService} from '@/scripts/services/player-vehicle-workshop.service';
import {VehicleModType} from "@/scripts/enums/vehicle-mod.type";


export default class VehicleRepair extends Vue {
    private orderRepair(): void {
        if (!playerVehicleWorkshopService.hasOrder(VehicleModType.Repair)) {
            playerVehicleWorkshopService.orderRepairService();
        } else {
            playerVehicleWorkshopService.resetRepairOrderService();
        }
    }
}
</script>

<style scoped>
.vehicle-repair {
    padding: 1vw;
    height: 100%;
}
</style>
