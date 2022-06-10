<template>
    <div class='my-delivery-page'>
        <div class='phone-header'>
            <button class='icon-button' type='button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Mein Auftrag</span>
            </button>
        </div>
        <div class='delivery-card'>
            <h1>{{ companyName }}</h1>

            <div v-if='deliveryType === 1'>
                <h2>Anzahl an Produkten gesamt: {{ orderedProducts }} Stück</h2>
                <h2>Produkte noch am Hafen: {{ productsLeft }} Stück</h2>
            </div>

            <div v-if='deliveryType === 3'>
                <h2>Fahrzeug: {{ displayName }}</h2>
            </div>

            <h2>Status der Lieferung: {{ getStatusString(status) }}</h2>
            <p>Unternehmen sehen den Klarnamen sowie Handynummer des Fahrers.</p>
        </div>

        <div class='phone-delivery-button-group'>
            <button class='btn' type='button' @click='stop()'>
                Auftrag abbrechen
            </button>
            <button class='btn' type='button' @click='requestMarker()'>
                Markierung erneuern
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {ProductsDeliveryInterface} from "@/scripts/interfaces/delivery/products-delivery.interface";
import {VehicleDeliveryInterface} from "@/scripts/interfaces/delivery/vehicle-delivery.interface";

export default class MyCurrentDeliveryPage extends Vue {
    private companyName = "";
    private productsLeft = 0;
    private orderedProducts = 0;
    private status = 0;
    private displayName = "";
    private deliveryType = 0;

    public mounted(): void {
        alt.on("delivery:sendmycurrentdelivery", (args: any[]) => this.setup(args[0]));
    }

    public unmounted(): void {
        alt.off("delivery:sendmycurrentdelivery");
    }

    public open(delivery: any = null): void {
        if (delivery === null) {
            alt.emitServer("delivery:getmycurrentdelivery");
            return;
        }

        this.setup(delivery);
    }

    private setup(delivery: any): void {
        this.companyName = delivery.orderGroupName;
        this.deliveryType = delivery.deliveryType;
        this.status = delivery.status;

        if (delivery as ProductsDeliveryInterface) {
            const deliveryData: ProductsDeliveryInterface = delivery;

            this.productsLeft = deliveryData.productsRemaining;
            this.orderedProducts = deliveryData.orderedProducts;
        }

        if (delivery as VehicleDeliveryInterface) {
            this.displayName = delivery.displayName;
        }

        this.$forceUpdate();
    }

    private getStatusString(status: number): string {
        switch (status) {
            case 1:
                return "Angenommen";
            case 2:
                return "Aufgeladen";
            case 3:
                return "Abgeliefert";
            case 4:
                return "Abgeliefert & zurück zum Aufladen";
            default:
                return "";
        }
    }

    private getDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("de-DE", {
            weekday: "long", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private stop(): void {
        alt.emitServer("delivery:stopdelivery");
        this.back();
    }

    private requestMarker(): void {
        alt.emitServer("delivery:requestmarker");
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style lang='scss' scoped>
.my-delivery-page {
    overflow: hidden;
    top: 0;
    width: 100%;
    height: 100%;
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

.delivery-card {
    position: relative;
    background-color: rgb(219, 219, 219);
    padding: 0.5vw;
    margin: 0.5vw;
    border-radius: 0.3vw;
    text-align: left;

    & p {
        margin: unset;
        font-size: 0.6vw;
    }

    & h1 {
        margin: unset;
        font-size: 0.7vw;
    }

    & h2 {
        margin: 0.3vw 0vw;
        font-size: 0.5vw;
        font-weight: 600;
    }

    & h3 {
        margin: unset;
        font-size: 0.5vw;
        text-align: right;
        font-weight: 600;
    }
}
</style>
