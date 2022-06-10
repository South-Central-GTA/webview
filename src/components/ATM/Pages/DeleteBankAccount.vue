<template>
    <div class='delete-bank-account'>
        <button class='atm-close-button float-end' type='button' @click='back()'>
            <font-awesome-icon class='center' icon='caret-left' />
        </button>

        <img class='atm-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='bottom-center py-5'>
            <p>
                Sind Sie sicher, dass Sie ihr Bankkonto unwiederruflich löschen wollen? </p>
            <button class='btn w-100 atm-menu-button' type='button' @click='deleteBankAccount()'>
                Ja, Konto unwiederruflich löschen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";

export default class DeleteBankAccount extends Vue {
    private back(): void {
        this.$emit("back");
    }

    private deleteBankAccount(): void {
        this.$emit("deletebankaccount");
    }
}
</script>

<style scoped>
.delete-bank-account {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    background-image: url("../../../assets/images/patterns/checks.png");
    background-position: center center;
    background-size: 20vw;
}
</style>
