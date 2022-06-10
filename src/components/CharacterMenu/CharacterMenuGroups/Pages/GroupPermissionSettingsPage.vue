<template>
    <div class='group-permission-settings-page'>
        <button class='icon-button text-white' @click='back()'>
            <font-awesome-icon class='mx-2' icon='chevron-left' />
            <span>Berechtigungen für {{ rankName }}</span>
        </button>

        <div class='row g-3 mt-2'>
            <div class='col-6'>
                <label class='form-label'>Einzahlen ins Gruppenkonto:</label><br />
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canBankDeposit,
              'btn-outline-success': !canBankDeposit,
            }" @click='addPermission(bankingDepositPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canBankDeposit,
              'btn-outline-danger': canBankDeposit,
            }" @click='removePermission(bankingDepositPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Auszahlen vom Gruppenkonto:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canBankWithdraw,
              'btn-outline-success': !canBankWithdraw,
            }" @click='addPermission(bankingWithdrawPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canBankWithdraw,
              'btn-outline-danger': canBankWithdraw,
            }" @click='removePermission(bankingWithdrawPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Überweisungen vom Gruppenkonto:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canBankTransfer,
              'btn-outline-success': !canBankTransfer,
            }" @click='addPermission(bankingTransferPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canBankTransfer,
              'btn-outline-danger': canBankTransfer,
            }" @click='removePermission(bankingTransferPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Gruppenkonto Verlauf einsehen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canBankSeeTransactions,
              'btn-outline-success': !canBankSeeTransactions,
            }" @click='addPermission(bankingSeeTransactionsPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canBankSeeTransactions,
              'btn-outline-danger': canBankSeeTransactions,
            }" @click='removePermission(bankingSeeTransactionsPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mails lesen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canReadMails,
              'btn-outline-success': !canReadMails,
            }" @click='addPermission(mailingReading)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canReadMails,
              'btn-outline-danger': canReadMails,
            }" @click='removePermission(mailingReading)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mails schreiben:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canSendMails,
              'btn-outline-success': !canSendMails,
            }" @click='addPermission(mailingSending)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canSendMails,
              'btn-outline-danger': canSendMails,
            }" @click='removePermission(mailingSending)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mails löschen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canDeleteMails,
              'btn-outline-success': !canDeleteMails,
            }" @click='addPermission(mailingDeleting)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canDeleteMails,
              'btn-outline-danger': canDeleteMails,
            }" @click='removePermission(mailingDeleting)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mitarbeiter verwalten:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canManageMembers,
              'btn-outline-success': !canManageMembers,
            }" @click='addPermission(manageMembersPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canManageMembers,
              'btn-outline-danger': canManageMembers,
            }" @click='removePermission(manageMembersPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Charaktere einladen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canInvite,
              'btn-outline-success': !canInvite,
            }" @click='addPermission(invitePermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canInvite,
              'btn-outline-danger': canInvite,
            }" @click='removePermission(invitePermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Charaktere rauswerfen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canUninvite,
              'btn-outline-success': !canUninvite,
            }" @click='addPermission(uninvitePermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canUninvite,
              'btn-outline-danger': canUninvite,
            }" @click='removePermission(uninvitePermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Fahrzeuge verkaufen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canSellVehicles,
              'btn-outline-success': !canSellVehicles,
            }" @click='addPermission(sellVehiclesPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canSellVehicles,
              'btn-outline-danger': canSellVehicles,
            }" @click='removePermission(sellVehiclesPermission)'>
                        Nein
                    </button>
                </div>
            </div>

            <div v-if='isCompany' class='col-6'>
                <label class='form-label'>Sichtbarkeit von Lieferungen ändern:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canChangeDeliveryVisibility,
              'btn-outline-success': !canChangeDeliveryVisibility,
            }" @click='addPermission(changeDeliveryVisibilityPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canChangeDeliveryVisibility,
              'btn-outline-danger': canChangeDeliveryVisibility,
            }" @click='removePermission(changeDeliveryVisibilityPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div v-if='isCompany' class='col-6'>
                <label class='form-label'>Produkte bestellen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canOrderProducts,
              'btn-outline-success': !canOrderProducts,
            }" @click='addPermission(orderProductsPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canOrderProducts,
              'btn-outline-danger': canOrderProducts,
            }" @click='removePermission(orderProductsPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div v-if='isCompany' class='col-6'>
                <label class='form-label'>Lizenzen kaufen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canBuyLicenses,
              'btn-outline-success': !canBuyLicenses,
            }" @click='addPermission(buyLicensesPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canBuyLicenses,
              'btn-outline-danger': canBuyLicenses,
            }" @click='removePermission(buyLicensesPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div v-if='isCompany' class='col-6'>
                <label class='form-label'>Lizenzen verkaufen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canSellLicenses,
              'btn-outline-success': !canSellLicenses,
            }" @click='addPermission(sellLicensesPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canSellLicenses,
              'btn-outline-danger': canSellLicenses,
            }" @click='removePermission(sellLicensesPermission)'>
                        Nein
                    </button>
                </div>
            </div>

            <div v-if='isVehicleDealer' class='col-6'>
                <label class='form-label'>Fahrzeuge bestellen:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canOrderVehicles,
              'btn-outline-success': !canOrderVehicles,
            }" @click='addPermission(orderVehiclesPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canOrderVehicles,
              'btn-outline-danger': canOrderVehicles,
            }" @click='removePermission(orderVehiclesPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div v-if='isVehicleDealer' class='col-6'>
                <label class='form-label'>Fahrzeuge aus-& einparken:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': canStoreVehicles,
              'btn-outline-success': !canStoreVehicles,
            }" @click='addPermission(storeVehiclesPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !canStoreVehicles,
              'btn-outline-danger': canStoreVehicles,
            }" @click='removePermission(storeVehiclesPermission)'>
                        Nein
                    </button>
                </div>
            </div>
            <div v-if='isFaction' class='col-6'>
                <label class='form-label'>MDC Operator Berechtigung:</label>
                <div class='btn-group w-100'>
                    <button class='btn' type='button' v-bind:class="{
              'btn-success': hasMdcOperator,
              'btn-outline-success': !hasMdcOperator,
            }" @click='addPermission(mdcOperatorPermission)'>
                        Ja
                    </button>
                    <button class='btn' type='button' v-bind:class="{
              'btn-danger': !hasMdcOperator,
              'btn-outline-danger': hasMdcOperator,
            }" @click='removePermission(mdcOperatorPermission)'>
                        Nein
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import groupService from "@/scripts/services/group.service";
import {Vue} from "vue-class-component";
import {GroupRankInterface} from "@/scripts/interfaces/group/group-rank.interface";
import {GroupPermission} from "@/scripts/enums/group.permission";
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {LicenseType} from "@/scripts/enums/license.type";

