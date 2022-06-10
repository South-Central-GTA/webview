<template>
    <div class='hud'>
        <h1 class='disclamer'>Repräsentiert nicht den finalen Stand des Servers</h1>
        <div v-if='active' class='top-right'>
            <div class='row'>
                <div class='col-12'>
                    <h5 class='fs-5 text-end money-color'>{{ money }}</h5>
                </div>
            </div>
        </div>
        <div v-if='streetName && active' class='bottom-left' v-bind:class="{ 'slide-down': isDown, 'slide-up': !isDown }">
            <div class='row'>
                <div class='col-12'>
                    <h5>{{ streetName }}</h5>
                </div>
                <div class='col-5'>
                    <h6 class='text-center float-start'>{{ direction }}</h6>
                </div>
                <div class='col-7'>
                    <h6 class='text-center float-end'>{{ zone }}</h6>
                </div>

                <div v-if='armor == 0' class='col-12'>
                    <div class='progress mt-2' style='height: 0.4vw'>
                        <div class='progress-bar bg-success' v-bind:style="{ width: health + '%' }"></div>
                    </div>
                </div>
                <div v-if='armor != 0' class='col-6'>
                    <div class='progress mt-2' style='height: 0.4vw'>
                        <div class='progress-bar bg-success' v-bind:style="{ width: health + '%' }"></div>
                    </div>
                </div>

                <div v-if='armor != 0' class='col-6'>
                    <div class='progress mt-2' style='height: 0.4vw'>
                        <div class='progress-bar bg-blue' v-bind:style="{ width: armor + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if='isFreecam'>
            <div class='center'>
                <img class='crosshair' src='@/assets/images/crosshair.png' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";

export default class Hud extends Vue {
    private active = true;
    private zone = "";
    private direction = "";
    private streetName = "";
    private money = "";
    private date = "";

    private health = 0;
    private armor = 0;

    private isDown = true;
    private isFreecam = false;

    private timeInterval: any;

    public mounted(): void {
        alt.emit("hud:ready");

        alt.on("hud:updatehealth", (health: number, armor: number) => this.updateHealth(health, armor));
        alt.on("hud:sendposition",
            (zone: string, direction: string, streetName: string, crossingStreetName: string) => this.updatePosition(
                zone, direction, streetName, crossingStreetName));
        alt.on("hud:setmoney", (amount: number) => this.setMoneyUI(amount));
        alt.on("hud:toggleui", (state: boolean) => this.toggleUI(state));
        alt.on("hud:moveup", () => this.moveUp());
        alt.on("hud:movedown", () => this.moveDown());
        alt.on("hud:setfreecam", (state: boolean) => (this.isFreecam = state));

        this.updateDate();
        this.timeInterval = setInterval(() => {
            this.updateDate();
        }, 1000);
    }

    public unmounted(): void {
        alt.off("hud:updatehealth");
        alt.off("hud:sendposition");
        alt.off("hud:setmoney");
        alt.off("hud:toggleui");
        alt.off("hud:moveup");
        alt.off("hud:movedown");
        alt.off("hud:setfreecam");
    }

    private destroyed(): void {
        clearInterval(this.timeInterval);
    }

    private updateHealth(health: number, armor: number): void {
        this.health = health - 100;
        this.armor = armor;
    }

    private updateDate(): void {
        const dt = new Date();
        dt.setHours(dt.getHours() - 2);

        let day = "";

        switch (dt.getDay()) {
            case 0:
                day = "Sonntag";
                break;
            case 1:
                day = "Montag";
                break;
            case 2:
                day = "Dienstag";
                break;
            case 3:
                day = "Mittwoch";
                break;
            case 4:
                day = "Donnerstag";
                break;
            case 5:
                day = "Freitag";
                break;
            case 6:
                day = "Samstag";
                break;
            default:
                day = "Error";
                break;
        }

        this.date = day + " | " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);
    }

    private updatePosition(zone: string, direction: string, streetName: string, crossingStreetName: string): void {
        this.zone = zone;
        this.direction = direction;

        if (crossingStreetName !== "") {
            this.streetName = streetName + " - " + crossingStreetName;
        } else {
            this.streetName = streetName;
        }
    }

    private toggleUI(state: boolean): void {
        this.active = state;
    }

    private moveUp(): void {
        this.isDown = false;
    }

    private moveDown(): void {
        this.isDown = true;
    }

    private setMoneyUI(amount: number): void {
        this.money = "$" + amount;
    }
}
</script>

<style lang='scss' scoped>
.slide-down {
    margin-bottom: 0;
}

.slide-up {
    margin-bottom: 11%;
}

.bottom-left {
    position: absolute;
    bottom: 1%;
    left: 2.5%;
    width: 14.25vw;
    color: white;
    background-color: rgba($color: black, $alpha: 0.5);
    border-radius: 0.25vw;
}

.top-right {
    position: absolute;
    top: 2%;
    right: 1.4%;
    color: white;
    background-color: rgba($color: black, $alpha: 0.5);
    border-radius: 0.25vw;
}

.disclamer {
    position: absolute;
    top: 5%;
    left: 50%;

    transform: translate(-50%, 0%);

    opacity: 0.2;
    font-size: 1.5vw;
}

h5 {
    margin: unset;
    font-size: 0.75vw;
}

h6 {
    font-size: 0.5vw;
    margin: unset;
}

.row {
    padding: 0.25vw;
}

.progress {
    background-color: rgba(0, 0, 0, 0.5);
}

.crosshair {
    width: 25px;
    height: 25px;
}
</style>
