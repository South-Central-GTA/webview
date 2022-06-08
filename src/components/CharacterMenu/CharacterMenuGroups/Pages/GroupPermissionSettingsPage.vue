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
                    <button type='button' class='btn' @click='addPermission(bankingDepositPermission)' v-bind:class="{
              'btn-success': canBankDeposit,
              'btn-outline-success': !canBankDeposit,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(bankingDepositPermission)' v-bind:class="{
              'btn-danger': !canBankDeposit,
              'btn-outline-danger': canBankDeposit,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Auszahlen vom Gruppenkonto:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(bankingWithdrawPermission)' v-bind:class="{
              'btn-success': canBankWithdraw,
              'btn-outline-success': !canBankWithdraw,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(bankingWithdrawPermission)' v-bind:class="{
              'btn-danger': !canBankWithdraw,
              'btn-outline-danger': canBankWithdraw,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Überweisungen vom Gruppenkonto:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(bankingTransferPermission)' v-bind:class="{
              'btn-success': canBankTransfer,
              'btn-outline-success': !canBankTransfer,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(bankingTransferPermission)' v-bind:class="{
              'btn-danger': !canBankTransfer,
              'btn-outline-danger': canBankTransfer,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Gruppenkonto Verlauf einsehen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(bankingSeeTransactionsPermission)' v-bind:class="{
              'btn-success': canBankSeeTransactions,
              'btn-outline-success': !canBankSeeTransactions,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(bankingSeeTransactionsPermission)' v-bind:class="{
              'btn-danger': !canBankSeeTransactions,
              'btn-outline-danger': canBankSeeTransactions,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mails lesen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(mailingReading)' v-bind:class="{
              'btn-success': canReadMails,
              'btn-outline-success': !canReadMails,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(mailingReading)' v-bind:class="{
              'btn-danger': !canReadMails,
              'btn-outline-danger': canReadMails,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mails schreiben:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(mailingSending)' v-bind:class="{
              'btn-success': canSendMails,
              'btn-outline-success': !canSendMails,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(mailingSending)' v-bind:class="{
              'btn-danger': !canSendMails,
              'btn-outline-danger': canSendMails,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mails löschen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(mailingDeleting)' v-bind:class="{
              'btn-success': canDeleteMails,
              'btn-outline-success': !canDeleteMails,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(mailingDeleting)' v-bind:class="{
              'btn-danger': !canDeleteMails,
              'btn-outline-danger': canDeleteMails,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Mitarbeiter verwalten:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(manageMembersPermission)' v-bind:class="{
              'btn-success': canManageMembers,
              'btn-outline-success': !canManageMembers,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(manageMembersPermission)' v-bind:class="{
              'btn-danger': !canManageMembers,
              'btn-outline-danger': canManageMembers,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Charaktere einladen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(invitePermission)' v-bind:class="{
              'btn-success': canInvite,
              'btn-outline-success': !canInvite,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(invitePermission)' v-bind:class="{
              'btn-danger': !canInvite,
              'btn-outline-danger': canInvite,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Charaktere rauswerfen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(uninvitePermission)' v-bind:class="{
              'btn-success': canUninvite,
              'btn-outline-success': !canUninvite,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(uninvitePermission)' v-bind:class="{
              'btn-danger': !canUninvite,
              'btn-outline-danger': canUninvite,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <label class='form-label'>Fahrzeuge verkaufen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(sellVehiclesPermission)' v-bind:class="{
              'btn-success': canSellVehicles,
              'btn-outline-success': !canSellVehicles,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(sellVehiclesPermission)' v-bind:class="{
              'btn-danger': !canSellVehicles,
              'btn-outline-danger': canSellVehicles,
            }">
                        Nein
                    </button>
                </div>
            </div>

            <div class='col-6' v-if='isCompany'>
                <label class='form-label'>Sichtbarkeit von Lieferungen ändern:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(changeDeliveryVisibilityPermission)' v-bind:class="{
              'btn-success': canChangeDeliveryVisibility,
              'btn-outline-success': !canChangeDeliveryVisibility,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(changeDeliveryVisibilityPermission)' v-bind:class="{
              'btn-danger': !canChangeDeliveryVisibility,
              'btn-outline-danger': canChangeDeliveryVisibility,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6' v-if='isCompany'>
                <label class='form-label'>Produkte bestellen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(orderProductsPermission)' v-bind:class="{
              'btn-success': canOrderProducts,
              'btn-outline-success': !canOrderProducts,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(orderProductsPermission)' v-bind:class="{
              'btn-danger': !canOrderProducts,
              'btn-outline-danger': canOrderProducts,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6' v-if='isCompany'>
                <label class='form-label'>Lizenzen kaufen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(buyLicensesPermission)' v-bind:class="{
              'btn-success': canBuyLicenses,
              'btn-outline-success': !canBuyLicenses,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(buyLicensesPermission)' v-bind:class="{
              'btn-danger': !canBuyLicenses,
              'btn-outline-danger': canBuyLicenses,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6' v-if='isCompany'>
                <label class='form-label'>Lizenzen verkaufen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(sellLicensesPermission)' v-bind:class="{
              'btn-success': canSellLicenses,
              'btn-outline-success': !canSellLicenses,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(sellLicensesPermission)' v-bind:class="{
              'btn-danger': !canSellLicenses,
              'btn-outline-danger': canSellLicenses,
            }">
                        Nein
                    </button>
                </div>
            </div>

            <div class='col-6' v-if='isVehicleDealer'>
                <label class='form-label'>Fahrzeuge bestellen:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(orderVehiclesPermission)' v-bind:class="{
              'btn-success': canOrderVehicles,
              'btn-outline-success': !canOrderVehicles,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(orderVehiclesPermission)' v-bind:class="{
              'btn-danger': !canOrderVehicles,
              'btn-outline-danger': canOrderVehicles,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6' v-if='isVehicleDealer'>
                <label class='form-label'>Fahrzeuge aus-& einparken:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(storeVehiclesPermission)' v-bind:class="{
              'btn-success': canStoreVehicles,
              'btn-outline-success': !canStoreVehicles,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(storeVehiclesPermission)' v-bind:class="{
              'btn-danger': !canStoreVehicles,
              'btn-outline-danger': canStoreVehicles,
            }">
                        Nein
                    </button>
                </div>
            </div>
            <div class='col-6' v-if='isFaction'>
                <label class='form-label'>MDC Operator Berechtigung:</label>
                <div class='btn-group w-100'>
                    <button type='button' class='btn' @click='addPermission(mdcOperatorPermission)' v-bind:class="{
              'btn-success': hasMdcOperator,
              'btn-outline-success': !hasMdcOperator,
            }">
                        Ja
                    </button>
                    <button type='button' class='btn' @click='removePermission(mdcOperatorPermission)' v-bind:class="{
              'btn-danger': !hasMdcOperator,
              'btn-outline-danger': hasMdcOperator,
            }">
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

    private manageMembersPermission: GroupPermission =
        GroupPermission.MANAGER_MEMBERS;
    private invitePermission: GroupPermission = GroupPermission.INVITE;
    private uninvitePermission: GroupPermission = GroupPermission.UNINVITE;
    private changeDeliveryVisibilityPermission: GroupPermission =
        GroupPermission.CHANGE_DELIVERY_VISIBILITY;
    private orderProductsPermission: GroupPermission =
        GroupPermission.ORDER_PRODUCTS;
    private buyLicensesPermission: GroupPermission = GroupPermission.BUY_LICENSES;
    private sellLicensesPermission: GroupPermission =
        GroupPermission.SELL_LICENSES;
    private sellVehiclesPermission: GroupPermission =
        GroupPermission.SELL_VEHICLES;
    private orderVehiclesPermission: GroupPermission =
        GroupPermission.ORDER_VEHICLES;
    private storeVehiclesPermission: GroupPermission =
        GroupPermission.STORE_VEHICLES;
    private bankingDepositPermission: GroupPermission =
        GroupPermission.BANKING_DEPOSIT;
    private bankingWithdrawPermission: GroupPermission =
        GroupPermission.BANKING_WITHDRAW;
    private bankingTransferPermission: GroupPermission =
        GroupPermission.BANKING_TRANSFER;
    private bankingSeeTransactionsPermission: GroupPermission =
        GroupPermission.BANKING_SEE_HISTORY;
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
            .AllGroupsChanged.on((groups: GroupInterface[] | undefined) =>
            this.updateGroups(groups)
        );
    }

    public setup(rank: GroupRankInterface): void {
        this.rank = rank;
        this.rankName = rank.name;

        this.canManageMembers =
            (rank.groupPermission & GroupPermission.MANAGER_MEMBERS) ===
            GroupPermission.MANAGER_MEMBERS;
        this.canInvite =
            (rank.groupPermission & GroupPermission.INVITE) ===
            GroupPermission.INVITE;
        this.canUninvite =
            (rank.groupPermission & GroupPermission.UNINVITE) ===
            GroupPermission.UNINVITE;
        this.canSellVehicles =
            (rank.groupPermission & GroupPermission.SELL_VEHICLES) ===
            GroupPermission.SELL_VEHICLES;
        this.canSendMails =
            (rank.groupPermission & GroupPermission.MAILING_SENDING) ===
            GroupPermission.MAILING_SENDING;
        this.canReadMails =
            (rank.groupPermission & GroupPermission.MAILING_READING) ===
            GroupPermission.MAILING_READING;
        this.canDeleteMails =
            (rank.groupPermission & GroupPermission.MAILING_DELETING) ===
            GroupPermission.MAILING_DELETING;

        this.canBankDeposit =
            (rank.groupPermission & GroupPermission.BANKING_DEPOSIT) ===
            GroupPermission.BANKING_DEPOSIT;
        this.canBankWithdraw =
            (rank.groupPermission & GroupPermission.BANKING_WITHDRAW) ===
            GroupPermission.BANKING_WITHDRAW;
        this.canBankTransfer =
            (rank.groupPermission & GroupPermission.BANKING_TRANSFER) ===
            GroupPermission.BANKING_TRANSFER;
        this.canBankSeeTransactions =
            (rank.groupPermission & GroupPermission.BANKING_SEE_HISTORY) ===
            GroupPermission.BANKING_SEE_HISTORY;

        const company = groupService.getInstance().Company;

        if (company !== null && company !== undefined) {
            this.isCompany = true;
            this.isVehicleDealer =
                (company.licenses & LicenseType.VEHICLE_DEALERSHIP) ===
                LicenseType.VEHICLE_DEALERSHIP;

            this.canChangeDeliveryVisibility =
                (rank.groupPermission & GroupPermission.CHANGE_DELIVERY_VISIBILITY) ===
                GroupPermission.CHANGE_DELIVERY_VISIBILITY;
            this.canOrderProducts =
                (rank.groupPermission & GroupPermission.ORDER_PRODUCTS) ===
                GroupPermission.ORDER_PRODUCTS;
            this.canBuyLicenses =
                (rank.groupPermission & GroupPermission.BUY_LICENSES) ===
                GroupPermission.BUY_LICENSES;
            this.canSellLicenses =
                (rank.groupPermission & GroupPermission.SELL_LICENSES) ===
                GroupPermission.SELL_LICENSES;

            if (this.isVehicleDealer) {
                this.canOrderVehicles =
                    (rank.groupPermission & GroupPermission.ORDER_VEHICLES) ===
                    GroupPermission.ORDER_VEHICLES;
                this.canStoreVehicles =
                    (rank.groupPermission & GroupPermission.STORE_VEHICLES) ===
                    GroupPermission.STORE_VEHICLES;
            }
        }

        const faction = groupService.getInstance().Faction;

        if (faction !== null && faction !== undefined) {
            this.isFaction = true;

            this.hasMdcOperator =
                (rank.groupPermission & GroupPermission.MDC_OPERATOR) ===
                GroupPermission.MDC_OPERATOR;
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
        if (
            this.rank === undefined ||
            (this.rank.groupPermission & groupPermission) === groupPermission
        ) {
            return;
        }

        alt.emitServer(
            "groupmenu:addpermission",
            this.rank.groupId,
            this.rank.level,
            groupPermission
        );
    }

    private removePermission(groupPermission: GroupPermission): void {
        if (
            this.rank === undefined ||
            (this.rank.groupPermission & groupPermission) !== groupPermission
        ) {
            return;
        }

        alt.emitServer(
            "groupmenu:removepermission",
            this.rank.groupId,
            this.rank.level,
            groupPermission
        );
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
