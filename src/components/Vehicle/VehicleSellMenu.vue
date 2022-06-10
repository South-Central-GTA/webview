<template>
    <div :hidden='!isVisible' class='vehicle-sell-menu' v-bind:class='{ enable: isVisible, disable: !isVisible }'>
        <div class='background'></div>
        <div class='modal-dialog'>
            <div class='modal-content sc-dark text-white'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Fahrzeug verkaufen</h5>
                    <button class='icon-button text-white float-end' type='button' @click='close()'>
                        <font-awesome-icon class='center text-white' icon='times' />
                    </button>
                </div>

                <div v-if='pageId === 0' class='modal-body'>
          <span v-if='!isGroupVehicle'>Bitte fülle alle Felder aus, wenn du über Banküberweisung verkaufen
            möchtest kannst du im nächsten Menu das gewünschte Bankkonto
            auswählen.</span> <span v-if='isGroupVehicle'>Bitte fülle alle Felder aus, da es ein Gruppenfahrzeug ist, geht
            der Verkauf über Banküberweisung sofort auf das Gruppenkonto.</span>

                    <div class='row pt-3 pb-3'>
                        <div class='col-3'>
                            <input ref='transferValueInput' v-model='targetId' class='form-control-dark' maxlength='4' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' placeholder='Spieler ID' type='number' @blur='onFocus(false)' @focus='onFocus(true)' @keypress='allowOnlyNumbers($event)' />
                        </div>
                        <div class='col-9'>
                            <input ref='transferValueInput' v-model='price' class='form-control-dark' maxlength='10' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' placeholder='Preis in Dollar (Bsp. 20000)' type='number' @blur='onFocus(false)' @focus='onFocus(true)' @keypress='allowOnlyNumbers($event)' />
                        </div>
                    </div>
                    <span>Per was möchtest du das Angebot machen?</span>
                </div>

                <div v-if='pageId === 1' class='modal-body'>
          <span v-if='isGroupVehicle'>Der Preis von ${{
                  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                      }}
            geht sofort auf das Gruppenkonto.</span> <span v-if='!isGroupVehicle'>Bitte wähle dein Zielkonto aus auf welchem du die ${{
                        price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                                                                  }}
            erhalten möchtest.</span>
                    <div :hidden='isGroupVehicle'>
                        <select-bank-account class='pt-3' v-on:setup='setBankAccount($event)' v-on:change-bank-account='setBankAccount($event)' />
                    </div>
                </div>

                <div v-if='pageId === 0' class='modal-footer justify-content-evenly row'>
                    <button class='btn btn-primary col-5' type='button' @click='onBuyCash()'>
                        Bargeld
                    </button>
                    <button class='btn btn-secondary col-5' type='button' @click='openSecondPage()'>
                        Banküberweisung
                    </button>
                </div>
                <div v-if='pageId === 1' class='modal-footer justify-content-evenly row'>
                    <button class='btn btn-secondary col-5' type='button' @click='openFirstPage()'>
                        Zurück
                    </button>
                    <button class='btn btn-primary col-5' type='button' @click='onBuyBank()'>
                        Banküberweisung
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import SelectBankAccount from "@/components/General/Banking/SelectBankAccount.vue";
import {Options, Vue} from "vue-class-component";
import {allowOnlyNumbers, onFocus} from "@/scripts/helpers/helpers";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

@Options({
    components: {
        SelectBankAccount,
    },
})
export default class VehicleSellMenu extends Vue {
    private isVisible = false;
    private hasBankAccount = false;
    private isGroupVehicle = false;
    private pageId = 0;

    private targetId = "";
    private price = "";
    private selectedBankAccount: BankAccountInterface | undefined;

    public mounted(): void {
        alt.on("vehiclesellmenu:show",
            (hasBankAccount: boolean, isGroupVehicle: boolean) => this.show(hasBankAccount, isGroupVehicle));
    }

    public unmounted(): void {
        alt.off("vehiclesellmenu:show");
    }

    private show(hasBankAccount: boolean, isGroupVehicle: boolean): void {
        this.hasBankAccount = hasBankAccount;
        this.isGroupVehicle = isGroupVehicle;
        this.isVisible = true;
    }

    private openFirstPage(): void {
        this.pageId = 0;

        if (this.price === "0") {
            this.price = "";
        }
    }

    private openSecondPage(): void {
        this.pageId = 1;
        if (!this.price) {
            this.price = "0";
        }
    }

    private close(): void {
        alt.emit("vehiclesellmenu:close");
        this.isVisible = false;
        this.pageId = 0;
    }

    private setBankAccount(bankAccount: BankAccountInterface): void {
        this.selectedBankAccount = bankAccount;
    }

    private onBuyCash(): void {
        this.close();
        alt.emitServer("vehiclesellmenu:requestcash", Number.parseInt(this.targetId), Number.parseInt(this.price));
    }

    private onBuyBank(): void {
        this.close();
        alt.emitServer("vehiclesellmenu:requestbank", Number.parseInt(this.targetId), Number.parseInt(this.price),
            this.selectedBankAccount?.id);
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped>
.background {
    pointer-events: all;
}

.modal-dialog {
    margin-top: 20%;
    z-index: 999999;
    pointer-events: all;
    overflow: hidden;
}
</style>
