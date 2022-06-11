<template>
    <div class='image-amount-input sc-card' @click='choose()'>
        <img :src='getImage(item.image)' />
        <div class='input-group'>
            <span class='input-group-text-dark'>x</span>
            <input v-model.number='amount' class='form-control-dark' maxlength='2' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' type='number' @focus='choose()' @input='sendAmount()' @keypress='allowOnlyNumbers($event)' />
        </div>
        <p class='name'>{{ item.name }}</p>
        <p class='price money-color'>${{ item.price }}</p>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {allowOnlyNumbers} from "@/scripts/helpers/helpers";
import {CatalogItemInterface} from "@/scripts/interfaces/inventory/catalog-item.interface";

export default class ImageAmountInput extends Vue {
    @Prop() private readonly item!: CatalogItemInterface;

    private amount = 1;

    private getImage(image: string): string {
        if (!image)
            return "";

        const images = require.context('@/assets/images/item_icons/', false, /\.png$/);
        return images("./" + image + ".png");
    }

    private sendAmount(): void {
        this.$emit("update-amount", this.amount);
    }

    private choose(): void {
        this.$emit("choose-item", this.item);
        this.sendAmount();
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped>
.image-amount-input {
    pointer-events: all;
    position: relative;
    padding: 0.1vw;

    height: 4vw;
    width: 4vw;
}

img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
}

p {
    position: absolute;
    font-size: 0.7vw;
    font-weight: 600;
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
    padding: unset;
    margin: unset;
}

.name {
    top: 0%;
    left: 50%;
    transform: translate(-50%, -0%);
}

.price {
    font-size: 0.8vw;
    bottom: 20%;
    right: 5%;
}

.input-group {
    position: absolute;
    right: -8%;
    bottom: -8%;
    width: 3vw;
}

.form-control-dark {
    width: 1.5vw;
    height: 1vw;
    padding: 0.2vw;
}

.input-group-text-dark {
    width: 1.5vw;
    height: 1vw;
}
</style>
