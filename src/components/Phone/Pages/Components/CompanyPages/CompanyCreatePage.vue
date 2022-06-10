<template>
    <div class='company-create'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Zurück</span>
            </button>
            <button class='help-button icon-button' @click='showHelp()'>
                <font-awesome-icon icon='question-circle' />
            </button>
        </div>

        <img class='logo' src='@/assets/images/phone/gov-seal.png' />

        <div v-if='willBeProcessed' class='info-overlay'>
            <img class='logo-big' src='@/assets/images/phone/gov-seal.png' />
            <p style='padding-bottom: 3vw'>
                Ihre Anfrage wird bearbeitet, dies kann einen Moment dauern. Wir melden uns mit einer Benachrichtigung bei Ihnen. </p>
        </div>

        <div v-if='isHelpVisible' class='info-overlay'>
            <div class='phone-header'>
                <button class='icon-button' @click='hideHelp()'>
                    <font-awesome-icon icon='chevron-left' />
                    <span>Zurück</span>
                </button>
            </div>

            <img class='logo-big' src='@/assets/images/phone/gov-seal.png' />
            <p>
                Die Erstellung eines Unternehmens belastet das oben genannte Bankkonto mit $20.500, davon werden Bürogänge, Anmeldungen und Verwaltungskosten gedeckt. </p>
        </div>

        <div class='phone-gov-button-group'>
            <input ref='companyName' class='form-control' maxlength='32' placeholder='Unternehmensname' type='text' @blur='onFocus(false)' @focus='onFocus(true)' @input='checkValidation()' />
            <select-bank-account ref='selectBank' class='pt-2' v-on:setup='setBankAccount($event)' v-on:change-bank-account='setBankAccount($event)' />

            <p class='description'>
                Ausgewählte Immobilie wird der Unternehmenshauptsitz! </p>

            <select-house ref='selectHouse' v-on:setup='setHouse($event)' v-on:change-house='setHouse($event)' />

            <button :disabled='!valid' class='btn' type='button' @click='createCompany()'>
                Unternehmen eröffnen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import SelectBankAccount from "@/components/General/Banking/SelectBankAccount.vue";
import SelectHouse from "@/components/General/House/SelectHouse.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {onFocus} from "@/scripts/helpers/helpers";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

@Options({
    components: {
        SelectBankAccount, SelectHouse,
    },
})
export default class CompanyCreatePage extends Vue {
    @Ref() private readonly companyName!: HTMLInputElement;
    @Ref() private readonly selectBank!: SelectBankAccount;
    @Ref() private readonly selectHouse!: SelectHouse;

    private selectedBankAccount!: BankAccountInterface;
    private selectedHouse!: HouseInterface;
    private willBeProcessed = false;
    private isHelpVisible = false;
    private valid = false;

    get isCreatingCompany() {
        return this.willBeProcessed;
    }

    private back(): void {
        this.$emit("back");
    }

    private showHelp(): void {
        this.isHelpVisible = true;
    }

    private hideHelp(): void {
        this.isHelpVisible = false;
    }

    private setBankAccount(bankAccount: BankAccountInterface): void {
        this.selectedBankAccount = bankAccount;
    }

    private setHouse(house: HouseInterface): void {
        this.selectedHouse = house;
    }

    private createCompany(): void {
        if (!/^[a-zA-ZÀ-ž&., -]*$/.test(this.companyName.value)) {
            return;
        }

        alt.emit("phonecompany:create", this.companyName.value, this.selectedBankAccount?.id, this.selectedHouse?.id);

        this.willBeProcessed = true;
        setTimeout(() => {
            this.willBeProcessed = false;
            this.back();
        }, 3500);

        this.companyName.value = "";
    }

    private checkValidation(): void {
        this.valid = this.companyName.value != "" && /^[a-zA-ZÀ-ž&., -]*$/.test(
            this.companyName.value) && this.selectBank.hasBank && this.selectHouse.hasHouse;
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>

<style lang='scss' scoped>
.company-create {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background: linear-gradient(
            rgba(255, 234, 176, 0.5),
            rgba(255, 234, 176, 0.5)
    ), url("../../../../../assets/images/patterns/double-bubble.png");

    background-position: center center;
    background-size: 25vw;
    z-index: 100;
}

.form-control {
    margin-top: 3.5vw;
    margin-bottom: 0.2vw;
}

.form-control::placeholder {
    font-size: 0.8vw;
}

.help-button {
    float: right;
    padding-right: 0.5vw;
}

.logo {
    position: absolute;
    top: 28%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 15%;
}

.logo-big {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -25%);
    height: 25%;
}

.description {
    padding-top: 0.2vw;
    font-size: 0.6vw;
}

.info-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background: linear-gradient(
            rgba(255, 234, 176, 0.5),
            rgba(255, 234, 176, 0.5)
    ),
    url("../../../../../assets/images/patterns/double-bubble.png");

    background-position: center center;
    background-size: 25vw;
    z-index: 500;
}

.info-overlay p {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, -0%);
    width: 80%;
    font-size: 0.7vw;
    text-align: justify;
}
</style>
