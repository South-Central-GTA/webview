<template>
    <div class='dialog-holder' v-bind:class='{ enable: isVisible, disable: !isVisible }'>
        <div ref='dialog'>
            <div :hidden='!isVisible'>
                <div class='background'></div>
                <div class='center'>
                    <div class='modal-dialog'>
                        <div class='modal-content sc-dark text-white'>
                            <div class='modal-header'>
                                <h5 class='modal-title'>{{ title }}</h5>
                                <button class='icon-button float-end p-3' type='button' @click='closeButtonClicked()'>
                                    <font-awesome-icon class='center text-white' icon='times' />
                                </button>
                            </div>
                            <div class='modal-body'>
                                <span v-html='description'></span>
                                <div :hidden='!hasBankAccountSelection' class='pt-3'>
                                    <select-bank-account v-on:setup='setBankAccount($event)' v-on:change-bank-account='setBankAccount($event)' />
                                </div>
                                <div :hidden='!hasInputField' class='pt-3'>
                                    <input v-model='inputContent' class='form-control-dark' type='text' />
                                </div>
                            </div>
                            <div v-if='type === 0' class='modal-footer'>
                                <button class='btn btn-primary w-50' type='button' @click='primaryButtonClicked()'>
                                    {{ primaryButton }}
                                </button>
                            </div>
                            <div v-if='type === 1' class='modal-footer justify-content-evenly row'>
                                <button class='btn btn-secondary col-5' type='button' @click='secondaryButtonClicked()'>
                                    {{ secondaryButton }}
                                </button>
                                <button class='btn btn-primary col-5' type='button' @click='primaryButtonClicked()'>
                                    {{ primaryButton }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import SelectBankAccount from "@/components/General/Banking/SelectBankAccount.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {DialogType} from "@/scripts/enums/dialog.type";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {DialogInterface} from "@/scripts/interfaces/dialog.interface";

@Options({
    components: {
        SelectBankAccount,
    },
})
export default class DialogHolder extends Vue {
    @Ref() private readonly dialog!: HTMLElement;

    private title = "";
    private description = "";
    private hasBankAccountSelection = false;
    private hasInputField = false;
    private primaryButton = "";
    private secondaryButton = "";
    private primaryButtonServerEvent = "";
    private secondaryButtonServerEvent = "";
    private closeButtonServerEvent = "";
    private primaryButtonClientEvent = "";
    private closeButtonClientEvent = "";
    private secondaryButtonClientEvent = "";
    private type: DialogType = DialogType.ONE_BUTTON_DIALOG;
    private isVisible = false;
    private selectedBankAccount: BankAccountInterface = {
        id: -1,
        status: -1,
        type: -1,
        amount: "",
        bankDetails: "",
        characterAccesses: [],
        groupAccesses: [],
        history: [],
    };
    private inputContent = "";
    private firedEvent = false;

    public mounted(): void {
        alt.on("dialog:create", (dialog: DialogInterface) => this.create(dialog));
        alt.on("dialog:destroy", () => this.destroyDialog());
    }

    public unmounted(): void {
        alt.off("dialog:destroy");
    }

    private create(dialog: DialogInterface): void {
        this.type = dialog.type;
        this.title = dialog.title;
        this.hasBankAccountSelection = dialog.hasBankAccountSelection;
        this.hasInputField = dialog.hasInputField;
        this.description = dialog.description;

        if (dialog.closeButtonServerEvent) {
            this.closeButtonServerEvent = dialog.closeButtonServerEvent;
        }

        if (dialog.closeButtonClientEvent) {
            this.closeButtonClientEvent = dialog.closeButtonClientEvent;
        }

        if (dialog.primaryButton) {
            this.primaryButton = dialog.primaryButton;

            if (dialog.primaryButtonServerEvent) {
                this.primaryButtonServerEvent = dialog.primaryButtonServerEvent;
            }

            if (dialog.primaryButtonClientEvent) {
                this.primaryButtonClientEvent = dialog.primaryButtonClientEvent;
            }
        }

        if (dialog.secondaryButton) {
            this.secondaryButton = dialog.secondaryButton;

            if (dialog.secondaryButtonServerEvent) {
                this.secondaryButtonServerEvent = dialog.secondaryButtonServerEvent;
            }

            if (dialog.secondaryButtonClientEvent) {
                this.secondaryButtonClientEvent = dialog.secondaryButtonClientEvent;
            }
        }

        this.isVisible = true;
        this.firedEvent = false;
        this.dialog.className = "fade-in";
    }

    private setBankAccount(bankAccount: BankAccountInterface): void {
        this.selectedBankAccount = bankAccount;
    }

    private destroyDialog(): void {
        this.dialog.className = "fade-out";
        setTimeout(() => {
            this.title = "";
            this.description = "";
            this.hasBankAccountSelection = false;
            this.hasInputField = false;
            this.primaryButton = "";
            this.secondaryButton = "";
            this.primaryButtonServerEvent = "";
            this.secondaryButtonServerEvent = "";
            this.primaryButtonClientEvent = "";
            this.secondaryButtonClientEvent = "";
            this.type = DialogType.ONE_BUTTON_DIALOG;
            this.isVisible = false;
            this.inputContent = "";
        }, 600);
    }

    private closeButtonClicked(): void {
        if (!this.firedEvent) {
            alt.emit("dialog:closebuttonclicked", this.closeButtonServerEvent, this.closeButtonClientEvent);
        }

        this.firedEvent = true;
    }

    private primaryButtonClicked(): void {
        if (!this.firedEvent) {
            alt.emit("dialog:primarybuttonclicked", this.primaryButtonServerEvent, this.primaryButtonClientEvent,
                this.selectedBankAccount.id, this.inputContent);
        }

        this.firedEvent = true;
    }

    private secondaryButtonClicked(): void {
        if (!this.firedEvent) {
            alt.emit("dialog:secondarybuttonclicked", this.secondaryButtonServerEvent, this.secondaryButtonClientEvent,
                this.selectedBankAccount.id, this.inputContent);
        }

        this.firedEvent = true;
    }
}
</script>

<style scoped>
.dialog-holder {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
}

.modal-dialog {
    z-index: 999999;
    pointer-events: all;
    overflow: hidden;
}
</style>
