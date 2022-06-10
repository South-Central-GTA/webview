<template>
    <div class='house-selector'>
        <div v-if='selectedHouseId !== -1' class='selected-box sc-card text-white'>
            <h4>Ausgewählte Immobilie</h4>
            <h6>
                {{ selectedHouseStreetName }} {{ selectedHouseSubName }} {{ selectedHouseHouseNumber }} </h6>
            <div class='row'>
                <div class='col-10'>
                    <button class='btn btn-secondary selected-house-button' type='button' @click='show()'>
                        Anschauen
                    </button>
                </div>
                <div class='col-2'>
                    <button class='btn btn-secondary remove-house-button' type='button' @click='remove()'>
                        <font-awesome-icon class='delete-icon' icon='trash' />
                    </button>
                </div>
            </div>
        </div>

        <div class='select-box sc-card text-white bottom-center'>
            <div class='menu'>
                <div class='left'>
                    <button class='btn btn-secondary' type='button' @click='change(-1)'>
                        <font-awesome-icon icon='caret-left' />
                    </button>
                </div>

                <div v-if='currentHouseId !== -1' style='width: 100%'>
                    <h5 class='text-center'>
                        {{ currentHouseStreetName }} {{ currentHouseSubName }} {{ currentHouseNumber }} </h5>
                    <h6 class='text-center'>
                        {{ currentHouseSouthCentralPoints }} Character Points </h6>
                    <button :disabled='selectButtonDisabled' class='btn btn-primary' type='button' @click='trySelect()'>
                        Auswählen
                    </button>
                </div>

                <div class='right'>
                    <button class='btn btn-secondary' type='button' @click='change(1)'>
                        <font-awesome-icon icon='caret-right' />
                    </button>
                </div>
            </div>
            <div class='row' style='padding-top: 0.5vw'>
                <div class='col'>
                    <button class='btn btn-secondary' type='button' @click='changeCameraPos(0)'>
                        Haustür Kamera
                    </button>
                </div>
                <div class='col'>
                    <button class='btn btn-secondary' type='button' @click='changeCameraPos(1)'>
                        Rundflug Kamera
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

export default class HouseSelector extends Vue {
    private selectedHouseId = -1;
    private selectedHouseStreetName = "";
    private selectedHouseSubName = "";
    private selectedHouseHouseNumber = -1;

    private currentHouseId = -1;
    private currentHouseStreetName = "";
    private currentHouseSubName = "";
    private currentHouseNumber = -1;
    private currentHouseSouthCentralPoints = -1;

    private buttonDisabled = false;
    private selectButtonDisabled = false;

    public mounted(): void {
        alt.on("houseselector:sethouseinfo", (house: HouseInterface) => this.setInfo(house));
        alt.on("houseselector:block", (state: boolean) => this.block(state));
        alt.on("houseselector:select", (house: HouseInterface) => this.select(house));
    }

    public unmounted(): void {
        alt.off("houseselector:sethouseinfo");
        alt.off("houseselector:block");
        alt.off("houseselector:select");
    }

    private setInfo(house: HouseInterface): void {
        this.currentHouseId = house.id;
        this.currentHouseStreetName = house.streetName;
        this.currentHouseSubName = house.subName;
        this.currentHouseNumber = house.houseNumber;
        this.currentHouseSouthCentralPoints = house.southCentralPoints;

        this.buttonDisabled = false;

        if (this.selectButtonDisabled) {
            this.selectButtonDisabled = false;
        }

        if (this.currentHouseId === this.selectedHouseId) {
            this.selectButtonDisabled = true;
        }
    }

    private block(state: boolean): void {
        this.selectButtonDisabled = state;
    }

    private change(direction: number): void {
        this.buttonDisabled = true;

        alt.emit("houseselector:change", direction);
    }

    private trySelect(): void {
        alt.emit("houseselector:tryselect", this.currentHouseId);
    }

    private select(house: HouseInterface): void {
        if (house === null) {
            this.selectedHouseId = -1;
            this.selectButtonDisabled = false;
            return;
        }

        this.selectedHouseId = house.id;
        this.selectedHouseStreetName = house.streetName;
        this.selectedHouseSubName = house.subName;
        this.selectedHouseHouseNumber = house.houseNumber;

        if (this.currentHouseId === this.selectedHouseId) {
            this.selectButtonDisabled = true;
        }
    }

    private show(): void {
        alt.emit("houseselector:show");
    }

    private remove(): void {
        alt.emit("houseselector:remove");
    }

    private changeCameraPos(state: number): void {
        alt.emit("houseselector:changecamera", state);
    }
}
</script>

<style scoped>
.selected-box {
    width: 20vw;
    margin: 1vw;
    padding: 1vw;
    border-radius: 0.3vw;
}

.select-box {
    padding: 0.5vw;
    margin-bottom: 1vw;
    width: 20vw;
}

.remove-house-button {
    color: #fff;
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
