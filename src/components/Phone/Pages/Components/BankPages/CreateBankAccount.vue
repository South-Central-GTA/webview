<template>
    <div class='create-bank-account'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Konto eröffnen</span>
            </button>
        </div>

        <img class='phone-bank-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div v-if='willBeProcessed' class='processed'>
            <img class='phone-bank-logo mt-5' src='@/assets/images/phone/maze-bank-logo.png' />
            <p>
                Ihre Anfrage wird bearbeitet, dies kann einen Moment dauern. Wir melden uns mit einer Benachrichtigung bei Ihnen. </p>
        </div>

        <div :hidden='!isFirstAccount || willBeProcessed'>
            <div class='phone-bank-button-group'>
                <p class='pb-4'>
                    Das erste Konto ist bei der Maze Bank komplett kostenfrei. </p>
                <button class='btn' type='button' @click='createAccountFree()'>
                    Konto eröffnen
                </button>
                <p class='subtitle'>
                    Mit dem Erstellen eines Bankkontos akzeptieren Sie unsere Nutzungsbedingungen. </p>
            </div>
        </div>
        <div :hidden='isFirstAccount || willBeProcessed'>
            <div class='phone-bank-button-group'>
                <p class='pb-4'>Ein Bankkonto kostet Sie einmalig $500.</p>
                <select-bank-account class='select-bank' v-on:setup='setBankAccount($event)' v-on:change-bank-account='setBankAccount($event)' />
                <button class='btn' type='button' @click='buyNewAccount()'>
                    Konto eröffnen
                </button>
                <p class='subtitle'>
                    Mit dem Erstellen eines Bankkontos akzeptieren Sie unsere Nutzungsbedingungen. </p>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import SelectBankAccount from "@/components/General/Banking/SelectBankAccount.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

@Options({
    components: {
        SelectBankAccount,
    },
})
export default class CreateBankAccount extends Vue {
    @Ref() private readonly selectBank!: SelectBankAccount;
    private isFirstAccount = true;
    private willBeProcessed = false;
    private selectedBankAccount!: BankAccountInterface;

    get isCreatingAccount() {
        return this.willBeProcessed;
    }

    public setup(firstAccount: boolean): void {
        this.isFirstAccount = firstAccount;
    }

    private back(): void {
        this.$emit("back");
    }

    private createAccountFree(): void {
        this.willBeProcessed = true;

        alt.emit("phonebank:createaccount", null);

        setTimeout(() => {
            this.willBeProcessed = false;
            this.back();
        }, 3500);
    }

    private setBankAccount(bankAccount: BankAccountInterface): void {
        this.selectedBankAccount = bankAccount;
    }

    private buyNewAccount(): void {
        if (this.selectedBankAccount === undefined) return;

        this.willBeProcessed = true;

        alt.emit("phonebank:createaccount", this.selectedBankAccount.id);

        setTimeout(() => {
            this.willBeProcessed = false;
            this.back();
        }, 3500);
    }
}
</script>

<style lang='scss' scoped>
.create-bank-account {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.subtitle {
    padding-top: 0.5vw;
    font-size: 0.4vw;
}

.processed {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);

    background-color: rgb(231, 231, 231);
    width: 100%;
    height: 100%;
    z-index: 110;
}

.processed p {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%, -5%);

    background-color: rgb(231, 231, 231);
    width: 90%;
}
</style>
