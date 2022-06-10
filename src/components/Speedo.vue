<template>
    <div :hidden='!active' class='speedo'>
        <canvas ref='backgroundCanvas' height='600' width='600'></canvas>
        <canvas ref='foregroundCanvas' height='600' width='600'></canvas>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {TwoDValueInterface} from "@/scripts/interfaces/two-d-value.interface";

interface VehicleInformationInterface {
    speed: number;
    gear: number;
    rpm: number;
    fuelPercentage: number;
    engine: boolean;
    drivenKilometre: number;
}

export default class Speedo extends Vue {
    @Ref() private foregroundCanvas!: HTMLCanvasElement;
    @Ref() private backgroundCanvas!: HTMLCanvasElement;

    private foregroundCtx!: CanvasRenderingContext2D;
    private backgroundCtx!: CanvasRenderingContext2D;

    private active = false;

    private readonly radius = 140;
    private readonly center: TwoDValueInterface = {
        x: 400, y: 400,
    };

    private gear = 1;
    private speed = 42;
    private drivenKilometre = 8888;
    private rpm = 0;
    private fuelPercentage = 0;
    private engineOn = false;

    // Function gets called when view is ready and loaded.
    public mounted(): void {
        alt.on("speedo:toggleui", (state: boolean) => this.toggleVehicleUI(state));
        alt.on("speedo:getinformation",
            (vehicleInformations: VehicleInformationInterface) => this.setVehicleInformations(vehicleInformations));

        const foregroundCtx = this.foregroundCanvas?.getContext("2d");
        if (foregroundCtx) {
            this.foregroundCtx = foregroundCtx;
        }

        const backgroundCtx = this.backgroundCanvas?.getContext("2d");
        if (backgroundCtx) {
            this.backgroundCtx = backgroundCtx;
        }

        this.drawSpeedo();
    }

    public unmounted(): void {
        alt.off("speedo:toggleui");
        alt.off("speedo:getinformation");
    }

    private drawSpeedo(): void {
        this.drawOuterCircleBackground();
        this.drawInnerCircleBackground();

        if (this.drivenKilometre !== -1) {
            this.drawDrivenKilometreBox();
        }

        this.drawSpeedBox();
        this.drawFuelBox();
        this.drawGearBox();
        this.drawUpperSecondCircle();
        this.drawUpperRedCircle();
        this.drawTicks();
        this.drawUpperCircle();

        this.drawFuelNeedle();

        (document as any).fonts.load("22px Play").then(() => {
            this.drawTextMarkers();
            // this.drawSpeedUnitText();
            this.drawTextFuel();
        });

        if (this.drivenKilometre !== -1) {
            (document as any).fonts.load("22px Segment7").then(() => {
                this.drawDrivenKilometrePlaceholderText();
            });

            (document as any).fonts.load("14px Play").then(() => {
                this.drawDrivenKilometrePlaceholderUnit();
            });
        }

        (document as any).fonts.load("12px Play").then(() => {
            this.drawSpeedPlaceholderUnitText();
        });

        (document as any).fonts.load("52px Segment7").then(() => {
            this.drawSpeedPlaceholderText();
        });

        (document as any).fonts.load("28px Segment7").then(() => {
            this.drawGearPlaceholderText();
        });
    }

    private drawOuterCircleBackground(): void {
        this.backgroundCtx.beginPath();
        this.backgroundCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        this.backgroundCtx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        this.backgroundCtx.lineWidth = 25;
        this.backgroundCtx.stroke();
    }

    private drawInnerCircleBackground(): void {
        this.backgroundCtx.beginPath();
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.arc(this.center.x, this.center.y, this.radius - 12, 0, Math.PI * 2);
        this.backgroundCtx.fill();
    }

    private drawDrivenKilometreBox(): void {
        this.backgroundCtx.fillRect(this.center.x - 50, this.center.y + 75, 100, 21);
    }

    private drawSpeedBox(): void {
        this.backgroundCtx.fillRect(this.center.x - 60, this.center.y + 20, 120, 50);
    }

    private drawFuelBox(): void {
        this.backgroundCtx.beginPath();
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.arc(this.center.x - 42, this.center.y - 25, 25, Math.PI - 0.5, 0.5);
        this.backgroundCtx.fill();

        this.backgroundCtx.beginPath();
        this.backgroundCtx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        this.backgroundCtx.arc(this.center.x - 42, this.center.y - 25, 27, Math.PI - 0.5, 0.5);
        this.backgroundCtx.lineWidth = 4;
        this.backgroundCtx.stroke();
    }

