<template>
    <div class='phone-add-permission-bank-account'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Hinzufügen</span>
            </button>
        </div>

        <img class='phone-bank-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <p class='alert-text'>
            Gebe den Namen der Person an, welche Sie Zugriffsrechte auf Ihr Bankkonto geben wollen. </p>

        <div class='phone-bank-button-group'>
            <input v-model='characterName' class='form-control' placeholder='Max Mustermann' type='text' @blur='onFocus(false)' @focus='onFocus(true)' />
            <button :disabled="characterName === ''" class='btn' type='button' @click='addPerson()'>
                Person hinzufügen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {onFocus} from "@/scripts/helpers/helpers";

export default class PhoneAddPermissionBankAccount extends Vue {
    private characterName = "";
    private bankAccountId = 0;

    public setup(bankAccountId: number): void {
        this.bankAccountId = bankAccountId;
    }

    private addPerson(): void {
        alt.emit("phonebank:addcharacteraccess", this.bankAccountId, this.characterName);
        this.back();
    }

    private back(): void {
        this.$emit("back");
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>

<style lang='scss' scoped>
.phone-add-permission-bank-account {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.alert-text {
    font-style: italic;
    font-size: 0.8vw;
    padding: 1vw;
}
</style>
