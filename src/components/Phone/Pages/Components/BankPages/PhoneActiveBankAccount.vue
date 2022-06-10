<template>
    <div class='phone-active-bank-account'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Konto verwalten</span>
            </button>
        </div>

        <phone-bank-money-transfer :hidden='currentTab !== 1' @back='resetTab()' @phonetransfer='phonetransfer' />

        <phone-permission-bank-account ref='phonePermissionBankAccount' :hidden='currentTab !== 2' @back='resetTab()' />

        <bank-history ref='bankHistory' :hidden='currentTab !== 3' @back='resetTab()' />

        <phone-delete-bank-account :hidden='currentTab !== 4' @back='resetTab()' @deletebankaccount='deleteBankAccount' />

        <img class='phone-bank-logo' src='@/assets/images/phone/maze-bank-logo.png' />

        <div class='account-stats'>
            <h2>{{ details }}</h2>
            <h1>${{ amount }}</h1>
        </div>

        <div class='phone-bank-button-group'>
            <button :disabled='!canTransfer' class='btn' type='button' @click='openTab(1)'>
                Überweisungen
            </button>
            <button :disabled='!canManage' class='btn' type='button' @click='openTab(2)'>
                Berechtigungen
            </button>
            <button :disabled='!canSeeHistory' class='btn' type='button' @click='openTab(3)'>
                Umsätze
            </button>
            <button :disabled='!canManage' class='btn' type='button' @click='openTab(4)'>
                Konto löschen
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import character from "@/scripts/services/character.service";
import groupService from "@/scripts/services/group.service";
import PhoneBankMoneyTransfer from "./PhoneBankMoneyTransfer.vue";
import PhoneDeleteBankAccount from "./PhoneDeleteBankAccount.vue";
import PhonePermissionBankAccount from "./PhonePermissionBankAccount.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import BankHistory from "@/components/ATM/Pages/BankHistory.vue";
import {BankHistoryEntryInterface} from "@/scripts/interfaces/bank/bank-history-entry.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {BankingPermission} from "@/scripts/enums/banking.permission";
import {GroupPermission} from "@/scripts/enums/group.permission";

@Options({
    components: {
        BankHistory, PhoneBankMoneyTransfer, PhoneDeleteBankAccount, PhonePermissionBankAccount,
    },
})
export default class PhoneActiveBankAccount extends Vue {
    @Ref() private readonly phonePermissionBankAccount!: PhonePermissionBankAccount;
    @Ref() private readonly bankHistory!: BankHistory;

    private id = 0;
    private details = "";
    private amount = "";
    private history: BankHistoryEntryInterface[] = [];
    private currentTab = 0;

    private canSeeHistory = false;
    private canManage = false;
    private canTransfer = false;

    public setup(bankAccount: BankAccountInterface): void {
        this.id = bankAccount.id;
        this.details = bankAccount.bankDetails;
        this.amount = bankAccount.amount;
        this.history = bankAccount.history;

        this.canTransfer = false;
        this.canManage = false;

        const characterAccess = bankAccount.characterAccesses.find(
            (ca) => ca.characterId == character.getInstance().getCharacterId);
        if (characterAccess !== undefined) {
            this.canSeeHistory = (characterAccess.permission & BankingPermission.SEE_HISTORY) === BankingPermission.SEE_HISTORY || characterAccess.owner;
            this.canTransfer = (characterAccess.permission & BankingPermission.TRANSFER) === BankingPermission.TRANSFER || characterAccess.owner;
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
                        this.canSeeHistory = true;
                        this.canTransfer = true;
                        this.canManage = true;
                    } else {
                        const rank = group.ranks.find((r) => r.level === member.level);
                        if (rank !== undefined) {
                            this.canSeeHistory = (rank.groupPermission & GroupPermission.BANKING_SEE_HISTORY) === GroupPermission.BANKING_SEE_HISTORY;
                            this.canTransfer = (rank.groupPermission & GroupPermission.BANKING_TRANSFER) === GroupPermission.BANKING_TRANSFER;
                        }
                    }
                }
            }
        }

        if (this.currentTab === 3 && !this.canSeeHistory) {
            this.openTab(0);
        }

        this.phonePermissionBankAccount.setup(this.id, bankAccount.characterAccesses);
    }

    public resetTab(): void {
        this.openTab(0);
    }

    private openTab(id: number): void {
        this.currentTab = id;

        if (id === 3) {
            this.bankHistory.setup(this.history, true);
        }
    }

    private back(): void {
        this.$emit("back");
    }

    private phonetransfer(bankDetails: string, amount: number): void {
        this.$emit("back");
        alt.emitServer("bank:transfer", this.id, bankDetails, amount);
    }

    private deleteBankAccount(): void {
        this.$emit("close");
        this.resetTab();
        alt.emit("phonebank:deletebankaccount", this.id);
    }
}
</script>

<style lang='scss' scoped>
.phone-active-bank-account {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.account-stats {
    position: absolute;
    text-align: center;
    top: 45%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
}

.account-stats h1 {
    margin: unset;
    width: 100%;
    font-size: 1.1vw;
}

.account-stats h2 {
    margin: unset;
    width: 100%;
    font-size: 0.8vw;
}
</style>
