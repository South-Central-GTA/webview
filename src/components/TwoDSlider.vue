<template>
    <div ref='slider' class='two-d-slider'>
        <div ref='bounds' class='drag-box' v-bind:style="{ height: HEIGHT + 'px', width: WIDTH + 'px' }">
            <div class='top-text'>
                <p class='text-white'>{{ topText }}</p>
            </div>
            <div class='left-text'>
                <p class='text-white'>{{ leftText }}</p>
            </div>
            <!-- Dot -->
            <div ref='thump' class='drag-thump' v-bind:style="{ height: MARKER_SIZE + 'px', width: MARKER_SIZE + 'px' }"></div>
            <div class='right-text'>
                <p class='text-white'>{{ rightText }}</p>
            </div>
            <div class='bottom-text'>
                <p class='text-white'>{{ bottomText }}</p>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";
import {TwoDValueInterface} from "@/scripts/interfaces/two-d-value.interface";

export default class TwoDSlider extends Vue {
    private MARKER_SIZE = 18;
    private WIDTH = 220;
    private HEIGHT = 220;
    private XMAX = 2;
    private YMAX = 2;
    private ROUND_FACTOR = Math.pow(10, 2);

    @Ref() private readonly thump!: HTMLElement;
    @Ref() private readonly bounds!: HTMLElement;
    @Ref() private readonly slider!: HTMLInputElement;

    @Prop() private readonly topText!: string;
    @Prop() private readonly bottomText!: string;
    @Prop() private readonly leftText!: string;
    @Prop() private readonly rightText!: string;

    private validPosition = true;

    private dotPos: TwoDValueInterface = {
        x: this.WIDTH / 2 - this.MARKER_SIZE / 2, y: this.HEIGHT / 2 - this.MARKER_SIZE / 2,
    };

    public setPosition(x: number, y: number): void {
        this.dotPos = {
            x: ((x + 1) / 2) * this.WIDTH - this.MARKER_SIZE / 2, y: ((y + 1) / 2) * this.HEIGHT - this.MARKER_SIZE / 2,
        };

        this.thump.style.left = this.dotPos.x + "px";
        this.thump.style.top = this.dotPos.y + "px";
    }

    public mounted(): void {
        this.thump.style.left = this.dotPos.x + "px";
        this.thump.style.top = this.dotPos.y + "px";

        this.thump.onmousedown = () => {
            document.addEventListener("mousemove", this.onMouseMove);
        };

        this.thump.onmouseup = () => {
            document.removeEventListener("mousemove", this.onMouseMove);
        };
    }

    public getPosition(): void {
        const leftPos = this.thump.offsetLeft + this.MARKER_SIZE * 0.5;
        const topPos = this.thump.offsetTop + this.MARKER_SIZE * 0.5;

        let x = (leftPos * this.XMAX) / this.WIDTH - 1;
        x = Math.round(this.ROUND_FACTOR * x) / this.ROUND_FACTOR;

        let y = 1 - ((this.HEIGHT - topPos) * this.YMAX) / this.HEIGHT;
        y = Math.round(this.ROUND_FACTOR * y) / this.ROUND_FACTOR;

        this.dotPos = {
            x: Math.min(Math.max(x, -this.XMAX + 1), this.XMAX - 1),
            y: Math.min(Math.max(y, -this.YMAX + 1), this.YMAX - 1),
        };

        this.$emit("change-position", this.dotPos);
    }

    private destroyed(): void {
        document.removeEventListener("mousemove", this.onMouseMove);
    }

    private onMouseMove(event: MouseEvent) {
        const parentRect = this.bounds.getBoundingClientRect();

        const relX = event.pageX - parentRect.left;
        const relY = event.pageY - parentRect.top;

        this.checkBoundaries(event.pageX, event.pageY);
        this.moveAt(relX, relY);
        this.getPosition();
    }

    private checkBoundaries(pageX: number, pageY: number) {
        const parentRect = this.bounds.getBoundingClientRect();

        this.validPosition = !(parentRect.left >= pageX || parentRect.right <= pageX || parentRect.top >= pageY || parentRect.bottom <= pageY);
    }

    private moveAt(pageX: number, pageY: number): void {
        if (!this.validPosition) {
            // Unselect the slider after 2 seconds when you moving out of the box while left click. So its not sticking to the mouse when you reenter the slider box.
            setTimeout(() => {
                if (!this.validPosition) {
                    document.removeEventListener("mousemove", this.onMouseMove);
                }
            }, 2000);
            return;
        }

        this.thump.style.left = pageX - this.MARKER_SIZE * 0.5 + "px";
        this.thump.style.top = pageY - this.MARKER_SIZE * 0.5 + "px";
    }
}
</script>

<style scoped>
.drag-box {
    margin: 0 auto;
    position: relative;
    background-image: url("../assets/images/grid.png");
    background-position: center center;
    background-size: 100%;
    background-color: rgba(0, 0, 0, 0.04);
}

.drag-thump {
    position: absolute;
    border-radius: 100%;
    background-color: #e74c3c;
}

.drag-thump:hover {
    cursor: pointer;
}

.left-text {
    position: absolute;
    width: 50px;
    display: block;
    top: 50%;
    left: -32%;
    transform: translate(0%, -50%);
    text-align: right;
}

.right-text {
    position: absolute;
    width: 50px;
    display: block;
    top: 50%;
    right: -32%;
    transform: translate(0%, -50%);
    text-align: left;
}

.top-text {
    position: absolute;
    width: 200px;
    top: -12%;
    left: 50%;
    transform: translate(-50%, 0%);
    text-align: center;
}

.bottom-text {
    position: absolute;
    width: 200px;
    display: block;
    bottom: -12%;
    left: 50%;
    transform: translate(-50%, 0%);
    text-align: center;
}

p {
    color: var(--bs-dark);
    margin: unset;
}
</style>
