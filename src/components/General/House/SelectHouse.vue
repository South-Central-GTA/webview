<template>
    <div class='select-house'>
        <select :disabled='houses.length <= 1' class='form-select' @change='onChange($event)'>
            <option :hidden='houses.length != 0'>Immobilie benötigt</option>
            <option v-for='(house, i) in houses' v-bind:key='house.Id' :hidden='houses.length == 0' :selected='selectedIndex == i' :value='house.id'>
                {{ house.streetName + " " + house.subName + " " + house.houseNumber }}
            </option>
        </select>
    </div>
</template>

<script lang='ts'>
import house from "@/scripts/services/house.service";
import {Vue} from "vue-class-component";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

export default class SelectHouse extends Vue {
    private houses: HouseInterface[] = [];
    private selectedIndex = 0;

    get hasHouse() {
        return this.houses.length != 0;
    }

    public mounted(): void {
        house
            .getInstance()
            .onChange.on((houses: HouseInterface[]) => this.update(houses.filter((h) => h.houseType === 0)));

        this.setup(house.getInstance().getHouses.filter((h) => h.houseType === 0), false);
    }

    public unmounted(): void {
        house
            .getInstance()
            .onChange.off((houses: HouseInterface[]) => this.update(houses.filter((h) => h.houseType === 0)));
    }

    public setHouse(id: number, fireEvent = false): void {
        if (this.houses.length == 0) {
            return;
        }

        const house = this.houses.find((h) => h.id === id);
        if (house === undefined) {
            return;
        }

        this.selectedIndex = this.houses.indexOf(house);

        if (fireEvent) {
            this.$emit("change-house", house);
        }
    }

    private update(houses: HouseInterface[]): void {
        this.setup(houses, false);
    }

    private setup(houses: HouseInterface[], fireEvent: boolean): void {
        this.houses = houses;

        if (this.houses.length != 0) {
            this.setHouse(this.houses[0].id, fireEvent);
            this.$emit("setup", this.houses[0]);
        }
    }

    private onChange(eventData: any) {
        this.setHouse(Number(eventData.target.value), true);
    }
}
</script>

<style scoped>
select {
    width: 100%;
    height: 100%;
    border: none;
    background-color: rgba(0, 0, 0, 0.3);
    color: var(--gray);
    padding: 0.3vw;
    border-radius: 0.3vw;
    font-size: 0.8vw;
    outline: none !important;
}

.form-select {
    font-size: 0.7vw;
}

select:disabled {
    background-color: rgba(0, 0, 0, 0.2);
}

option:checked {
    display: none;
}
</style>
