<template>
    <div class="company-settings">
        <div class="phone-header">
            <button type="button" class="icon-button" @click="back()">
                <font-awesome-icon icon="chevron-left"/>
                <span>Verwalten</span>
            </button>
        </div>

        <div class="select-box">
            <h1>Bankkonto Verwaltung:</h1>
            <p class="pt-1">Hier können Sie umstellen auf welches Konto Ihr Gehalt gehen soll:</p>
            <select-bank-account ref="selectBank" v-on:change-bank-account="setBankAccount($event)"/>
        </div>

        <div class="select-box" style="margin-top: 0.3vw" :hidden="!isOwner">
            <h1>Unternehmenssitz: </h1>
            <p class="pt-1">Hier können Sie den Unternehmenssitz ändern:</p>
            <select-house ref="selectHouse" v-on:change-house="setHouse($event)"/>
            <p v-if="leaseCompanies.length !== 0" class="text-muted pt-2 m-0">Keine pachtbaren Unternehmenssitz
                möglich!</p>
        </div>

        <div class="lease-company-holder" v-if="leaseCompanies.length !== 0 && isOwner">
            <div class="security-dialog" v-if="isSecurityDialogCancelContractOpen">
                <p>Möchten Sie den ausgewählten Vertrag wirklich kündigen?</p>

                <div class="phone-gov-button-group">
                    <button type="button" class="btn" @click="closeCancelContractSecurityDialog()">Nein</button>
                    <button type="button" class="btn" @click="cancelContract()">Ja</button>
                </div>
            </div>

            <div class="lease-company-box">
                <h1>Pachtbare Unternehmenssitze:</h1>
                <div v-for="leaseCompany in leaseCompanies" v-bind:key="leaseCompany.id" class="pb-3">
                    <p>Typ: {{ leaseCompany.typeName }} {{ leaseCompany.subName }}</p>
                    <p>Vertrag endet am {{ getContractEndDate(leaseCompany.cancelDate) }}</p>
                    <a class="card-link" style="padding: unset"
                       @click="openCancelContractSecurityDialog(leaseCompany.id)">Kündigen</a>
                </div>
            </div>
        </div>

        <div class="delivery-status-visibility-box" @click="setDeliveryVisibility()" v-if="canChangeDeliveryVisibility">
            <h1>Status der Bestellungen:</h1>
            <h2>{{ getStatusString(deliveryVisiblityStatus) }}</h2>
            <h3 v-if="deliveryVisiblityStatus === 0">Nur Ihre eigene Firma kann die Bestellungen sehen und bearbeiten.
                Ohne Speditionslizenz macht diese Einstellung jedoch keinen Sinn.</h3>
            <h3 v-if="deliveryVisiblityStatus === 1">Jedes Unternehmen mit Speditionslizenz kann die Bestellungen des
                Unternehmens sehen und bearbeiten.</h3>
        </div>

        <div class="license-holder" v-if="canBuyLic || canSellLic">
            <div class="licences-box" v-if="!isBuyNewLicensesWindowOpen">
                <div class="security-dialog" v-if="isSellLicenseOpen">
                    <p>Möchten Sie die ausgewählte Lizenz für <b>${{ licPrice }}</b> verkaufen?</p>

                    <div class="phone-gov-button-group" style="z-index: 9999">
                        <button type="button" class="btn" @click="closeSellLicenseDialog()">Nein</button>
                        <button type="button" class="btn" @click="sellLicenses()">Ja</button>
                    </div>
                </div>

                <h1>Lizenzen in Besitz:</h1>
                <div class="licences-scrollbox">
                    <div v-for="boughtLicense in boughtLicenses" v-bind:key="boughtLicense.license">
                        <button type="button" class="license-button" :disabled="!canSellLic"
                                @click="openSellLicenseDialog(boughtLicense)">{{ boughtLicense.name }}
                        </button>
                    </div>
                </div>

                <div class="phone-gov-button-group">
                    <button type="button" class="btn" :disabled="!canBuyLic" @click="openLicenesBuyMenu()">Neue Lizenzen
                        kaufen
                    </button>
                </div>
            </div>

            <div class="licences-box" v-if="isBuyNewLicensesWindowOpen">

                <div class="security-dialog" v-if="isBuyLicenseOpen">
                    <p>Möchten Sie die ausgewählten Lizenzen für <b>${{ licPrice }}</b> erwerben?</p>

                    <div class="phone-gov-button-group" style="z-index: 9999">
                        <button type="button" class="btn" @click="closeBuyLicenseDialog()">Nein</button>
                        <button type="button" class="btn" @click="buyLicenses()">Ja</button>
                    </div>
                </div>

                <h1>Neue Lizenzen kaufen:</h1>
                <div class="licences-scrollbox">
                    <div v-for="license in licenses" v-bind:key="license.license">
                        <button type="button" class="license-button"
                                :disabled="boughtLicenses.find(bl => bl.license === license.license)"
                                @click="openBuyLicenseDialog(license)">{{ license.name }}
                        </button>
                    </div>
                </div>

                <div class="phone-gov-button-group pt">
                    <button type="button" class="btn" @click="closeLicenesBuyMenu()">Zurück</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from '@/scripts/services/alt.service';
