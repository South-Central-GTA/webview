<template>
    <div class='company-manage'>
        <div class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Mein Unternehmen</span>
            </button>
        </div>

        <company-worker-overview ref='companyWorkerOverview' :hidden='currentTab !== 1' v-on:back='resetTab()' />
        <company-settings ref='companySettings' :hidden='currentTab !== 2' v-on:back='resetTab()' />

        <img class='gov-logo' src='@/assets/images/phone/gov-seal.png' />

        <div class='company-stats'>
            <h1>{{ companyName }}</h1>
            <div v-if='canManageMembers'>
                <h3>Unternehmenskonto:</h3>
                <h2>${{ bankAccountAmout }}</h2>
            </div>
            <h3>Hauptsitz:</h3>
            <h2>{{ officeHouseText }}</h2>
        </div>

        <div class='phone-gov-button-group'>
            <button :disabled='!canManageMembers' class='btn' type='button' @click='openTab(1)'>
                Mitarbeiter
            </button>
            <button class='btn' type='button' @click='openTab(2)'>Verwalten</button>
        </div>
    </div>
</template>

<script lang='ts'>
import character from "@/scripts/services/character.service";
import banking from "@/scripts/services/banking.service";
import houseing from "@/scripts/services/house.service";
import CompanyWorkerOverview from "./CompanyManagement/CompanyWorkerOverviewPage.vue";
import CompanySettings from "./CompanyManagement/CompanySettingsPage.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {CompanyInterface} from "@/scripts/interfaces/group/company.interface";
import {GroupPermission} from "@/scripts/enums/group.permission";
import {LicenseInterface} from "@/scripts/interfaces/group/license.interface";

@Options({
    components: {
        CompanyWorkerOverview, CompanySettings,
    },
})
export default class CompanyManagePage extends Vue {
    @Ref() private readonly companyWorkerOverview!: CompanyWorkerOverview;
    @Ref() private readonly companySettings!: CompanySettings;
    private companyName = "";
    private currentTab = 0;
    private company?: CompanyInterface;
    private canManageMembers = true;
    private canBuyLics = true;
    private canSellLics = true;
    private canChangeDeliveryVisibility = true;
    private isOwner = false;
    private bankAccountAmout = "";
    private officeHouseText = "";
    private licenses: LicenseInterface[] = [];

    get getCurrentTab() {
        return this.currentTab;
    }

    public setup(company: CompanyInterface, licenses: LicenseInterface[]): void {
        this.company = company;

        this.companyName = this.company.name;

        const member = this.company.members.find((w) => w.characterId == character.getInstance().getCharacterId);
        if (member !== undefined) {
            if (member.owner) {
                // Check if the player is owner, if not check if he has the rank with permissions to manage.
                this.isOwner = true;
                this.canManageMembers = true;
                this.canBuyLics = true;
                this.canSellLics = true;
            } else {
                const rank = this.company.ranks.find((r) => r.level === member.level);
                if (rank !== undefined) {
                    this.canManageMembers = (rank.groupPermission & GroupPermission.MANAGER_MEMBERS) === GroupPermission.MANAGER_MEMBERS;
                    this.canBuyLics = (rank.groupPermission & GroupPermission.BUY_LICENSES) === GroupPermission.BUY_LICENSES;
                    this.canSellLics = (rank.groupPermission & GroupPermission.SELL_LICENSES) === GroupPermission.SELL_LICENSES;
                    this.canChangeDeliveryVisibility = (rank.groupPermission & GroupPermission.CHANGE_DELIVERY_VISIBILITY) === GroupPermission.CHANGE_DELIVERY_VISIBILITY;
                }
            }
        }

        const bankAccount = banking
            .getInstance()
            .getBankAccounts.find((b) => b.groupAccesses.some((ga) => ga.groupId === this.company?.id));
        if (bankAccount !== undefined) {
            this.bankAccountAmout = bankAccount.amount;
        }

        this.licenses = licenses;

        const house = houseing
            .getInstance()
            .getHouses.find((h) => h.groupOwnerId === company.id && h.houseType === 0);
        if (house !== undefined) {
            this.officeHouseText = house.streetName + " " + house.subName + " " + house.houseNumber;
        }

        if (this.currentTab === 1) {
            if (this.canManageMembers) {
                this.companyWorkerOverview.setup(this.company);
            } else {
                this.openTab(0);
            }
        }

        if (this.currentTab === 2) {
            this.companySettings.setup(this.company, this.licenses, this.isOwner, this.canSellLics, this.canBuyLics,
                this.canChangeDeliveryVisibility);
        }
    }

    public resetTab(): void {
        if (this.currentTab === 1 && this.companyWorkerOverview.getIsEditingWindowOpen) {
            this.companyWorkerOverview.closeWindow();
            return;
        }

        this.openTab(0);
    }

    private openTab(id: number): void {
        if (this.company === undefined) {
            return;
        }

        if (id === 1) {
            this.companyWorkerOverview.setup(this.company);
        }

        if (id === 2) {
            this.companySettings.setup(this.company, this.licenses, this.isOwner, this.canSellLics, this.canBuyLics,
                this.canChangeDeliveryVisibility);
        }

        this.currentTab = id;
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style lang='scss' scoped>
.company-manage {
    overflow: hidden;
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
    z-index: 100;
}

.input-text {
    height: 1.5vw;
    color: black;
    text-align: center;
    margin-bottom: 0.5vw;
}

.bankdetails-text {
    margin-top: 2.9vw;
}

.input-text::placeholder {
    color: black;
    font-style: italic;
}

.company-stats {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -0%);
}

.company-stats h1 {
    margin: unset;
    width: 100%;
    font-size: 1vw;
}

.company-stats h2 {
    margin: unset;
    width: 100%;
    font-size: 0.9vw;
}

.company-stats h3 {
    margin: 0.1vw 0vw;
    width: 100%;
    font-size: 0.6vw;
}
</style>
