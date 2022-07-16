<template>
    <div class='vehicle-service'>
        <notifications-holder ref='notificationsHolder' class='unselectable' />

        <nav class='navbar navbar-expand-lg navbar-dark sc-dark'>
            <a class='navbar-brand px-4'>Fahrzeug Service</a>
            <ul class='navbar-nav'>
                <li class='nav-item' style='padding-left: 1vw; font-size: 1.3vw'>
                    <a :disabled='blockByButton' class='nav-link' @click='closeMenu()'>
                        <font-awesome-icon icon='chevron-left' />
                    </a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 0 }'>
                    <a class='nav-link' @click='openMenu(0)'>Reperaturen</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 1 }'>
                    <a class='nav-link' @click='openMenu(1)'>Lackierung</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 2 }'>
                    <a class='nav-link' @click='openMenu(2)'>Tuning</a>
                </li>
            </ul>
        </nav>
        
        <div class='float-end'>
            <div class='shopping-basket sc-card'>
                <div class='card-header text-white'>Einkaufskorb</div>
                <ul class='list-group mb-3'>
                    <div class='scrollable'>
                        <li v-for='(purchaseOrder, index) in purchases' v-bind:key='index' class='list-group-item sc-card text-white d-flex justify-content-between lh-sm'>
                            <div class='float-start'>
                                <h6 class='my-0'>{{ purchaseOrder.name }}</h6>
                                <small class='text-white-50'>{{ purchaseOrder.description }}</small>
                            </div>
                            <div class='float-end'>
                                <span class='text-white-50'>{{ purchaseOrder.moneyCosts.toFixed() }} $</span>
                            </div>
                        </li>
                    </div>

                    <li class='list-group-item sc-card text-white'>
                        <div class='float-start'>
                            <span>Unternehmens Produktelager <strong>{{ companyProductCount.toFixed() }}</strong> Stück</span>
                        </div>
                    </li>
                    
                    <li class='list-group-item sc-card text-white'>
                        <div class='float-start'>
                            <span>Gesamter Preis <strong>{{ moneyCosts.toFixed() }} $</strong></span>
                        </div>
                        <div class='float-end'>
                            <span>Produktkosten <strong>{{ productCosts.toFixed() }}</strong> Stück</span>
                        </div>
                    </li>
                    
                    <div class='p-2'>
                        <button :disabled='blockByButton' class='btn btn-primary w-100' type='button' @click='requestBuy()'>
                            Bestellung kaufen
                            <font-awesome-icon icon='plus' />
                        </button>
                    </div>
                </ul>

                <div>
                    <p class='text-white p-2 m-0'>Fahrzeug drehen</p>
                    <div class='row px-2'>
                        <div class='col-6'>
                            <button class='btn rotate-icon w-100 btn-secondary' type='button' @mousedown='rotate(-1)' @mouseup='stopRotate()'>
                                <font-awesome-icon icon='redo' />
                            </button>
                        </div>
                        <div class='col-6'>
                            <button class='btn rotate-icon w-100 btn-secondary' type='button' @mousedown='rotate(1)' @mouseup='stopRotate()'>
                                <font-awesome-icon icon='undo' />
                            </button>
                        </div>
                    </div>
                    
                    <p class='text-white p-2 m-0'>Kamera</p>
                    <p class='text-muted p-2 m-0'>Rechte-Maustaste gedrückthalten um deine Kamera zu drehen.</p>
                </div>
            </div>
        </div>


        <div class='sc-card vehicleservice-box text-white'>
            <vehicle-repair :hidden='tabIndex !== 0' />
            <vehicle-color :hidden='tabIndex !== 1' />
            <vehicle-tuning ref='tuning' :hidden='tabIndex !== 2' />
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import NotificationsHolder from "@/components/Notification/NotificationsHolder.vue";
import {Ref} from "vue-property-decorator";
import {NotificationPositionTypes} from "@/scripts/enums/notification-position.types";
import {VehicleServicePurchaseInterface} from "@/scripts/interfaces/vehicle-service-purchase.interface";
import alt from "@/scripts/services/alt.service";
import VehicleRepair from "@/components/VehicleService/VehicleRepair.vue";
import {playerVehicleWorkshopService} from '@/scripts/services/player-vehicle-workshop.service';
import VehicleColor from "@/components/VehicleService/VehicleColor.vue";
import VehicleTuning from "@/components/VehicleService/VehicleTuning.vue";
import {VehicleServiceInfoDataInterface} from "@/scripts/interfaces/vehicle-service-info-data.interface";

