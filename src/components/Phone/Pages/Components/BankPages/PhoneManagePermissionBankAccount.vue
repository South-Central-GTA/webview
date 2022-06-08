<template>
    <div class="phone-manage-permission-bank-account">
        <div class="phone-header">
            <button class="icon-button" @click="back()">
                <font-awesome-icon icon="chevron-left"/>
                <span>Bearbeiten</span>
            </button>
        </div>

        <h5 class="text-center">{{ characterName }}</h5>

        <div class="row permission-block">
            <div>
                <label class="form-label">Geld einzahlen:</label>
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn"
                        @click="addPermission(depositPermission)"
                        v-bind:class="{
              'btn-success': canDeposit,
              'btn-outline-success': !canDeposit,
            }"
                    >
                        Ja
                    </button>
                    <button
                        type="button"
                        class="btn"
                        @click="removePermission(depositPermission)"
                        v-bind:class="{
              'btn-danger': !canDeposit,
              'btn-outline-danger': canDeposit,
            }"
                    >
                        Nein
                    </button>
                </div>
            </div>
            <div>
                <label class="form-label">Geld abheben:</label>
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn"
                        @click="addPermission(withdrawPermission)"
                        v-bind:class="{
              'btn-success': canWithdraw,
              'btn-outline-success': !canWithdraw,
            }"
                    >
                        Ja
                    </button>
                    <button
                        type="button"
                        class="btn"
                        @click="removePermission(withdrawPermission)"
                        v-bind:class="{
              'btn-danger': !canWithdraw,
              'btn-outline-danger': canWithdraw,
            }"
                    >
                        Nein
                    </button>
                </div>
            </div>
            <div>
                <label class="form-label">Geld überweisen:</label>
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn"
                        @click="addPermission(transferPermission)"
                        v-bind:class="{
              'btn-success': canTransfer,
              'btn-outline-success': !canTransfer,
            }"
                    >
                        Ja
                    </button>
                    <button
                        type="button"
                        class="btn"
                        @click="removePermission(transferPermission)"
                        v-bind:class="{
              'btn-danger': !canTransfer,
              'btn-outline-danger': canTransfer,
            }"
                    >
                        Nein
                    </button>
                </div>
            </div>
            <div>
                <label class="form-label">Umsätze einsehen:</label>
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn"
                        @click="addPermission(seeTransactionPermission)"
                        v-bind:class="{
              'btn-success': canSeeTransaction,
              'btn-outline-success': !canSeeTransaction,
            }"
                    >
                        Ja
                    </button>
                    <button
                        type="button"
                        class="btn"
                        @click="removePermission(seeTransactionPermission)"
                        v-bind:class="{
              'btn-danger': !canSeeTransaction,
              'btn-outline-danger': canSeeTransaction,
            }"
                    >
                        Nein
                    </button>
                </div>
            </div>
            <div>
                <label class="form-label">Konto verwalten:</label>
                <div class="btn-group">
                    <button
                        type="button"
                        class="btn"
                        @click="addPermission(managePermission)"
                        v-bind:class="{
              'btn-success': canManage,
              'btn-outline-success': !canManage,
            }"
                    >
                        Ja
                    </button>
                    <button
                        type="button"
                        class="btn"
                        @click="removePermission(managePermission)"
                        v-bind:class="{
              'btn-danger': !canManage,
              'btn-outline-danger': canManage,
            }"
                    >
                        Nein
                    </button>
                </div>
            </div>
            <div class="text-center">
                <button type="button" class="btn btn-dark mb-4" @click="removeAccess()">
                    Zugriff entfernen
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from "@/scripts/services/alt.service";
import banking from "@/scripts/services/banking.service";
import {Vue} from "vue-class-component";
import {BankingPermission} from "@/scripts/enums/banking.permission";
import {BankAccountCharacterAccessInterface} from "@/scripts/interfaces/bank/bank-account-character-access.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";

export default class PhoneManagePermissionBankAccount extends Vue {
    private depositPermission: BankingPermission = BankingPermission.DEPOSIT;
    private withdrawPermission: BankingPermission = BankingPermission.WITHDRAW;
    private transferPermission: BankingPermission = BankingPermission.TRANSFER;
    private seeTransactionPermission: BankingPermission =
        BankingPermission.SEE_HISTORY;
    private managePermission: BankingPermission = BankingPermission.MANAGEMENT;

    private canDeposit = false;
    private canWithdraw = false;
    private canTransfer = false;
    private canSeeTransaction = false;
    private canManage = false;

    private bankAccountId = 0;
    private characterId = 0;
    private characterName = "";
    private characterAccess?: BankAccountCharacterAccessInterface;

    public mounted(): void {
        banking
            .getInstance()
            .onChange.on((bankAccounts: BankAccountInterface[]) =>
            this.updateBankAccounts(bankAccounts)
        );
    }

    private updateBankAccounts(bankAccounts: BankAccountInterface[]): void {
        const bankAccount = bankAccounts.find((b) => b.id === this.bankAccountId);
        const characterAccess = bankAccount?.characterAccesses.find(
            (ca) => ca.characterId === this.characterId
        );

        if (characterAccess === undefined) {
            return;
        }

        this.setup(this.bankAccountId, characterAccess);
    }

    public setup(
        bankAccountId: number,
        characterAccess: BankAccountCharacterAccessInterface
    ): void {
        this.bankAccountId = bankAccountId;
        this.characterId = characterAccess.characterId;
        this.characterName = characterAccess.name;
        this.characterAccess = characterAccess;

        this.canDeposit =
            (characterAccess.permission & BankingPermission.DEPOSIT) ===
            BankingPermission.DEPOSIT;
        this.canWithdraw =
            (characterAccess.permission & BankingPermission.WITHDRAW) ===
            BankingPermission.WITHDRAW;
        this.canTransfer =
            (characterAccess.permission & BankingPermission.TRANSFER) ===
            BankingPermission.TRANSFER;
        this.canSeeTransaction =
            (characterAccess.permission & BankingPermission.SEE_HISTORY) ===
            BankingPermission.SEE_HISTORY;
        this.canManage =
            (characterAccess.permission & BankingPermission.MANAGEMENT) ===
            BankingPermission.MANAGEMENT;
    }

    private addPermission(permission: BankingPermission): void {
        if (this.characterAccess === undefined) {
            return;
        }

        if ((this.characterAccess.permission & permission) === permission) {
            return;
        }

        alt.emit(
            "phonebank:addpermission",
            this.characterAccess?.bankAccountId,
            this.characterAccess?.characterId,
            permission
        );
    }

    private removePermission(permission: BankingPermission): void {
        if (this.characterAccess === undefined) {
            return;
        }

        if ((this.characterAccess.permission & permission) !== permission) {
            return;
        }

        alt.emit(
            "phonebank:removepermission",
            this.characterAccess?.bankAccountId,
            this.characterAccess?.characterId,
            permission
        );
    }

    private removeAccess(): void {
        this.back();
        alt.emit(
            "phonebank:removeaccess",
            this.characterAccess?.bankAccountId,
            this.characterAccess?.characterId
        );
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style scoped lang="scss">
.phone-manage-permission-bank-account {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

h5 {
    padding-top: 1.1vw;
}

.btn-outline-success,
.btn-outline-danger {
    color: black !important;
}

.permission-block {
    overflow: auto;
    height: 18.4vw;
    text-align: center;

    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
