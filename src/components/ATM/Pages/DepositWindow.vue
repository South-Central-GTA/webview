<template>
    <div class='deposit-window'>
        <button class='atm-close-button float-end' type='button' @click='back()'>
            <font-awesome-icon class='center' icon='caret-left' />
        </button>

        <img class='atm-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='button-group'>
            <div class='input-group w-100 mb-3'>
                <span class='input-group-text'>$</span>
                <input ref='depositInput' class='form-control' maxlength='7' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' placeholder='Wieviel möchtest du einzahlen?' type='number' @input='checkValue' @keypress='allowOnlyNumbers($event)' @keydown.enter='deposit' />
            </div>

            <button :disabled='!isValuePositive' class='btn atm-menu-button w-100' type='button' @click='deposit()'>
                Einzahlen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {allowOnlyNumbers, isNumeric} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class DepositWindow extends Vue {
    @Ref() private readonly depositInput!: HTMLInputElement;

    private isValuePositive = false;

    public open(): void {
        this.checkValue();
    }

    private back(): void {
        this.$emit("back");
    }

    private deposit(): void {
        if (!this.isValuePositive) return;

        this.$emit("deposit", Number.parseInt(this.depositInput.value));
        this.depositInput.value = "";
    }

    private checkValue(): void {
        this.isValuePositive = isNumeric(this.depositInput.value) && Number.parseInt(this.depositInput.value) >= 1;
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped>
.deposit-window {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    background-image: url("../../../assets/images/patterns/checks.png");
    background-position: center center;
    background-size: 20vw;
}

.button-group {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -35%);
    height: 20%;
    width: 40%;
}

.rows button {
    width: 2.2vw;
    height: 2.2vw;
    border-radius: 100%;
    background-color: rgb(209, 209, 209);
    color: black;
    font-size: 0.9vw;
    margin: 0.2vw;
}

.rows button:hover {
    background-color: rgb(190, 190, 190);
}
</style>
