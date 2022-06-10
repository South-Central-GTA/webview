<template>
    <div class='phone-delete-bank-account'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Konto schließen</span>
            </button>
        </div>

        <img class='phone-bank-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <p class='alert-text'>
            Sind Sie sicher, dass Sie ihr Bankkonto unwiederruflich löschen wollen? </p>

        <div class='phone-bank-button-group'>
            <button class='btn' type='button' @click='deleteBankAccount()'>
                Ja, Konto löschen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";

export default class PhoneActiveBankAccount extends Vue {
    private back(): void {
        this.$emit("back");
    }

    private deleteBankAccount(): void {
        this.$emit("deletebankaccount");
    }
}
</script>

<style lang='scss' scoped>
.phone-delete-bank-account {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.alert-text {
    margin-top: 1.5vw;
    color: black;
    font-style: italic;
    font-size: 0.7vw;
    text-align: center;
}
</style>
