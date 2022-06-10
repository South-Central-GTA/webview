<template>
    <div class='open-deliveries-page'>
        <div class='phone-header'>
            <button class='icon-button' type='button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Offene Aufträge</span>
            </button>
        </div>

        <div v-if='loadedData && deliveries.length !== 0' class='delivery-block'>
            <button v-for='delivery in deliveries' v-bind:key='delivery.id' class='btn delivery-card' type='button' @click='selectDelivery(delivery.id)'>
                <h1>{{ getHeaderString(delivery.deliveryType) }} #{{ delivery.id }}</h1>

                <hr />
                <h2>Unternehmen: {{ delivery.orderGroupName }}</h2>

                <div v-if='delivery.deliveryType === 1'>
                    <h2>Anzahl an Produkte: {{ delivery.productsRemaining }} Stück.</h2>
                </div>

                <div v-if='delivery.deliveryType === 3'>
                    <h2>Fahrzeug: {{ delivery.displayName }}</h2>
                </div>

                <hr />
                <h3>{{ getCorrectDate(delivery.createdAtJson) }}</h3>
            </button>
        </div>
        <div v-else>
            <h1 class='error-message'>Es gibt keine offenen Bestellungen.</h1>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {DeliveryInterface} from "@/scripts/interfaces/delivery/delivery.interface";

export default class OpenDeliveriesPage extends Vue {
    private deliveries: DeliveryInterface[] = [];
    private loadedData = false;
    private companyId = 0;

    public mounted(): void {
        alt.on("delivery:sendopendeliveries", (args: any[]) => this.updateDeliveries(args[0]));
    }

    public unmounted(): void {
        alt.off("delivery:sendopendeliveries");
    }

    public open(): void {
        alt.emitServer("delivery:getopendeliveries");
    }

    protected updateDeliveries(deliveries: DeliveryInterface[]): void {
        this.deliveries = deliveries;
        this.loadedData = true;
    }

    private selectDelivery(deliveryId: number): void {
        alt.emit("phonedelivery:selectdelivery", deliveryId);
    }

    private getHeaderString(type: number): string {
        switch (type) {
            case 0:
                return "Bestellung";
            case 1:
                return "Produktbestellung";
            case 2:
                return "Flüssigkeitbestellung";
            case 3:
                return "Fahrzeugbestellung";
            default:
                return "";
        }
    }

    private getCorrectDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            weekday: "long", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style lang='scss' scoped>
.open-deliveries-page {
    overflow: hidden;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
    text-align: center;

    background: linear-gradient(
            rgba(100, 237, 255, 0.7),
            rgba(100, 237, 255, 0.7)
    ),
    url("../../../../../assets/images/patterns/shipping.png");

    background-position: center center;
    background-size: 15vw;
    z-index: 100;
}

.delivery-block {
    position: absolute;
    overflow-y: auto;
    height: 20.9vw;
    width: 100%;
}

.delivery-block::-webkit-scrollbar {
    display: none;
}

.delivery-card {
    position: relative;
    background-color: rgb(221, 221, 221);
    margin-top: 0.5vw;
    padding: 0.5vw;
    border-radius: 0.3vw;
    text-align: left;
    pointer-events: all;
    width: 90%;
    color: black !important;
}

.delivery-card:hover {
    background-color: rgb(206, 206, 206);
}

.delivery-card h1 {
    margin: unset;
    font-size: 0.7vw;
    pointer-events: none;
}

.delivery-card h2 {
    margin: 0.3vw 0vw;
    font-size: 0.5vw;
    font-weight: 600;
    pointer-events: none;
}

.delivery-card h3 {
    margin: unset;
    font-size: 0.5vw;
    text-align: right;
    font-weight: 600;
    pointer-events: none;
}

.delivery-card .remove-button {
    padding: unset;
    position: absolute;
    right: 0.25vw;
    top: 0.25vw;
    font-size: 0.7vw;
}

.error-message {
    font-size: 0.8vw;
    padding-top: 5vw;
    font-weight: 800;
}
</style>
