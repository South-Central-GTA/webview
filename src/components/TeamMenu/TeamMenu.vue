<template>
    <div class='team-menu'>
        <div :hidden='!active' class='sc-card text-white center' v-bind:class='{ enable: active, disable: !active }'>
            <div class='card-body'>
                <h5 class='card-title'>Team Menu</h5>
                <div class='row'>
                    <div class='col-2'>
                        <div class='btn-group-vertical'>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 0,
                  'btn-primary': activeTabId === 0 }" @click='openTab(0)'>
                                Dashboard
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 1,
                  'btn-primary': activeTabId === 1 }" @click='openTab(1)'>
                                Eventlog
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 2,
                  'btn-primary': activeTabId === 2}" @click='openTab(2)'>
                                Item Katalog
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 3,
                  'btn-primary': activeTabId === 3 }" @click='openTab(3)'>
                                Fahrzeug Katalog
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 4,
                  'btn-primary': activeTabId === 4 }" @click='openTab(4)'>
                                Online Spielerliste
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 5,
                  'btn-primary': activeTabId === 5 }" @click='openTab(5)'>
                                Gruppen
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 6,
                  'btn-primary': activeTabId === 6 }" @click='openTab(6)'>
                                Charaktere
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 7,
                  'btn-primary': activeTabId === 7  }" @click='openTab(7)'>
                                Accounts
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 8,
                  'btn-primary': activeTabId === 8 }" @click='openTab(8)'>
                                Fahrzeuge
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 9,
                  'btn-primary': activeTabId === 9 }" @click='openTab(9)'>
                                Häuser Katalog
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 10,
                  'btn-primary': activeTabId === 10 }" @click='openTab(10)'>
                                Offene Help Me's
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 11,
                  'btn-primary': activeTabId === 11 }" @click='openTab(11)'>
                                SMS Log
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 12,
                  'btn-primary': activeTabId === 12 }" @click='openTab(12)'>
                                E-Mail Accounts
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 13,
                  'btn-primary': activeTabId === 13 }" @click='openTab(13)'>
                                Mails Log
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 14,
                  'btn-primary': activeTabId === 14 }" @click='openTab(14)'>
                                Animationen
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 15,
                  'btn-primary': activeTabId === 15 }" @click='openTab(15)'>
                                Bankkonten
                            </button>
                        </div>
                    </div>
                    <div class='col-10'>
                        <team-menu-dashboard :hidden='activeTabId !== 0' />
                        <team-menu-event-log ref='eventLog' :hidden='activeTabId !== 1' />
                        <team-menu-item-catalog ref='itemCatalog' :hidden='activeTabId !== 2' />
                        <team-menu-vehicle-catalog ref='vehicleCatalog' :hidden='activeTabId !== 3' />
                        <team-menu-player-catalog ref='playerCatalog' :hidden='activeTabId !== 4' />
                        <team-menu-group-catalog ref='groupCatalog' :hidden='activeTabId !== 5' />
                        <team-menu-character-catalog ref='characterCatalog' :hidden='activeTabId !== 6' />
                        <team-menu-account-catalog ref='accountCatalog' :hidden='activeTabId !== 7' />
                        <team-menu-player-vehicle-catalog ref='playerVehicleCatalog' :hidden='activeTabId !== 8' />
                        <team-menu-housing-catalog ref='housingCatalog' :hidden='activeTabId !== 9' />
                        <team-menu-help-me ref='helpMeCatalog' :hidden='activeTabId !== 10' />
                        <team-menu-phone-messages-log ref='phoneMessageCatalog' :hidden='activeTabId !== 11' />
                        <team-menu-mail-accounts-log ref='accountsCatalog' :hidden='activeTabId !== 12' />
                        <team-menu-mails-log ref='mailsCatalog' :hidden='activeTabId !== 13' />
                        <team-menu-animations ref='animationsCatalog' :hidden='activeTabId !== 14' />
                        <team-menu-bank-accounts ref='bankAccountsCatalog' :hidden='activeTabId !== 15' />

                        <team-menu-user-record ref='userRecordMenu' :hidden='activeTabId !== 1001' />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import TeamMenuDashboard from "./Pages/TeamMenuDashboard.vue";
