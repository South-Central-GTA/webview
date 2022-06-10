<template>
    <div class='company-page'>
        <div v-if='isLoading && !loadedOnce' class='loading'>
            <img class='logo' src='@/assets/images/phone/gov-seal.png' />
            <h1>{{ loadingText }}</h1>
        </div>

        <company-manage ref='companyManage' :hidden='currentTab !== 1' v-on:back='resetTab()' />
        <company-create ref='companyCreate' :hidden='currentTab !== 2' v-on:back='resetTab()' />

        <div class='label'>
            <h1>Unternehmensgründung einfach gestaltet.</h1>
            <h2>Government San Andreas</h2>
        </div>

        <img class='logo' src='@/assets/images/phone/gov-seal.png' />

        <div v-if='hasData'>
            <div v-if='isPlayerInCompany'>
                <div class='phone-gov-button-group'>
                    <button :disabled='!companyReady' class='btn' type='button' @click='openTab(1)'>
                        Mein Unternehmen
                    </button>
                </div>
            </div>
            <div v-else>
                <div class='phone-gov-button-group'>
                    <button class='btn' type='button' @click='openTab(2)'>
                        Unternehmen eröffnen
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import group from "@/scripts/services/group.service";
import CompanyManage from "./Components/CompanyPages/CompanyManagePage.vue";
import CompanyCreate from "./Components/CompanyPages/CompanyCreatePage.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {LicenseInterface} from "@/scripts/interfaces/group/license.interface";
import {CompanyInterface} from "@/scripts/interfaces/group/company.interface";

@Options({
    components: {
        CompanyManage, CompanyCreate,
    },
})
export default class CompanyPage extends Vue {
    @Ref() private readonly companyManage!: CompanyManage;
    @Ref() private readonly companyCreate!: CompanyCreate;
    private company?: CompanyInterface;
    private isPlayerInCompany = false;
    private companyReady = false;
    private hasData = false;
    private currentTab = 0;
    private isLoading = false;
    private loadedOnce = false;
    private loadingText = "";
    private loadingInt = 0;
    private licenses: LicenseInterface[] = [];

    get isCreatingCompany() {
        return this.companyCreate.isCreatingCompany;
    }

    get getTab() {
        return this.currentTab;
    }

    public mounted(): void {
        group
            .getInstance()
            .CompanyChanged.on((company?: CompanyInterface) => this.setup(company));
        this.setup(group.getInstance().Company);

        alt.on("company:setlicensetable", (args: any[]) => this.setLicenseTable(args[0]));
        alt.on("company:resetphoneapp", () => this.resetPhoneApp());
    }

    public unmounted(): void {
        alt.off("company:setlicensetable");
        alt.off("company:resetphoneapp");
    }

    public open(): void {
        if (this.loadedOnce) {
            alt.emitServer("company:requestapp");
        } else {
            setTimeout(() => {
                alt.emitServer("company:requestapp");

                this.isLoading = false;
                this.loadedOnce = true;
            }, 2000);
        }

        this.isLoading = true;

        let step = 0;
        this.loadingText = "Anmeldung läuft ...";

        if (this.loadingInt !== undefined) {
            clearInterval(this.loadingInt);
        }
        this.loadingInt = setInterval(() => {
            if (step === 0) {
                this.loadingText = "Anmeldung läuft .";
            }
            if (step === 1) {
                this.loadingText = "Anmeldung läuft ..";
            }
            if (step === 2) {
                this.loadingText = "Anmeldung läuft ...";
            }

            step++;
            if (step === 3) {
                step = 0;
            }
            if (!this.isLoading) {
                clearInterval(this.loadingInt);
            }
        }, 500);
    }

    public resetTab(): void {
        if (this.currentTab === 1 && this.companyManage.getCurrentTab !== 0) {
            this.companyManage.resetTab();
            return;
        }

        this.openTab(0);
    }

    public resetLoading(): void {
        this.isLoading = false;
        this.loadedOnce = false;
    }

    private setup(company?: CompanyInterface): void {
        if (company !== null && company !== undefined) {
            this.company = company;
            this.isPlayerInCompany = true;
            this.companyReady = company.status === 1;

            if (this.currentTab === 1) {
                this.companyManage.setup(this.company, this.licenses);
            }
        } else {
            this.isPlayerInCompany = false;
            this.openTab(0);
        }

        this.hasData = true;
    }

    private setLicenseTable(licenses: LicenseInterface[]): void {
        this.licenses = licenses;
    }

    private resetPhoneApp(): void {
        this.openTab(0);
        this.isPlayerInCompany = false;
    }

    private openTab(id: number): void {
        if (id === 1) {
            if (this.company !== undefined) {
                this.companyManage.setup(this.company, this.licenses);
            }
        }

        this.currentTab = id;
    }
}
</script>

<style lang='scss' scoped>
.company-page {
    overflow: hidden;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background: linear-gradient(
            rgba(255, 234, 176, 0.5),
            rgba(255, 234, 176, 0.5)
    ),
    url("../../../assets/images/patterns/double-bubble.png");

    background-position: center center;
    background-size: 25vw;
}

.loading {
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background: linear-gradient(
            rgba(255, 234, 176, 0.5),
            rgba(255, 234, 176, 0.5)
    ),
    url("../../../assets/images/patterns/double-bubble.png");

    background-position: center center;
    background-size: 25vw;
    z-index: 100;
}

.loading h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1vw;
    width: 100%;
    color: var(--gray);
}

.loading .logo {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 5vw;
}

.logo {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 25%;
}

.phone-button-group {
    padding-bottom: 0.4vw;
}

.label {
}

h1 {
    padding-top: 2vw;
    font-size: 1vw;
}

h2 {
    font-size: 0.9vw;
}
</style>
