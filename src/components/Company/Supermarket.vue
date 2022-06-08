<template>
    <div class='supermarket'>
        <div class='sc-card text-white w-25 center' :hidden='!active' v-bind:class='{ enable: active, disable: !active }'>
            <div class='card-body'>
                <button type='button' class='icon-button float-end p-3' @click='close()'>
                    <font-awesome-icon class='center text-white' icon='times' />
                </button>
                <h5 class='card-title'>Supermarkt</h5>

                <div class='list row'>
                    <div v-for='item in buyableItems' v-bind:key='item.id' class='col-3'>
                        <image-amount-input class='mb-3' v-bind:item='item' v-bind:class='{
                selected: item.id === currentItemId,
                unselect: item.id !== currentItemId,
              }' v-on:choose-item='chooseItem($event)' v-on:update-amount='updateAmount($event)' />
                    </div>
                </div>

                <button type='button' class='btn w-100 mt-2' @click='takeItem()' :disabled='currentItemId === 0 || !currentAmount' v-bind:class="{
            'btn-primary': currentItemId !== 0 && currentAmount,
            'btn-secondary': currentItemId === 0 || !currentAmount,
          }">
                    {{ buttonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import ImageAmountInput from "./ImageAmountInput.vue";
import {Options, Vue} from "vue-class-component";
import {CatalogItemInterface} from "@/scripts/interfaces/inventory/catalog-item.interface";

@Options({
    components: {
        ImageAmountInput,
    },
})
export default class Supermarket extends Vue {
    private active = false;
    private buyableItems: CatalogItemInterface[] = [];
    private currentItemId = 0;
    private currentAmount = 0;
    private buttonText = "";

    public mounted(): void {
        alt.on("supermarket:openmenu", (buyableItems: CatalogItemInterface[]) => this.setup(buyableItems));
    }

    public unmounted(): void {
        alt.off("supermarket:openmenu");
    }

    private setup(buyableItems: CatalogItemInterface[]): void {
        this.buyableItems = buyableItems;
        this.active = true;
        this.reset();
    }

    private close(): void {
        this.active = false;
        this.buyableItems = [];

        this.reset();

        alt.emit("menu:close");
    }

    private chooseItem(item: CatalogItemInterface): void {
        this.currentItemId = item.id;
        this.buttonText = item.name + " in den Warenkorb hinzufügen";
    }

    private updateAmount(amount: number): void {
        this.currentAmount = amount;
    }

    private takeItem(): void {
        alt.emitServer("supermarket:buyitem", this.currentItemId, this.currentAmount);
        this.reset();
    }

    private reset(): void {
        this.currentItemId = 0;
        this.currentAmount = 0;
        this.buttonText = "Kein Item ausgewählt";
    }
}
</script>

<style scoped lang='scss'>
.supermarket {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.list {
    overflow-y: auto;
    padding-top: 1vw;
    height: 16.5vw;
}

.selected {
    background-color: rgba(0, 0, 0, 0.03) !important;
}

.unselect:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
