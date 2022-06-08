<template>
    <div class="add-phone-contact">
        <div class="center">
            <h5>Neuen Kontakt hinzufügen</h5>
            <input
                ref="nameInput"
                type="text"
                class="form-control"
                @focus="onFocus(true)"
                @blur="onFocus(false)"
                placeholder="Max Mustermann"
                maxlength="32"
                v-bind:class="{
          'is-invalid': nameValidation !== 'OKAY',
          'is-valid': nameValidation === 'OKAY',
        }"
            />
            <div v-if="nameValidation === 'EMPTY'" class="invalid-feedback">
                Bitte gebe einen Namen an.
            </div>
            <div v-if="nameValidation === 'TO_LONG'" class="invalid-feedback">
                Der Name ist zu lang.
            </div>

            <input
                ref="numberInput"
                class="form-control"
                @keypress="allowOnlyNumbers($event)"
                @focus="onFocus(true)"
                oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                type="number"
                @blur="onFocus(false)"
                placeholder="55512345678"
                maxlength="11"
                v-bind:class="{
          'is-invalid': numberValidation !== 'OKAY',
          'is-valid': numberValidation === 'OKAY',
        }"
            />
            <div v-if="numberValidation === 'EMPTY'" class="invalid-feedback">
                Bitte gebe eine Nummer an.
            </div>
            <div v-if="numberValidation === 'NO_NUMBERS'" class="invalid-feedback">
                Du kannst nur Nummern angeben.
            </div>
            <div v-if="numberValidation === 'TO_LONG'" class="invalid-feedback">
                Die Nummer ist zu lang.
            </div>
            <div v-if="numberValidation === 'TO_LONG'" class="invalid-feedback">
                Die Nummer ist zu lang.
            </div>

            <div class="add-button-box">
                <button type="button" class="btn btn-secondary" @click="addContact()">
                    Kontakt erstellen
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    UID,
    isNumeric,
    allowOnlyNumbers,
    onFocus,
} from "@/scripts/helpers/helpers";
import {Ref} from "vue-property-decorator";
import {Vue} from "vue-class-component";
import {PhoneContactInterface} from "@/scripts/interfaces/phone/phone-contact.interface";

export default class AddPhoneContact extends Vue {
    @Ref() private readonly numberInput!: HTMLInputElement;
    @Ref() private readonly nameInput!: HTMLInputElement;

    private nameValidation: string = "OKAY";
    private numberValidation: string = "OKAY";

    public setup(number: number): void {
        this.reset();
        this.numberInput.value = number.toString();
    }

    private reset(): void {
        this.nameInput.value = "";
        this.numberInput.value = "";
    }

    private addContact(): void {
        if (this.numberInput.value.length === 0) {
            this.numberValidation = "EMPTY";
            return;
        }

        if (this.nameInput.value.length === 0) {
            this.nameValidation = "EMPTY";
            return;
        }

        if (!isNumeric(this.numberInput.value)) {
            this.numberValidation = "NO_NUMBERS";
            return;
        }

        if (this.numberInput.value.length <= 3) {
            this.numberValidation = "TO_SHORT";
            return;
        }

        if (this.numberInput.value.length > 12) {
            this.numberValidation = "TO_LONG";
            return;
        }

        if (this.nameInput.value.length > 128) {
            this.nameValidation = "TO_LONG";
            return;
        }

        const newContact: PhoneContactInterface = {
            id: UID(),
            name: this.nameInput.value,
            phoneNumber: this.numberInput.value,
        };

        this.$emit("add-contact", newContact);
        this.reset();
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
.add-phone-contact {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(179, 179, 179);
    z-index: 100;
}

.form-control {
    margin: 0.5vw 0vw;
}

.add-button-box {
    padding-top: 0.4vw;
    text-align: center;
}

.add-button-box button {
    padding: 0.4vw;
    width: 10vw;
}
</style>
