<template>
    <div class='my-deliveries-page'>
        <div class='phone-header'>
            <button class='icon-button' type='button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Meine Bestellungen</span>
            </button>
        </div>

        <div v-if='loadedData'>
            <div v-if='deliveries.length !== 0' class='delivery-block'>
                <div v-for='delivery in deliveries' v-bind:key='delivery.id' class='delivery-card'>
                    <div v-if='delivery.status === 0 || delivery.status === 3'>
                        <button class='remove-button icon-button' type='button' @click='remove(delivery.id)'>
                            <font-awesome-icon class='delete-icon' icon='trash' />
                        </button>
                    </div>

                    <h1>{{ getHeaderString(delivery.deliveryType) }}</h1>

                    <hr />

                    <div v-if='delivery.deliveryType === 1'>
                        <h2>Anzahl an Produkte: {{ delivery.orderedProducts }} Stück</h2>
                        <h2 v-if='delivery.status !== 3'>
                            Produkte noch am Hafen: {{ delivery.productsRemaining }} Stück </h2>
                    </div>

                    <div v-if='delivery.deliveryType === 3'>
                        <h2>Fahrzeug: {{ delivery.displayName }}</h2>
                    </div>

                    <h2>Status der Lieferung: {{ getStatusString(delivery.status) }}</h2>

                    <div v-if='delivery.status !== 0'>
                        <h2>Fahrer: {{ delivery.supplierFullName }}</h2>
                        <h2>
                            Handynummer: {{ getCorrectFormat(delivery.supplierPhoneNumber) }} </h2>
                    </div>

                    <hr />
                    <h3>{{ getCorrectDate(delivery.createdAtJson) }}</h3>
                </div>
            </div>
            <div v-else>
                <h1 class='error-message'>Das Unternehmen hat keine Bestellungen.</h1>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {DeliveryInterface} from "@/scripts/interfaces/delivery/delivery.interface";

export default class MyDeliveriesPage extends Vue {
    private deliveries: DeliveryInterface[] = [];
    private loadedData = false;

    public mounted(): void {
        alt.on("delivery:sendgroupdeliveries", (args: any[]) => this.setup(args[0]));
    }

    public unmounted(): void {
        alt.off("delivery:sendgroupdeliveries");
    }

    public open(): any {
        alt.emitServer("delivery:getgroupdeliveries");
    }

    private setup(deliveries: DeliveryInterface[]): void {
        this.deliveries = deliveries;
        this.loadedData = true;
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

    private getStatusString(status: number): string {
        switch (status) {
            case 0:
                return "Offen";
            case 1:
                return "Angenommen";
            case 2:
                return "Aufgeladen";
            case 3:
                return "Abgeliefert";
            case 4:
                return "Abgeliefert & zurück zum Aufladen";
            case 5:
                return "Pausiert ((Fahrer offline))";
            default:
                return "";
        }
    }

    private getCorrectFormat(numberString: string): string {
        return (numberString.substring(0, 3) + " - " + numberString.substring(3, numberString.length));
    }

    private getCorrectDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            weekday: "long", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private remove(id: number): void {
        alt.emitServer("delivery:canceldelivery", id);
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style lang='scss' scoped>
.my-deliveries-page {
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
    background-color: rgb(219, 219, 219);
    padding: 0.5vw;
    margin: 0.5vw;
    border-radius: 0.3vw;
    text-align: left;
}

.delivery-card h1 {
    margin: unset;
    font-size: 0.7vw;
}

.delivery-card h2 {
    margin: 0.3vw 0vw;
    font-size: 0.5vw;
    font-weight: 600;
}

.delivery-card h3 {
    margin: unset;
    font-size: 0.5vw;
    text-align: right;
    font-weight: 600;
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