import TeamMenuItemCatalog from "./Pages/TeamMenuItemCatalog.vue";
import alt from "@/scripts/services/alt.service";
import TeamMenuVehicleCatalog from "@/components/TeamMenu/Pages/TeamMenuVehicleCatalog.vue";
import TeamMenuCharacterCatalog from "@/components/TeamMenu/Pages/TeamMenuCharacterCatalog.vue";
import TeamMenuGroupCatalog from "@/components/TeamMenu/Pages/TeamMenuGroupCatalog.vue";
import TeamMenuHousingCatalog from "@/components/TeamMenu/Pages/TeamMenuHousingCatalog.vue";
import TeamMenuPlayerCatalog from "@/components/TeamMenu/Pages/TeamMenuPlayerCatalog.vue";
import TeamMenuHelpMe from "@/components/TeamMenu/Pages/TeamMenuHelpMe.vue";
import TeamMenuAccountCatalog from "@/components/TeamMenu/Pages/TeamMenuAccountCatalog.vue";
import TeamMenuUserRecord from "@/components/TeamMenu/Pages/TeamMenuUserRecord.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import TeamMenuPhoneMessagesLog from "@/components/TeamMenu/Pages/TeamMenuPhoneMessagesLog.vue";
import TeamMenuMailAccountsLog from "@/components/TeamMenu/Pages/TeamMenuMailAccountsLog.vue";
import TeamMenuMailsLog from "@/components/TeamMenu/Pages/TeamMenuMailsLog.vue";
import TeamMenuAnimations from "@/components/TeamMenu/Pages/TeamMenuAnimations.vue";
import TeamMenuBankAccounts from "@/components/TeamMenu/Pages/TeamMenuBankAccounts.vue";
import TeamMenuPlayerVehicleCatalog from "@/components/TeamMenu/Pages/TeamMenuPlayerVehicleCatalog.vue";
import TeamMenuEventLog from "@/components/TeamMenu/Pages/TeamMenuEventLog.vue";
import {UserRecordInterface} from "@/scripts/interfaces/team-menu/user-record.interface";

@Options({
    components: {
        TeamMenuEventLog,
        TeamMenuPlayerVehicleCatalog,
        TeamMenuBankAccounts,
        TeamMenuAnimations,
        TeamMenuMailsLog,
        TeamMenuMailAccountsLog,
        TeamMenuPhoneMessagesLog,
        TeamMenuUserRecord,
        TeamMenuAccountCatalog,
        TeamMenuHelpMe,
        TeamMenuPlayerCatalog,
        TeamMenuHousingCatalog,
        TeamMenuGroupCatalog,
        TeamMenuCharacterCatalog,
        TeamMenuDashboard,
        TeamMenuItemCatalog,
        TeamMenuVehicleCatalog,
    },
})
export default class TeamMenu extends Vue {
    @Ref() private readonly eventLog!: TeamMenuEventLog;
    @Ref() private readonly itemCatalog!: TeamMenuItemCatalog;
    @Ref() private readonly vehicleCatalog!: TeamMenuVehicleCatalog;
    @Ref() private readonly playerCatalog!: TeamMenuPlayerCatalog;
    @Ref() private readonly groupCatalog!: TeamMenuGroupCatalog;
    @Ref() private readonly characterCatalog!: TeamMenuCharacterCatalog;
    @Ref() private readonly accountCatalog!: TeamMenuAccountCatalog;
    @Ref() private readonly playerVehicleCatalog!: TeamMenuPlayerVehicleCatalog;
    @Ref() private readonly housingCatalog!: TeamMenuHousingCatalog;
    @Ref() private readonly helpMeCatalog!: TeamMenuHelpMe;
    @Ref() private readonly phoneMessageCatalog!: TeamMenuPhoneMessagesLog;
    @Ref() private readonly mailsAccountCatalog!: TeamMenuMailAccountsLog;
    @Ref() private readonly mailsCatalog!: TeamMenuMailsLog;
    @Ref() private readonly animationsCatalog!: TeamMenuAnimations;
    @Ref() private readonly bankAccountsCatalog!: TeamMenuBankAccounts;
    @Ref() private readonly userRecordMenu!: TeamMenuUserRecord;

    private activeTabId = 0;
    private active = false;

    public mounted(): void {
        alt.on("adminmenu:toggle", (state: boolean) => this.toggle(state));
        alt.on("userrecord:setup", (args: any[]) => this.openUserRecord(args[0], args[1]));
    }

    public unmounted(): void {
        alt.off("adminmenu:toggle");
        alt.off("userrecord:setup");
    }

    private toggle(state: boolean): void {
        this.active = state;

        this.openTab(this.activeTabId);
    }

    private openUserRecord(accountId: number, userRecords: UserRecordInterface[]): void {
        this.userRecordMenu.setup(accountId, userRecords);
        this.activeTabId = 1001;
    }

    private openTab(tabId: number): void {
        this.activeTabId = tabId;

        switch (tabId) {
            case 1:
                this.eventLog.open();
                break;
            case 2:
                this.itemCatalog.open();
                break;
            case 3:
                this.vehicleCatalog.open();
                break;
            case 4:
                this.playerCatalog.open();
                break;
            case 5:
                this.groupCatalog.open();
                break;
            case 6:
                this.characterCatalog.open();
                break;
            case 7:
                this.accountCatalog.open();
                break;
            case 8:
                this.playerVehicleCatalog.open();
                break;
            case 9:
                this.housingCatalog.open();
                break;
            case 10:
                this.helpMeCatalog.open();
                break;
            case 11:
                this.phoneMessageCatalog.open();
                break;
            case 12:
                this.mailsAccountCatalog.open();
                break;
            case 13:
                this.mailsCatalog.open();
                break;
            case 14:
                this.animationsCatalog.open();
                break;
            case 15:
                this.bankAccountsCatalog.open();
                break;
        }
    }
}
</script>

<style scoped>
.team-menu {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
}

.sc-card {
    width: 60vw;
    height: 35vw;
}
</style>
