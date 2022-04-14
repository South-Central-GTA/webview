<template>
    <div class="edit-phone-contact">
        <div class="center">
            <h5>Kontakt bearbeiten</h5>
            <input ref="nameInput" type="text" class="form-control" @focus="onFocus(true)"
                   @blur="onFocus(false)" placeholder="Max Mustermann" maxlength="128"
                   v-bind:class="{ 'is-invalid': nameValidation !== 'OKAY', 'is-valid': nameValidation === 'OKAY' }">
            <div v-if="nameValidation === 'EMPTY'" class="invalid-feedback">
                Bitte gebe einen Namen an.
            </div>
            <div v-if="nameValidation === 'TO_LONG'" class="invalid-feedback">
                Der Name ist zu lang.
            </div>
            
            <input ref="numberInput" class="form-control"
                   oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                   type="number"
                   @keypress="allowOnlyNumbers($event)" @focus="onFocus(true)" @blur="onFocus(false)"
                   placeholder="55512345678" maxlength="11"
                   v-bind:class="{ 'is-invalid': numberValidation !== 'OKAY', 'is-valid': numberValidation === 'OKAY' }">
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
            
            <div class="edit-button-box">
                <button type="button" class="btn btn-secondary" @click="updateContact()">Kontakt bearbeiten</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from '@/scripts/services/alt.service';
import {PhoneContactInterface} from '@/scripts/interfaces/phone/phone-contact.interface';
import {allowOnlyNumbers, isNumeric, onFocus} from '@/scripts/helpers/helpers';
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class EditPhoneContact extends Vue {
    @Ref() private readonly numberInput!: HTMLInputElement;
    @Ref() private readonly nameInput!: HTMLInputElement;

    private nameValidation: string = "OKAY";
    private numberValidation: string = "OKAY";
    
    private contact!: PhoneContactInterface;

    public setup(contact: PhoneContactInterface): void {
        this.contact = contact;

        this.nameInput.value = this.contact.name;
        this.numberInput.value = this.contact.phoneNumber;
    }

    private updateContact(): void {
        if (this.numberInput.value.length === 0) {
            this.numberValidation = "EMPTY"
            return;
        }

        if (this.nameInput.value.length === 0) {
            this.nameValidation = "EMPTY"
            return;
        }

        if (!isNumeric(this.numberInput.value)) {
            this.numberValidation = "NO_NUMBERS"
            return;
        }

        if (this.numberInput.value.length <= 3) {
            this.numberValidation = "TO_SHORT"
            return;
        }

        if (this.numberInput.value.length > 12) {
            this.numberValidation = "TO_LONG"
            return;
        }

        if (this.nameInput.value.length > 128) {
            this.nameValidation = "TO_LONG"
            return;
        }

        this.contact.name = this.nameInput.value;
        this.contact.phoneNumber = this.numberInput.value;

        this.$emit("update-contact", this.contact);
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
.edit-phone-contact {
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

.edit-button-box {
    padding-top: 0.4vw;
    text-align: center;
}

.edit-button-box button {
    padding: 0.4vw;
    width: 10vw;
}
</style>
