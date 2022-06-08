<template>
    <div class="phone-bank-money-transfer">
        <div class="phone-header">
            <button class="icon-button" @click="back()">
                <font-awesome-icon icon="chevron-left"/>
                <span>Überweisungen</span>
            </button>
        </div>

        <img
            class="phone-bank-logo"
            src="@/assets/images/phone/maze-bank-logo.png"
        />

        <div class="phone-bank-button-group">
            <input
                ref="receiverBankDetails"
                class="form-control"
                oninput="this.value = this.value.toUpperCase();"
                type="text"
                @focus="onFocus(true)"
                @blur="onFocus(false)"
                placeholder="Bankkonto des Empfängers"
                maxlength="12"
            />
            <input
                ref="transferValueInput"
                class="form-control"
                oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                type="number"
                @keypress="allowOnlyNumbers($event)"
                @focus="onFocus(true)"
                @blur="onFocus(false)"
                placeholder="Überweisungsmenge in $"
                maxlength="9"
            />
            <button type="button" class="btn" @click="phoneMoneyTransfer()">
                Überweisen
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import {allowOnlyNumbers, isNumeric, onFocus} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class PhoneActiveBankAccount extends Vue {
    @Ref() private readonly transferValueInput!: HTMLInputElement;
    @Ref() private readonly receiverBankDetails!: HTMLInputElement;

    private back(): void {
        this.$emit("back");
    }

    private phoneMoneyTransfer(): void {
        if (
            !isNumeric(this.transferValueInput.value) ||
            Number.parseInt(this.transferValueInput.value) < 1
        )
            return;

        const nameRedexp = /([A-Z]{2})-([0-9]{9})/;
        if (!nameRedexp.test(this.receiverBankDetails.value)) return;

        this.$emit(
            "phonetransfer",
            this.receiverBankDetails.value,
            Number.parseInt(this.transferValueInput.value)
        );
        this.transferValueInput.value = "";
        this.receiverBankDetails.value = "";
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped lang="scss">
.phone-bank-money-transfer {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.form-control {
    margin: 1vw 0vw 2vw;

    &::placeholder {
        font-size: 0.8vw;
    }
}
</style>
