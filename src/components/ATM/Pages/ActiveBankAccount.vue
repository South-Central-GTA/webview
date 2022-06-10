<template>
    <div class='active-bank-accounts'>
        <button class='atm-close-button float-end' type='button' @click='back()'>
            <font-awesome-icon class='center' icon='caret-left' />
        </button>

        <withdraw-window ref='withdrawWindow' :hidden='currentTab !== 1' @withdraw='withdraw' v-on:back='resetTab()' />

        <deposit-window ref='depositWindow' :hidden='currentTab !== 2' @deposit='deposit' v-on:back='resetTab()' />

        <money-transfer ref='transferWindow' :hidden='currentTab !== 3' @transfer='transfer' v-on:back='resetTab()' />

        <bank-history ref='bankHistory' :hidden='currentTab !== 4' v-on:back='resetTab()' />

        <delete-bank-account :hidden='currentTab !== 5' v-on:back='resetTab()' v-on:deletebankaccount='deleteBankAccount($event)' />

        <img class='atm-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='account-stats'>
            <h2>{{ details }}</h2>
            <h1>${{ amount }}</h1>
        </div>

        <div class='row bottom-center py-5'>
            <div class='col-6'>
                <button :disabled='!canWithdraw' class='btn atm-menu-button' type='button' @click='openTab(1)'>
                    Abheben
                </button>
            </div>
            <div class='col-6'>
                <button :disabled='!canDeposit' class='btn atm-menu-button' type='button' @click='openTab(2)'>
                    Einzahlen
                </button>
            </div>
            <div class='col-6'>
                <button :disabled='!canTransfer' class='btn atm-menu-button' type='button' @click='openTab(3)'>
                    Überweisungen
                </button>
            </div>
            <div class='col-6'>
                <button :disabled='!canSeeHistory' class='btn atm-menu-button' type='button' @click='openTab(4)'>
                    Umsätze
                </button>
            </div>
            <div class='col-6'>
                <button :disabled='!canManage' class='btn atm-menu-button' type='button' @click='openTab(5)'>
                    Konto schließen
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import DepositWindow from "./DepositWindow.vue";
import WithdrawWindow from "./WithdrawWindow.vue";
import MoneyTransfer from "./MoneyTransfer.vue";
import DeleteBankAccount from "./DeleteBankAccount.vue";
import character from "@/scripts/services/character.service";
import groupService from "@/scripts/services/group.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import BankHistory from "@/components/ATM/Pages/BankHistory.vue";
import {BankHistoryEntryInterface} from "@/scripts/interfaces/bank/bank-history-entry.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {BankingPermission} from "@/scripts/enums/banking.permission";
import {GroupPermission} from "@/scripts/enums/group.permission";

@Options({
    components: {
        BankHistory, DepositWindow, WithdrawWindow, MoneyTransfer, DeleteBankAccount,
    },
})
export default class ActiveBankAccount extends Vue {
    @Ref() private readonly withdrawWindow!: WithdrawWindow;
    @Ref() private readonly depositWindow!: DepositWindow;
    @Ref() private readonly transferWindow!: MoneyTransfer;
    @Ref() private readonly bankHistory!: BankHistory;

    private id = 0;
    private details = "";
    private amount = "";
    private currentTab = 0;

    private canDeposit = false;
    private canWithdraw = false;
    private canTransfer = false;
    private canSeeHistory = false;
    private canManage = false;
    private history: BankHistoryEntryInterface[] = [];

    public setup(bankAccount: BankAccountInterface): void {
        this.id = bankAccount.id;
        this.details = bankAccount.bankDetails;
        this.amount = bankAccount.amount;
        this.history = bankAccount.history;

        this.canDeposit = false;
        this.canWithdraw = false;
        this.canTransfer = false;
        this.canSeeHistory = false;
        this.canManage = false;

        const characterAccess = bankAccount.characterAccesses.find(
            (ca) => ca.characterId == character.getInstance().getCharacterId);
        if (characterAccess !== undefined) {
            this.canDeposit = (characterAccess.permission & BankingPermission.DEPOSIT) === BankingPermission.DEPOSIT || characterAccess.owner;
            this.canWithdraw = (characterAccess.permission & BankingPermission.WITHDRAW) === BankingPermission.WITHDRAW || characterAccess.owner;
            this.canTransfer = (characterAccess.permission & BankingPermission.TRANSFER) === BankingPermission.TRANSFER || characterAccess.owner;
            this.canSeeHistory = (characterAccess.permission & BankingPermission.SEE_HISTORY) === BankingPermission.SEE_HISTORY || characterAccess.owner;
            this.canManage = (characterAccess.permission & BankingPermission.MANAGEMENT) === BankingPermission.MANAGEMENT || characterAccess.owner;
        }

        if (bankAccount.type === 1) {
            const group = groupService
                .getInstance()
                .AllGroups?.find((g) => bankAccount.groupAccesses.some((ga) => ga.groupId === g.id));

            if (group !== undefined) {
                const member = group.members.find((m) => m.characterId === character.getInstance().getCharacterId);
                if (member !== undefined) {
                    if (member.owner) {
                        this.canDeposit = true;
                        this.canWithdraw = true;
                        this.canTransfer = true;
                        this.canSeeHistory = true;
                        this.canManage = true;
                    } else {
                        const rank = group.ranks.find((r) => r.level === member.level);
                        if (rank !== undefined) {
                            this.canDeposit = (rank.groupPermission & GroupPermission.BANKING_DEPOSIT) === GroupPermission.BANKING_DEPOSIT;
                            this.canWithdraw = (rank.groupPermission & GroupPermission.BANKING_WITHDRAW) === GroupPermission.BANKING_WITHDRAW;
                            this.canTransfer = (rank.groupPermission & GroupPermission.BANKING_TRANSFER) === GroupPermission.BANKING_TRANSFER;
                            this.canSeeHistory = (rank.groupPermission & GroupPermission.BANKING_SEE_HISTORY) === GroupPermission.BANKING_SEE_HISTORY;
                        }
                    }
                }
            }
        }
    }

    public resetTab(): void {
        this.openTab(0);
    }

    private back(): void {
        this.$emit("back");
    }

    private openTab(id: number): void {
        this.currentTab = id;

        if (id === 1) {
            this.withdrawWindow.open();
        } else if (id === 2) {
            this.depositWindow.open();
        } else if (id === 3) {
            this.transferWindow.open();
        } else if (id === 4) {
            this.bankHistory.setup(this.history, false);
        }
    }

    private deposit(amount: number): void {
        this.resetTab();
        alt.emitServer("bank:deposit", this.id, amount);
    }

    private withdraw(amount: number): void {
        this.resetTab();
        alt.emitServer("bank:withdraw", this.id, amount);
    }

    private transfer(bankDetails: string, amount: number, useOfPurpose: string): void {
        this.resetTab();
        alt.emitServer("bank:transfer", this.id, bankDetails, amount, useOfPurpose);
    }

    private deleteBankAccount(): void {
        this.$emit("close");
        this.resetTab();
        alt.emit("phonebank:deletebankaccount", this.id);
    }
}
</script>

<style lang='scss' scoped>
.active-bank-accounts {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    background-image: url("../../../assets/images/patterns/checks.png");
    background-position: center center;
    background-size: 20vw;
}

.account-stats {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
}

.account-stats h1 {
    margin: unset;
    width: 100%;
    font-size: 1.5vw;
}

.account-stats h2 {
    margin: unset;
    width: 100%;
    font-size: 0.8vw;
}
</style>
