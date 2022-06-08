<template>
    <div class='withdraw-window'>
        <button type='button' class='atm-close-button float-end' @click='back()'>
            <font-awesome-icon class='center' icon='caret-left' />
        </button>

        <img class='atm-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='button-group'>
            <div class='input-group w-100 mb-3'>
                <span class='input-group-text'>$</span>
                <input ref='withdrawInput' class='form-control' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' type='number' placeholder='Wieviel möchtest du abheben?' maxlength='7' @keydown.enter='withdraw()' @input='checkValue()' @keypress='allowOnlyNumbers($event)' />
            </div>

            <button type='button' class='btn atm-menu-button w-100' @click='withdraw()' :disabled='!isValuePositive'>
                Abheben
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {allowOnlyNumbers, isNumeric} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class WithdrawWindow extends Vue {
    @Ref() private readonly withdrawInput!: HTMLInputElement;

    private isValuePositive = false;

    public open(): void {
        this.checkValue();
    }

    private back(): void {
        this.$emit("back");
    }

    private withdraw(): void {
        if (!this.isValuePositive) return;

        this.$emit("withdraw", Number.parseInt(this.withdrawInput.value));
        this.withdrawInput.value = "";
    }

    private checkValue(): void {
        this.isValuePositive = isNumeric(this.withdrawInput.value) && Number.parseInt(this.withdrawInput.value) >= 1;
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped lang='scss'>
.withdraw-window {
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

.rows button:hover {
    background-color: rgb(190, 190, 190);
}
</style>
