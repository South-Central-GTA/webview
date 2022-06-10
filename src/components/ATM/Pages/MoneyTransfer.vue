<template>
    <div class='money-transfer'>
        <button class='atm-close-button float-end' type='button' @click='back()'>
            <font-awesome-icon class='center' icon='caret-left' />
        </button>

        <img class='atm-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='button-group'>
            <div class='row'>
                <div class='col-12'>
                    <input ref='receiverBankDetails' class='form-control mb-3' maxlength='12' oninput='this.value = this.value.toUpperCase();' placeholder='Konto des Empfängers (SA-123456789)' type='text' @input='checkPattern()' />
                </div>
                <div class='col-12'>
                    <div class='input-group w-100 mb-3'>
                        <span class='input-group-text'>$</span>
                        <input ref='transferValueInput' class='form-control' maxlength='7' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' placeholder='Wieviel Geld überweisen?' type='number' @keypress='allowOnlyNumbers($event)' />
                    </div>
                </div>
                <div class='col-12'>
                    <input v-model='purposeOfUse' class='form-control' maxlength='64' placeholder='Überweisungsgrund' type='text' />
                </div>
            </div>

            <button :disabled='!bankDetailsValid || !isValuePositive' class='btn atm-menu-button w-100' type='button' @click='transfer()'>
                Überweisen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {allowOnlyNumbers, isNumeric} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class MoneyTransfer extends Vue {
    @Ref() private readonly transferValueInput!: HTMLInputElement;
    @Ref() private readonly receiverBankDetails!: HTMLInputElement;

    private bankDetailsValid = false;
    private isValuePositive = false;
    private purposeOfUse = "";

    public open(): void {
        this.checkValue();
    }

    private back(): void {
        this.$emit("back");
    }

    private transfer(): void {
        if (!this.isValuePositive || !this.bankDetailsValid) return;

        this.$emit("transfer", this.receiverBankDetails.value, Number.parseInt(this.transferValueInput.value),
            this.purposeOfUse);

        this.transferValueInput.value = "";
        this.receiverBankDetails.value = "";
    }

    private checkPattern(): void {
        const nameRedexp = /([A-Z]{2})-([0-9]{9})/;
        this.bankDetailsValid = nameRedexp.test(this.receiverBankDetails.value);
    }

    private checkValue(): void {
        this.isValuePositive = isNumeric(this.transferValueInput.value) && Number.parseInt(
            this.transferValueInput.value) >= 1;
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        this.checkValue();
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped>
.money-transfer {
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