import housing from "@/scripts/services/house.service";
import character from '@/scripts/services/character.service';
import CompanyWorkerEdit from './CompanyWorkerEditPage.vue';
import SelectBankAccount from '@/components/General/Banking/SelectBankAccount.vue';
import SelectHouse from '@/components/General/House/SelectHouse.vue';
import {LicensesType} from '@/scripts/enums/license.type';
import {BankAccountInterface} from '@/scripts/interfaces/bank/bank-account.interface';
import {HouseInterface} from '@/scripts/interfaces/house.interface';
import {CompanyInterface} from '@/scripts/interfaces/company/company.interface';
import {LicenseInterface} from "@/scripts/interfaces/company/license.interface";
import {LeaseCompanyInterface} from "@/scripts/interfaces/lease-company.interface";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

@Options({
    components: {
        CompanyWorkerEdit,
        SelectBankAccount,
        SelectHouse
    }
})
export default class CompanySettingsPage extends Vue {
    @Ref() private readonly selectBank!: SelectBankAccount;
    @Ref() private readonly selectHouse!: SelectHouse;

    private deliveryVisiblityStatus = 0;
    private isBuyNewLicensesWindowOpen = false;

    private isSecurityDialogCancelContractOpen = false;

    private isBuyLicenseOpen = false;
    private isSellLicenseOpen = false;

    private licenses: LicenseInterface[] = [];
    private boughtLicenses: LicenseInterface[] = [];
    private companyId = -1;

    private licPrice = 0;
    private showLicense: LicensesType = LicensesType.NONE;

    private isOwner = false;
    private canSellLic = false;
    private canBuyLic = false;
    private canChangeDeliveryVisibility = false;

    private leaseCompanies: LeaseCompanyInterface[] = [];
    private leaseCompanyId = -1;

    public mounted(): void {
        housing.getInstance().onChange.on((houses: HouseInterface[] | undefined) => this.updateLeaseCompany(houses));

        alt.on("company:resethouseselect", (id: number) => this.resetHouseSelect(id));
    }
    
    public unmounted(): void {
        alt.off("company:resethouseselect");
    }

    public setup(company: CompanyInterface, licenses: LicenseInterface[], isOwner: boolean, canSellLic: boolean, canBuyLic: boolean, canChangeDeliveryVisibility: boolean): void {
        this.companyId = company.id;
        this.deliveryVisiblityStatus = company.deliveryVisibilityStatus;

        this.isOwner = isOwner;
        this.canSellLic = canSellLic;
        this.canBuyLic = canBuyLic;
        this.canChangeDeliveryVisibility = canChangeDeliveryVisibility;

        this.licenses = licenses;

        this.boughtLicenses = [];
        
        this.licenses.forEach((license: LicenseInterface) => {
            const bitFlag = Number.parseInt(LicensesType[license.license]);
            if ((company.licenses & bitFlag) === bitFlag) {
                this.boughtLicenses.push(license);
            }
        });
        
        const worker = company.members.find(m => m.characterId == character.getInstance().getCharacterId);

        if (worker !== undefined) {
            this.selectBank.setBankAccount(worker.bankAccountId);
        }

        if (this.isOwner) {
            const house = housing.getInstance().getHouses.find(h => h.groupOwnerId === company.id);
            if (house !== undefined) {
                this.selectHouse.setHouse(house.id);
            }
        }

        this.updateLeaseCompany(housing.getInstance().getHouses);
    }

    private updateLeaseCompany(houses: HouseInterface[] | undefined): void {
        if (houses === undefined) {
            this.leaseCompanies = [];
            return;
        }

        this.leaseCompanies = houses.filter(h => h.houseType === 1
            && h.groupOwnerId === this.companyId) as LeaseCompanyInterface[];
    }

    private resetHouseSelect(id: number): void {
        this.selectHouse.setHouse(id);
    }

