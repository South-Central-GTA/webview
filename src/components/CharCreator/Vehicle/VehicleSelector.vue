<template>
    <div class='vehicle-selector'>
        <div class='select-box sc-card text-white bottom-center'>
            <div class='menu'>
                <div class='left'>
                    <button :disabled='buttonBlocked' class='btn btn-secondary' type='button' @click='changeVehicle(-1)'>
                        <font-awesome-icon icon='caret-left' />
                    </button>
                </div>

                <div style='width: 100%'>
                    <h5 class='text-center'>
                        {{ name }} <span class='fw-lighter'>{{ className }}</span>
                    </h5>
                    <h6 class='text-center'>
                        {{ characterPoints }} South Central Points </h6>
                    <button class='btn btn-primary' type='button' @click='orderVehicle()'>
                        Auswählen
                    </button>
                </div>

                <div class='right'>
                    <button :disabled='buttonBlocked' class='btn btn-secondary' type='button' @click='changeVehicle(1)'>
                        <font-awesome-icon icon='caret-right' />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {CatalogVehicleInterface} from "@/scripts/interfaces/vehicles/catalog-vehicle.interface";

export default class VehicleSelector extends Vue {
    private model = "";
    private name = "TestName";
    private className = "TestKlasse";
    private characterPoints = 420;
    private buttonBlocked = false;

    public mounted(): void {
        alt.on("vehicleselector:setvehicleinfo",
            (catalogVehicle: CatalogVehicleInterface) => this.setVehicleInfo(catalogVehicle));
        alt.on("vehicleselector:unlocksetfree", () => {
            this.buttonBlocked = false;
        });
    }

    public unmounted(): void {
        alt.off("vehicleselector:setvehicleinfo");
        alt.off("vehicleselector:unlocksetfree");
    }

    private setVehicleInfo(catalogVehicle: CatalogVehicleInterface): void {
        this.model = catalogVehicle.model;
        this.name = catalogVehicle.displayName;
        this.className = catalogVehicle.displayClass;
        this.characterPoints = catalogVehicle.southCentralPoints;
    }

    private changeVehicle(direction: number): void {
        this.buttonBlocked = true;
        alt.emit("vehicleselector:change", direction);
    }

    private orderVehicle(): void {
        alt.emit("vehicleselector:order", this.model);
    }
}
</script>

<style scoped>
.selected-house-box {
    width: 20vw;
    position: absolute;
    top: 0%;
    left: 0%;
    margin: 4vw 1vw;
    padding: 1vw;
    border-radius: 0.3vw;
}

.select-box {
    padding: 0.5vw;
    margin-bottom: 1vw;
    width: 20vw;
}

.btn {
    width: 100%;
}

.menu {
    display: flex;
    justify-content: center;
    position: relative;
}

.left {
    position: absolute;
    left: 0%;
}

.right {
    position: absolute;
    right: 0%;
}
</style>
