<template>
    <div class='delivery-page'>
        <div v-if='isLoading && !loadedOnce' class='loading'>
            <font-awesome-icon class='order-products-icon' icon='shipping-fast' />
            <h1 v-if="errorMessage == ''">{{ loadingText }}</h1>
            <h2 v-else>{{ errorMessage }}</h2>
        </div>

        <order-products-page ref='orderProducts' :hidden='currentTab != 1' v-on:back='resetTab()' />
        <open-deliveries-page ref='openDeliveries' :hidden='currentTab != 2' v-on:back='resetTab()' />
        <my-deliveries-page ref='myDeliveries' :hidden='currentTab != 3' v-on:back='resetTab()' />
        <my-current-delivery-page ref='myCurrentDelivery' :hidden='currentTab != 4' v-on:back='resetTab()' />

        <div class='header-image'>
            <h1>Los Santos<br />Shipping Service</h1>
        </div>
        <div class='phone-delivery-button-group'>
            <button class='btn order-products-button' type='button' @click='openTab(1)'>
                <font-awesome-icon class='order-products-icon' icon='shipping-fast' />
                <h1>Produkte bestellen</h1>
            </button>
            <button class='btn' type='button' @click='openTab(3)'>
                Meine Bestellungen
            </button>
            <button v-if='!hasOpenDelivery' :disabled='!canSeeOpenDeliveries' class='btn' type='button' @click='openTab(2)'>
                Offene Aufträge
            </button>
            <button v-if='hasOpenDelivery' class='btn' type='button' @click='openTab(4)'>
                Mein Auftrag
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import group from "@/scripts/services/group.service";
import OrderProductsPage from "@/components/Phone/Pages/Components/DeliveryPages/OrderProductsPage.vue";
import MyDeliveriesPage from "@/components/Phone/Pages/Components/DeliveryPages/MyDeliveriesPage.vue";
import OpenDeliveriesPage from "@/components/Phone/Pages/Components/DeliveryPages/OpenDeliveriesPage.vue";
import MyCurrentDeliveryPage from "@/components/Phone/Pages/Components/DeliveryPages/MyCurrentDelivery.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {CompanyInterface} from "@/scripts/interfaces/group/company.interface";

@Options({
    components: {
        OrderProductsPage, MyDeliveriesPage, OpenDeliveriesPage, MyCurrentDeliveryPage,
    },
})
export default class DeliveryPage extends Vue {
    @Ref() private readonly orderProducts!: OrderProductsPage;
    @Ref() private readonly openDeliveries!: OpenDeliveriesPage;
    @Ref() private readonly myDeliveries!: MyDeliveriesPage;
    @Ref() private readonly myCurrentDelivery!: MyCurrentDeliveryPage;
    private isLoading = false;
    private loadedOnce = false;
    private currentTab = 0;
    private errorMessage = "";
    private loadingText = "";
    private canSeeOpenDeliveries = false;
    private products = 0;
    private maxProducts = 1000;
    private loadingInt = 0;
    private hasOpenDelivery = false;

    get getTab() {
        return this.currentTab;
    }

    public mounted(): void {
        group
            .getInstance()
            .CompanyChanged.on((company?: CompanyInterface) => this.updateCompany(company));

        alt.on("delivery:setup", (args: any[]) => this.setup(args[0], args[1], args[2], args[3], args[4]));
        alt.on("delivery:openmydelivery", (args: any[]) => this.openMyDelivery(args[0]));
        alt.on("delivery:stopmydelivery", () => this.stopMyDelivery());
    }

    public unmounted(): void {
        alt.off("delivery:setup");
        alt.off("delivery:openmydelivery");
        alt.off("delivery:stopmydelivery");
    }

    public open(): void {
        if (this.loadedOnce) {
            alt.emitServer("delivery:requestmenu");
        } else {
            setTimeout(() => {
                alt.emitServer("delivery:requestmenu");
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
        if (this.currentTab != 0) {
            this.openTab(0);
            return;
        }

        this.openTab(0);
    }

    public resetLoading(): void {
        this.isLoading = false;
        this.loadedOnce = false;
    }

    private setup(canUseThisApp: boolean, canSeeOpenDeliveries: boolean, hasOpenDelivery: boolean, products: number, maxProducts: number): void {
        if (!canUseThisApp) {
            this.errorMessage = "Dein Account hat nicht genügend Rechte.";
            return;
        }

        this.products = products;
        this.maxProducts = maxProducts;

        this.canSeeOpenDeliveries = canSeeOpenDeliveries;
        this.hasOpenDelivery = hasOpenDelivery;

        this.isLoading = false;
        this.loadedOnce = true;
    }

    private updateCompany(company: CompanyInterface | undefined): void {
        if (company !== null && company !== undefined) {
            this.orderProducts?.updateProducts(company.products);
        }
    }

    private openMyDelivery(delivery: any): void {
        this.openTab(4);
        this.hasOpenDelivery = true;
        this.myCurrentDelivery.open(delivery);
    }

    private stopMyDelivery(): void {
        this.openTab(0);
        this.hasOpenDelivery = false;
    }

    private openTab(id: number): void {
        if (id === 1) {
            this.orderProducts.open(this.products, this.maxProducts);
        }
        if (id === 2) {
            this.openDeliveries.open();
        }
        if (id === 3) {
            this.myDeliveries.open();
        }
        if (id === 4) {
            this.myCurrentDelivery.open();
        }

        this.currentTab = id;
    }
}
</script>

<style lang='scss' scoped>
.delivery-page {
    height: 100%;
    text-align: center;

    background: linear-gradient(
            rgba(100, 237, 255, 0.7),
            rgba(100, 237, 255, 0.7)
    ),
    url("../../../assets/images/patterns/shipping.png");

    background-position: center center;
    background-size: 15vw;
}

.loading {
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    text-align: center;

    background: linear-gradient(
            rgba(100, 237, 255, 0.7),
            rgba(100, 237, 255, 0.7)
    ),
    url("../../../assets/images/patterns/shipping.png");

    background-position: center center;
    background-size: 15vw;
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

.loading h2 {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1vw;
    width: 100%;
    color: var(--gray);
}

.loading .order-products-icon {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5vw;
    color: var(--gray);
}

.header-image {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url("../../../assets/images/phone/shipping-banner.jpg") center center;
    background-size: cover;
    height: 6vw;
}

.header-image h1 {
    margin: unset;
    padding-top: 1.5vw;
    color: white;
    font-size: 1.2vw;
    font-style: italic;
}

.order-products-button {
    height: 10.5vw !important;
}

.order-products-button h1 {
    font-size: 1vw;
    font-weight: lighter;
}

.order-products-icon {
    font-size: 5vw;
    padding-top: 0.9vw;
    padding-bottom: 0.9vw;
}
</style>