export default class GroupPermissionSettingsPage extends Vue {
    private rank?: GroupRankInterface;
    private rankName = "";

    private manageMembersPermission: GroupPermission = GroupPermission.MANAGER_MEMBERS;
    private invitePermission: GroupPermission = GroupPermission.INVITE;
    private uninvitePermission: GroupPermission = GroupPermission.UNINVITE;
    private changeDeliveryVisibilityPermission: GroupPermission = GroupPermission.CHANGE_DELIVERY_VISIBILITY;
    private orderProductsPermission: GroupPermission = GroupPermission.ORDER_PRODUCTS;
    private buyLicensesPermission: GroupPermission = GroupPermission.BUY_LICENSES;
    private sellLicensesPermission: GroupPermission = GroupPermission.SELL_LICENSES;
    private sellVehiclesPermission: GroupPermission = GroupPermission.SELL_VEHICLES;
    private orderVehiclesPermission: GroupPermission = GroupPermission.ORDER_VEHICLES;
    private storeVehiclesPermission: GroupPermission = GroupPermission.STORE_VEHICLES;
    private bankingDepositPermission: GroupPermission = GroupPermission.BANKING_DEPOSIT;
    private bankingWithdrawPermission: GroupPermission = GroupPermission.BANKING_WITHDRAW;
    private bankingTransferPermission: GroupPermission = GroupPermission.BANKING_TRANSFER;
    private bankingSeeTransactionsPermission: GroupPermission = GroupPermission.BANKING_SEE_HISTORY;
    private mailingSending: GroupPermission = GroupPermission.MAILING_SENDING;
    private mailingReading: GroupPermission = GroupPermission.MAILING_READING;
    private mailingDeleting: GroupPermission = GroupPermission.MAILING_DELETING;
    private mdcOperatorPermission: GroupPermission = GroupPermission.MDC_OPERATOR;

    private canManageMembers = false;
    private canInvite = false;
    private canUninvite = false;
    private canChangeDeliveryVisibility = false;
    private canOrderProducts = false;
    private canBuyLicenses = false;
    private canSellLicenses = false;
    private canSellVehicles = false;
    private canOrderVehicles = false;
    private canStoreVehicles = false;
    private canBankDeposit = false;
    private canBankWithdraw = false;
    private canBankTransfer = false;
    private canBankSeeTransactions = false;
    private canSendMails = false;
    private canReadMails = false;
    private canDeleteMails = false;
    private hasMdcOperator = false;