    private drawGearBox(): void {
        this.backgroundCtx.fillRect(this.center.x, this.center.y - 65, 35, 35);
    }

    private drawTicks(): void {
        this.drawFuelTicks();
        this.drawLargeTicks();
        this.drawSmallTicks();
    }

    private drawFuelTicks(): void {
        const tickValue = 24;
        const tickRadius = this.radius * 0.208;

        for (let tick = -20; tick < 210; tick += 44) {
            const rad = this.degToRad(tick);

            const onArchX = tickRadius - Math.cos(rad) * tickValue;
            const onArchY = tickRadius - Math.sin(rad) * tickValue;
            const innerTickX = tickRadius - Math.cos(rad) * tickRadius;
            const innerTickY = tickRadius - Math.sin(rad) * tickRadius;

            const fromX = this.center.x - 42 - tickRadius + onArchX;
            const fromY = this.center.y - 25 - tickRadius + onArchY;

            const toX = this.center.x - 42 - tickRadius + innerTickX;
            const toY = this.center.y - 25 - tickRadius + innerTickY;

            // Create a line expressed in JSON
            this.backgroundCtx.beginPath();
            this.backgroundCtx.moveTo(fromX, fromY);
            this.backgroundCtx.lineTo(toX, toY);
            this.backgroundCtx.lineWidth = 2;
            this.backgroundCtx.strokeStyle = "#fff";
            this.backgroundCtx.stroke();
        }
    }

    private drawSmallTicks(): void {
        const tickvalue = 130;
        const tickRadius = this.radius * 1.07;

        for (let tick = -10; tick < 210; tick += 22) {
            const rad = this.degToRad(tick);

            const onArchX = tickRadius - Math.cos(rad) * tickvalue;
            const onArchY = tickRadius - Math.sin(rad) * tickvalue;
            const innerTickX = tickRadius - Math.cos(rad) * tickRadius;
            const innerTickY = tickRadius - Math.sin(rad) * tickRadius;

            const fromX = this.center.x - tickRadius + onArchX;
            const fromY = this.center.y - tickRadius + onArchY;

            const toX = this.center.x - tickRadius + innerTickX;
            const toY = this.center.y - tickRadius + innerTickY;

            // Create a line expressed in JSON
            this.backgroundCtx.beginPath();
            this.backgroundCtx.moveTo(fromX, fromY);
            this.backgroundCtx.lineTo(toX, toY);
            this.backgroundCtx.lineWidth = 3;
            this.backgroundCtx.strokeStyle = "#fff";
            this.backgroundCtx.stroke();
        }
    }

    private drawLargeTicks(): void {
        const tickValue = 120;
        const tickRadius = this.radius * 1.07;

        for (let tick = -20; tick < 210; tick += 22) {
            const rad = this.degToRad(tick);

            const onArchX = tickRadius - Math.cos(rad) * tickValue;
            const onArchY = tickRadius - Math.sin(rad) * tickValue;

            const innerTickX = tickRadius - Math.cos(rad) * tickRadius;
            const innerTickY = tickRadius - Math.sin(rad) * tickRadius;

            const fromX = this.center.x - tickRadius + onArchX;
            const fromY = this.center.y - tickRadius + onArchY;

            const toX = this.center.x - tickRadius + innerTickX;
            const toY = this.center.y - tickRadius + innerTickY;

            // Create a line expressed in JSON
            this.backgroundCtx.beginPath();
            this.backgroundCtx.moveTo(fromX, fromY);
            this.backgroundCtx.lineTo(toX, toY);
            this.backgroundCtx.lineWidth = 3;
            this.backgroundCtx.strokeStyle = "#fff";
            this.backgroundCtx.stroke();
        }
    }

    private drawUpperCircle(): void {
        this.backgroundCtx.beginPath();
        this.backgroundCtx.strokeStyle = "#fff";
        this.backgroundCtx.arc(this.center.x, this.center.y, this.radius * 1.086, 2.78, 6.65);
        this.backgroundCtx.lineWidth = 5;
        this.backgroundCtx.stroke();
    }

    private drawUpperRedCircle(): void {
        this.backgroundCtx.beginPath();
        this.backgroundCtx.strokeStyle = "#e74c3c";
        this.backgroundCtx.arc(this.center.x, this.center.y, this.radius * 0.99, 6.03, 6.64);
        this.backgroundCtx.lineWidth = 10;
        this.backgroundCtx.stroke();

        this.backgroundCtx.beginPath();
        this.backgroundCtx.strokeStyle = "#c0392b";
        this.backgroundCtx.arc(this.center.x, this.center.y, this.radius * 0.95, 6.03, 6.64);
        this.backgroundCtx.lineWidth = 5;
        this.backgroundCtx.stroke();
    }