    private getContractEndDate(leaseDate: string): string {
        const date = new Date(JSON.parse(leaseDate));
        return date.toLocaleDateString("de-DE", {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
    }

    private getStatusString(status: number): string {
        switch (status) {
            case 0:
                return "Privat";
            case 1:
                return "Öffentlich";
            default:
                return "";
        }
    }

    private setBankAccount(bankAccount: BankAccountInterface): void {
        alt.emitServer("company:changebankaccount", this.companyId, bankAccount.id);
    }

    private setHouse(house: HouseInterface): void {
        alt.emitServer("company:changecompanybuilding", this.companyId, house.id);
    }

    private openCancelContractSecurityDialog(leaseCompanyId: number): void {
        this.isSecurityDialogCancelContractOpen = true;
        this.leaseCompanyId = leaseCompanyId;
    }

    private closeCancelContractSecurityDialog(): void {
        this.isSecurityDialogCancelContractOpen = false;
        this.leaseCompanyId = -1;
    }
    
    private cancelContract(): void {
        alt.emit("phoneleasecompany:cancelcontract", this.companyId, this.leaseCompanyId);
        this.closeCancelContractSecurityDialog();
    }

    private setDeliveryVisibility(): void {
        alt.emitServer("company:setdeliveryvisibility", this.companyId);
    }

    private openLicenesBuyMenu(): void {
        this.isBuyNewLicensesWindowOpen = true;
    }

    private closeLicenesBuyMenu(): void {
        this.isBuyNewLicensesWindowOpen = false;
    }

    private openSellLicenseDialog(license: LicenseInterface): void {
        this.isSellLicenseOpen = true;
        this.licPrice = license.price * 0.5;
        this.showLicense = license.license;
    }

    private openBuyLicenseDialog(license: LicenseInterface): void {
        this.isBuyLicenseOpen = true;
        this.licPrice = license.price;
        this.showLicense = license.license;
    }

    private closeSellLicenseDialog(): void {
        this.isSellLicenseOpen = false;
        this.showLicense = LicensesType.NONE;
        this.licPrice = 0;
    }

    private closeBuyLicenseDialog(): void {
        this.isBuyLicenseOpen = false;
        this.showLicense = LicensesType.NONE;
        this.licPrice = 0;
    }

    private buyLicenses(): void {
        alt.emit("phonecompany:buylicenses", this.companyId, this.showLicense);

        this.closeBuyLicenseDialog();
    }

    private sellLicenses(): void {
        alt.emit("phonecompany:selllicenses", this.companyId, this.showLicense);

        this.closeSellLicenseDialog();
    }

    private back(): void {
        this.closeLicenesBuyMenu();
        this.closeSellLicenseDialog();

        this.$emit("back");
    }
}
</script>

<style scoped lang="scss">
.company-settings {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    background-color: whitesmoke;
    z-index: 200;
}

.company-settings::-webkit-scrollbar {
    display: none;
}

.select-box {
    margin: unset;
    background-color: rgb(204, 204, 204);
    padding: 1vw 0.5vw;
    text-align: left;
    font-size: 0.6vw;
}

.select-box h1 {
    margin: unset;
    font-size: 0.7vw;
}

.lease-company-holder {
    position: relative;
    height: 8vw;
}

.lease-company-box {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;

    margin-top: 0.3vw;
    background-color: rgb(204, 204, 204);
    text-align: left;
    font-size: 0.6vw;
}

.lease-company-box h1 {
    margin: 0.5vw;
    font-size: 0.7vw;
}

.lease-company-box p {
    margin: 0.5vw;
}

.card-link {
    padding-left: 1vw;
}

.delivery-status-visibility-box {
    margin: unset;
    margin-top: 0.3vw;
    background-color: rgb(204, 204, 204);
    padding: 0.5vw;
    text-align: left;
}

.delivery-status-visibility-box:hover {
    background-color: rgb(190, 190, 190);
}

.delivery-status-visibility-box h1 {
    margin: unset;
    font-size: 0.7vw;
}

.delivery-status-visibility-box h2 {
    margin: 0.3vw 0vw;
    font-size: 0.8vw;
    text-align: center;
}

.delivery-status-visibility-box h3 {
    margin: 0.3vw 0vw;
    font-size: 0.6vw;
}

.license-holder {
    position: relative;
    height: 11vw;
}

.licences-box {
    margin: unset;
    height: 100%;
    margin-top: 0.3vw;
    padding: 0.5vw;
    background-color: rgb(204, 204, 204);
    text-align: left;
}

.licences-box h1 {
    padding: 0.2vw;
    margin: 0.1vw 0vw;
    font-size: 0.7vw;
}

.licences-box h2 {
    padding: 0.2vw;
    margin: 0.1vw 0vw;
    font-size: 0.5vw;
}

.licences-box hr {
    margin: 0.1vw 0vw;
}

.licences-scrollbox {
    height: 6.5vw;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        display: none;
    }
}

.license-button {
    background-color: rgb(95, 57, 13);
    color: white !important;
    width: 100%;
    margin-top: 0.5vw;
    padding-bottom: 0.2vw;
    font-size: 0.7vw;
    border: unset;
    border-radius: 0.3vw;

    &:disabled {
        background-color: rgba(56, 53, 53, 0.282);
    }
}

.security-dialog {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.9);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.security-dialog p {
    position: absolute;
    color: white;
    text-align: center;
    font-size: 0.8vw;
    padding: 0.2vw;
    top: 10%;
    transform: translateY(-10%);
}
</style>