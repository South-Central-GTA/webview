<template>
    <div class='ammunation'>
        <div :hidden='!active' class='sc-card text-white w-25 center' v-bind:class='{ enable: active, disable: !active }'>
            <div class='card-body'>
                <button class='btn-close-white icon-button float-end' type='button' @click='close()'>
                    <font-awesome-icon class='center' icon='times' />
                </button>
                <h5 class='card-title'>Ammunation</h5>

                <div class='list row'>
                    <div v-for='item in buyableItems' v-bind:key='item.id' class='col-3'>
                        <image-amount-input class='mb-3' v-bind:class='{
                selected: item.id === currentItemId,
                unselect: item.id !== currentItemId,
              }' v-bind:item='item' v-on:choose-item='chooseItem($event)' v-on:update-amount='updateAmount($event)' />
                    </div>
                </div>

                <button :disabled='currentItemId == 0 || !currentAmount' class='btn w-100 mt-2' type='button' v-bind:class="{
            'btn-primary': currentItemId !== 0 && currentAmount,
            'btn-secondary': currentItemId === 0 || !currentAmount,
          }" @click='takeItem()'>
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
export default class Ammunation extends Vue {
    private active = false;
    private buyableItems: CatalogItemInterface[] = [];
    private currentItemId = 0;
    private currentAmount = 0;
    private buttonText = "";

    public mounted(): void {
        alt.on("ammunation:openmenu", (buyableItems: CatalogItemInterface[]) => this.setup(buyableItems));
    }

    public unmounted(): void {
        alt.off("ammunation:openmenu");
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
        this.buttonText = item.name + " kaufen";
    }

    private updateAmount(amount: number): void {
        this.currentAmount = amount;
    }

    private takeItem(): void {
        alt.emitServer("ammunation:buyitem", this.currentItemId, this.currentAmount);
        this.close();
    }

    private reset(): void {
        this.currentItemId = 0;
        this.currentAmount = 0;
        this.buttonText = "Kein Item ausgewählt";
    }
}
</script>

<style lang='scss' scoped>
.ammunation {
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