@Options({
    components: {
        VehicleTuning,
        VehicleRepair,
        VehicleColor,
        NotificationsHolder,
    },
})
export default class VehicleService extends Vue {
    @Ref() private readonly notificationsHolder!: NotificationsHolder;
    @Ref() private readonly tuning!: VehicleTuning;

    private tabIndex = 0;

    private moneyCosts = 0;
    private productCosts = 0;
    private companyProductCount = 0;
    private purchases: VehicleServicePurchaseInterface[] = [];

    private blockByButton = true;
    
    public mounted(): void {
        alt.emit("vehicleservice:ready");
        alt.on("vehicleservice:setup", (data: VehicleServiceInfoDataInterface) => this.setup(data));
        alt.on("vehicleservice:updateproducts", (products: number) => this.onUpdateProducts(products));

        this.notificationsHolder.setPosition(NotificationPositionTypes.RIGHT);
        
        playerVehicleWorkshopService.onMoneyCostsChanged.on((value: number) => {
            this.moneyCosts = value;
        });

        playerVehicleWorkshopService.onProductCostsChanged.on((value: number) => {
            this.productCosts = value;
        });

        playerVehicleWorkshopService.onCompanyProductCountChanged.on((value: number) => {
            this.companyProductCount = value;
        });

        playerVehicleWorkshopService.onPurchasesChanged.on((value: VehicleServicePurchaseInterface[]) => {
            this.purchases = value;
            
            this.blockByButton = this.purchases.length < 1;
        });
    }
    
    public unmounted(): void {
        alt.off("vehicleservice:setup");

        playerVehicleWorkshopService.onMoneyCostsChanged.off((value: number) => {
            this.moneyCosts = value;
        });

        playerVehicleWorkshopService.onProductCostsChanged.off((value: number) => {
            this.productCosts = value;
        });

        playerVehicleWorkshopService.onCompanyProductCountChanged.off((value: number) => {
            this.companyProductCount = value;
        });

        playerVehicleWorkshopService.onPurchasesChanged.off((value: VehicleServicePurchaseInterface[]) => {
            this.purchases = value;
        });
    }

    private setup(data: VehicleServiceInfoDataInterface): void {
        playerVehicleWorkshopService.setup(data);
        this.tuning.setup(data.vehicleModelName);
    }
    
    private onUpdateProducts(products: number): void {
        playerVehicleWorkshopService.updateProducts(products);
    }
    
    private openMenu(index: number): void {
        if (this.tabIndex === index) {
            return;
        }

        this.tabIndex = index;
    }
    
    private closeMenu(): void {
        this.blockByButton = true;
        alt.emit("vehicleservice:close");
    }

    private rotate(dir: number): void {
        alt.emit("vehicleservice:rotate", dir);
    }

    private stopRotate(): void {
        alt.emit("vehicleservice:rotatestop");
    }
    
    private requestBuy(): void {
        this.blockByButton = true;
        alt.emit("vehicleservice:requestpurchase",
            JSON.stringify([...playerVehicleWorkshopService.getOrders.values()]));
    }
}
</script>

<style lang='scss' scoped>
.navbar-brand {
    padding: 0;
}

.navbar-nav .nav-link {
    padding-top: 0;
    padding-bottom: 0;
    height: 50px;
    line-height: 50px;
    color: white;

    &:hover {
        cursor: pointer;
    }
    
    &:disabled {
        color: rgba(128, 128, 128, 0.37) !important;
    }
}

.vehicle-service {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.vehicleservice-box {
    height: 90%;
    width: 30%;
    margin: 1vw;
}

.active {
    font-weight: 500;
}

.shopping-basket {
    margin: 1vw;
    width: 20vw;
}

.scrollable {
    overflow-y: auto;
    height: 25vw;
}

.scrollable::-webkit-scrollbar {
    display: none;
}

.rotate-box {
    position: absolute;
    transform: translate(-50%, 0%);
    bottom: 0;
    right: 0;
    margin: 1vw 30vw;
    z-index: 100;
}
</style>