    private drawUpperSecondCircle(): void {
        this.backgroundCtx.beginPath();
        this.backgroundCtx.strokeStyle = "#ccc";
        this.backgroundCtx.arc(this.center.x, this.center.y, this.radius * 1.05, 2.78, 6.64);
        this.backgroundCtx.lineWidth = 12;
        this.backgroundCtx.stroke();
    }

    private drawTextMarkers(): void {
        this.backgroundCtx.font = "22px Play";
        this.backgroundCtx.textBaseline = "top";
        this.backgroundCtx.fillStyle = "#fff";
        const tickRadius = this.radius * 0.75;

        let numberToPrint = 0;

        for (let tick = -20; tick < 210; tick += 22) {
            const rad = this.degToRad(tick);

            const innerTickX = tickRadius - Math.cos(rad) * tickRadius;
            const innerTicky = tickRadius - Math.sin(rad) * tickRadius;

            if (tick <= 10) {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 8 + innerTickX,
                    this.center.y - tickRadius - 14 + innerTicky + 5);
            } else if (tick < 50) {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 4 + innerTickX - 5,
                    this.center.y - tickRadius - 14 + innerTicky + 5);
            } else if (tick < 90) {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 8 + innerTickX,
                    this.center.y - tickRadius - 12 + innerTicky);
            } else if (tick === 90) {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 10 + innerTickX + 4,
                    this.center.y - tickRadius - 10 + innerTicky);
            } else if (tick < 145) {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 14 + innerTickX + 10,
                    this.center.y - tickRadius - 12 + innerTicky);
            } else if (tick < 180) {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 16 + innerTickX + 10,
                    this.center.y - tickRadius - 12 + innerTicky);
            } else {
                this.backgroundCtx.fillText(numberToPrint.toString(), this.center.x - tickRadius - 31 + innerTickX + 15,
                    this.center.y - tickRadius - 14 + innerTicky + 5);
            }

            numberToPrint++;
        }
    }

    private drawDrivenKilometrePlaceholderText(): void {
        this.backgroundCtx.font = "22px Segment7";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "end";
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.fillText("888888", this.center.x + 28, this.center.y + 87);
    }

    private drawDrivenKilometrePlaceholderUnit(): void {
        this.backgroundCtx.font = "14px Play";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "end";
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.fillText("km", this.center.x + 48, this.center.y + 89);
    }

    private drawSpeedPlaceholderText(): void {
        this.backgroundCtx.font = "42px Segment7";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "end";
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.fillText("888", this.center.x + 21, this.center.y + 48);
    }

    private drawSpeedPlaceholderUnitText(): void {
        this.backgroundCtx.font = "12px Play";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "center";
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.fillText("km/h", this.center.x + 35, this.center.y + 56);
    }

    private drawSpeedUnitText(): void {
        this.foregroundCtx.font = "12px Play";
        this.foregroundCtx.textBaseline = "middle";
        this.foregroundCtx.textAlign = "center";
        this.foregroundCtx.fillStyle = "#fff";
        this.foregroundCtx.fillText("km/h", this.center.x + 35, this.center.y + 56);
    }

    private drawTextFuel(): void {
        this.backgroundCtx.font = "12px Segment7";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "center";
        this.backgroundCtx.fillStyle = "#fff";
        this.backgroundCtx.fillText("E", this.center.x - 59, this.center.y - 18);

        this.backgroundCtx.font = "12px Segment7";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "center";
        this.backgroundCtx.fillStyle = "#fff";
        this.backgroundCtx.fillText("F", this.center.x - 24, this.center.y - 18);
    }

    private drawDrivenKilometreText(): void {
        this.foregroundCtx.font = "22px Segment7";
        this.foregroundCtx.textBaseline = "middle";
        this.foregroundCtx.textAlign = "end";
        this.foregroundCtx.fillStyle = "#fff";
        this.foregroundCtx.fillText(this.drivenKilometre.toFixed(0), this.center.x + 28, this.center.y + 87);
    }

    private drawDrivenKilometreUnit(): void {
        this.foregroundCtx.font = "14px Play";
        this.foregroundCtx.textBaseline = "middle";
        this.foregroundCtx.textAlign = "end";
        this.foregroundCtx.fillStyle = "#fff";
        this.foregroundCtx.fillText("km", this.center.x + 48, this.center.y + 89);
    }

    private drawSpeedText(): void {
        this.foregroundCtx.font = "42px Segment7";
        this.foregroundCtx.textBaseline = "middle";
        this.foregroundCtx.textAlign = "end";
        this.foregroundCtx.fillStyle = "#fff";
        this.foregroundCtx.fillText(this.speed.toString(), this.center.x + 21, this.center.y + 48);
    }

    private drawGearPlaceholderText(): void {
        this.backgroundCtx.font = "28px Segment7";
        this.backgroundCtx.textBaseline = "middle";
        this.backgroundCtx.textAlign = "center";
        this.backgroundCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.backgroundCtx.fillText("8", this.center.x + 18, this.center.y - 44);
    }

    private drawGearText(): void {
        this.foregroundCtx.font = "28px Segment7";
        this.foregroundCtx.textBaseline = "middle";
        this.foregroundCtx.textAlign = "center";
        this.foregroundCtx.fillStyle = "#fff";
        this.foregroundCtx.fillText(this.gear.toString(), this.center.x + 18, this.center.y - 44);
    }

    private drawNeedle(): void {
        // 0.0 = 160
        // 1.0 = 380
        const denormalizedValue = this.rpm * (380 - 160) + 160;

        const radian = this.degToRad(denormalizedValue);
        this.foregroundCtx.fillStyle = "#f39c12";

        this.foregroundCtx.translate(this.center.x, this.center.y);
        this.foregroundCtx.rotate(radian);
        this.foregroundCtx.beginPath();

        this.foregroundCtx.moveTo(-15, -5);
        this.foregroundCtx.lineTo(this.radius, 0);
        this.foregroundCtx.lineTo(-15, 5);
        this.foregroundCtx.fill();
        this.foregroundCtx.rotate(-radian);
        this.foregroundCtx.translate(-this.center.x, -this.center.y);
        this.foregroundCtx.beginPath();

        this.foregroundCtx.fillStyle = "#ccc";
        this.foregroundCtx.arc(this.center.x, this.center.y, 10, 0, Math.PI * 2);
        this.foregroundCtx.fill();
    }

    private drawFuelNeedle(): void {
        // 0.0 = 160
        // 1.0 = 380
        const denormalizedValue = this.fuelPercentage * (380 - 160) + 160;

        const radian = this.degToRad(denormalizedValue);
        this.foregroundCtx.fillStyle = "#c0392b";
        this.foregroundCtx.translate(this.center.x - 42.5, this.center.y - 25);
        this.foregroundCtx.rotate(radian);
        this.foregroundCtx.beginPath();

        this.foregroundCtx.moveTo(0, -2);
        this.foregroundCtx.lineTo(30, 0);
        this.foregroundCtx.lineTo(0, 2);
        this.foregroundCtx.fill();
        this.foregroundCtx.rotate(-radian);
        this.foregroundCtx.translate(-(this.center.x - 42.5), -(this.center.y - 25));
        this.foregroundCtx.beginPath();

        this.foregroundCtx.fillStyle = "#ccc";
        this.foregroundCtx.arc(this.center.x - 42.5, this.center.y - 25, 4, 0, Math.PI * 2);
        this.foregroundCtx.fill();
        this.foregroundCtx.closePath();
    }

    private setVehicleInformations(vehicleInformations: VehicleInformationInterface) {
        this.speed = Math.round(vehicleInformations.speed);
        this.gear = vehicleInformations.gear;
        this.rpm = vehicleInformations.rpm - 0.1;
        this.fuelPercentage = vehicleInformations.fuelPercentage;
        this.engineOn = vehicleInformations.engine;
        this.drivenKilometre = vehicleInformations.drivenKilometre;

        this.foregroundCtx.clearRect(this.center.x - 200, this.center.y - 200, 600, 600);

        if (this.engineOn) {
            this.drawDrivenKilometreText();
            this.drawDrivenKilometreUnit();
            this.drawSpeedText();
            this.drawGearText();
            this.drawSpeedUnitText();
        } else {
            this.rpm = 0;
        }

        this.drawFuelNeedle();
        this.drawNeedle();
    }

    private toggleVehicleUI(state: boolean): void {
        this.active = state;
    }

    private degToRad(deg: number): number {
        return (deg * Math.PI) / 180.0;
    }
}
</script>

<style scoped>
.speedo canvas {
    right: 0;
    bottom: 0;
    position: absolute;
}
</style>
