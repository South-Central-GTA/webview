<template>
    <div class='order-products-page'>
        <div class='phone-header'>
            <button class='icon-button' type='button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Produkte bestellen</span>
            </button>
        </div>

        <div class='header-image'></div>

        <div class='pt-5'>
            <h6>Deine Lagerbestände</h6>
            <h5>{{ this.products }}/{{ this.maxProducts }}</h5>
            <p>Wie viele Produkte wollen Sie bestellen?</p>
        </div>

        <div class='phone-delivery-button-group'>
            <input v-model='amount' class='form-control border-3' maxlength='3' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' type='number' @blur='onFocus(false)' @focus='onFocus(true)' @keypress='allowOnlyNumbers($event)' />
            <button :disabled="amount === ''" class='btn' type='button' @click='order()'>
                Produkte bestellen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {allowOnlyNumbers, onFocus} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";

export default class OrderProductsPage extends Vue {
    private products = 0;
    private maxProducts = 0;
    private amount = "";

    public open(products: number, maxProducts: number): void {
        this.products = products;
        this.maxProducts = maxProducts;
    }

    public updateProducts(products: number): void {
        this.products = products;
    }

    private back(): void {
        this.amount = "";
        this.$emit("back");
    }

    private order(): void {
        alt.emit("phonedelivery:orderproducts", Number.parseInt(this.amount));
        this.back();
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style lang='scss' scoped>
.order-products-page {
    overflow: hidden;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background-color: white;
    background-position: center center;
    background-size: 15vw;
    z-index: 100;
}

.header-image {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url("../../../../../assets/images/phone/shipping-banner.jpg") center center;
    background-size: cover;
    height: 6vw;
}

.products {
    border-radius: 0.3vw;
}

.products h1 {
    margin: unset;
    font-size: 1.2vw;
}

.products h2 {
    margin: 0.25vw;
    font-size: 0.6vw;
}
</style>