    private isCompany = false;
    private isFaction = false;

    private isVehicleDealer = false;

    public mounted(): void {
        groupService
            .getInstance()
            .AllGroupsChanged.on((groups: GroupInterface[] | undefined) => this.updateGroups(groups));
    }

    public setup(rank: GroupRankInterface): void {
        this.rank = rank;
        this.rankName = rank.name;

        this.canManageMembers = (rank.groupPermission & GroupPermission.MANAGER_MEMBERS) === GroupPermission.MANAGER_MEMBERS;
        this.canInvite = (rank.groupPermission & GroupPermission.INVITE) === GroupPermission.INVITE;
        this.canUninvite = (rank.groupPermission & GroupPermission.UNINVITE) === GroupPermission.UNINVITE;
        this.canSellVehicles = (rank.groupPermission & GroupPermission.SELL_VEHICLES) === GroupPermission.SELL_VEHICLES;
        this.canSendMails = (rank.groupPermission & GroupPermission.MAILING_SENDING) === GroupPermission.MAILING_SENDING;
        this.canReadMails = (rank.groupPermission & GroupPermission.MAILING_READING) === GroupPermission.MAILING_READING;
        this.canDeleteMails = (rank.groupPermission & GroupPermission.MAILING_DELETING) === GroupPermission.MAILING_DELETING;

        this.canBankDeposit = (rank.groupPermission & GroupPermission.BANKING_DEPOSIT) === GroupPermission.BANKING_DEPOSIT;
        this.canBankWithdraw = (rank.groupPermission & GroupPermission.BANKING_WITHDRAW) === GroupPermission.BANKING_WITHDRAW;
        this.canBankTransfer = (rank.groupPermission & GroupPermission.BANKING_TRANSFER) === GroupPermission.BANKING_TRANSFER;
        this.canBankSeeTransactions = (rank.groupPermission & GroupPermission.BANKING_SEE_HISTORY) === GroupPermission.BANKING_SEE_HISTORY;

        const company = groupService.getInstance().Company;

        if (company !== null && company !== undefined) {
            this.isCompany = true;
            this.isVehicleDealer = (company.licenses & LicenseType.VEHICLE_DEALERSHIP) === LicenseType.VEHICLE_DEALERSHIP;

            this.canChangeDeliveryVisibility = (rank.groupPermission & GroupPermission.CHANGE_DELIVERY_VISIBILITY) === GroupPermission.CHANGE_DELIVERY_VISIBILITY;
            this.canOrderProducts = (rank.groupPermission & GroupPermission.ORDER_PRODUCTS) === GroupPermission.ORDER_PRODUCTS;
            this.canBuyLicenses = (rank.groupPermission & GroupPermission.BUY_LICENSES) === GroupPermission.BUY_LICENSES;
            this.canSellLicenses = (rank.groupPermission & GroupPermission.SELL_LICENSES) === GroupPermission.SELL_LICENSES;

            if (this.isVehicleDealer) {
                this.canOrderVehicles = (rank.groupPermission & GroupPermission.ORDER_VEHICLES) === GroupPermission.ORDER_VEHICLES;
                this.canStoreVehicles = (rank.groupPermission & GroupPermission.STORE_VEHICLES) === GroupPermission.STORE_VEHICLES;
            }
        }

        const faction = groupService.getInstance().Faction;

        if (faction !== null && faction !== undefined) {
            this.isFaction = true;

            this.hasMdcOperator = (rank.groupPermission & GroupPermission.MDC_OPERATOR) === GroupPermission.MDC_OPERATOR;
        }
    }

    private updateGroups(groups: GroupInterface[] | undefined): void {
        if (this.rank === undefined) {
            return;
        }

        if (groups === undefined) {
            return;
        }

        const group = groups.find((g) => g.id === this.rank?.groupId);

        if (group === undefined) {
            return;
        }

        const updatedRank = group.ranks.find((r) => r.level === this.rank?.level);
        if (updatedRank === undefined) {
            return;
        }

        this.setup(updatedRank);
    }

    private addPermission(groupPermission: GroupPermission): void {
        if (this.rank === undefined || (this.rank.groupPermission & groupPermission) === groupPermission) {
            return;
        }

        alt.emitServer("groupmenu:addpermission", this.rank.groupId, this.rank.level, groupPermission);
    }

    private removePermission(groupPermission: GroupPermission): void {
        if (this.rank === undefined || (this.rank.groupPermission & groupPermission) !== groupPermission) {
            return;
        }

        alt.emitServer("groupmenu:removepermission", this.rank.groupId, this.rank.level, groupPermission);
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style scoped>
.row {
    overflow-y: auto;
    height: 27vw;
}
</style>
