<template>
    <div class="appearance-menu">
        <h5>{{ title }}</h5>
        <div class="menu">
            <div class="left">
                <button type="button" class="btn btn-primary" @click="onPreviousButtonClicked()">
                    <font-awesome-icon icon="caret-left"/>
                </button>
            </div>

            <p v-if="appearance.value !== clearNumber && names">{{ names[appearance.value] }}
                ({{ appearance.value }})</p>
            <p v-if="appearance.value === clearNumber && clearNumber === 0 && names">{{ names[appearance.value] }}</p>
            <p v-if="appearance.value !== clearNumber && !names">{{ appearance.value }}</p>
            <p v-if="appearance.value === clearNumber && clearNumber === 0 && !names">{{ appearance.value }}</p>
            <p v-if="appearance.value === clearNumber && clearNumber !== 0">Keine</p>

            <div>
                <button type="button" class="icon-button" @click="toggleMenu()" v-if="hasOpacity || colors !== null">
                    <font-awesome-icon class="text-white" icon="cog"/>
                </button>
                <button type="button" class="icon-button" ref="clearButton" :hidden="appearance.value === clearNumber">
                    <font-awesome-icon class="text-white" icon="trash"/>
                </button>
            </div>
            <div class="right">
                <button type="button" class="btn btn-primary" @click="onNextButtonClicked()">
                    <font-awesome-icon icon="caret-right"/>
                </button>
            </div>
        </div>

        <div :hidden="currentMenuIndex  !== menuIndex" class="sub-menu">
            <div class="colorBox" v-if="colors !== null">
                <div v-for="(color, index) in colors" :key="index">
                    <button type="button" class="icon-button" @click="selectPrimaryColor(index)">
                        <font-awesome-icon icon="circle"
                                           v-bind:style="{ color: 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' }"/>
                    </button>
                </div>
            </div>

            <div style="padding-top: 1vw" v-if="hasSecondaryColor">
                <p class="text-white-50">Haarspitzen Farbe</p>
                <div class="colorBox">
                    <div v-for="(color, index) in colors" :key="index">
                        <button type="button" class="icon-button" @click="selectSecondaryColor(index)">
                            <font-awesome-icon icon="circle"
                                               v-bind:style="{ color: 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' }"/>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="hasOpacity">
                <input type="range" class="form-range" min="0" max="1" step="0.01" v-model="opacityString"
                       @input="updateOpacity()"/>
                <div style="margin: unset">
                    <p class="float-start">Deckkraft</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {ColorInterface} from '@/scripts/interfaces/color.interface';
import {AppearanceInterface} from "@/scripts/interfaces/character/appearance.interface";
import {Vue} from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";

export default class AppearanceMenu extends Vue {
    @Prop() private readonly title!: string;
    @Prop() private readonly colors!: ColorInterface[];
    @Prop() private readonly menuIndex!: number;
    @Prop() private readonly names!: string[];
    @Prop() private readonly maxElements!: number;
    @Prop() private readonly currentMenuIndex!: number;
    @Prop() private readonly clearNumber!: number;
    @Prop() private readonly hasOpacity!: number;
    @Prop() private readonly hasSecondaryColor!: number;
    @Ref() private readonly clearButton!: HTMLButtonElement;

    private opacityString: string = "0.5";

    private appearance: AppearanceInterface = {
        value: this.clearNumber,
        opacity: 1,
        primaryColor: 0,
        secondaryColor: 0
    };

    public mounted(): void {
        this.clearButton.addEventListener('click', () => this.clear());
    }

    public unmounted(): void {
        this.clearButton.removeEventListener('click', () => this.clear());
    }

    public setAppearance(existingAppearance: AppearanceInterface): void {
        this.appearance.value = existingAppearance.value;
        this.appearance.opacity = existingAppearance.opacity;
        this.appearance.primaryColor = existingAppearance.primaryColor;
        this.appearance.secondaryColor = existingAppearance.secondaryColor;
    }

    private onPreviousButtonClicked(): void {
        this.appearance.value--;

        // For max values look intro the description of https://natives.altv.mp/#/0x48F44967FA05CC1E
        if (this.appearance.value < 0 || this.appearance.value > this.maxElements)
            this.appearance.value = this.maxElements;

        this.$emit("update-appearance", this.appearance);
    }

    private onNextButtonClicked(): void {
        this.appearance.value++;

        //https://natives.altv.mp/#/0x48F44967FA05CC1E
        if (this.appearance.value > this.maxElements)
            this.appearance.value = 0;

        this.$emit("update-appearance", this.appearance);
    }

    private toggleMenu(): void {
        this.$emit('request-menu', this.menuIndex);
    }

    private clear(): void {
        this.appearance = {
            value: this.clearNumber,
            opacity: 1,
            primaryColor: 0,
            secondaryColor: 0
        };

        this.$emit("update-appearance", this.appearance);
        this.$emit('request-menu', -1);
    }

    private selectPrimaryColor(index: number): void {
        this.appearance.primaryColor = index;
        this.$emit("update-appearance", this.appearance);
    }

    private selectSecondaryColor(index: number): void {
        this.appearance.secondaryColor = index;
        this.$emit("update-appearance", this.appearance);
    }

    private updateOpacity(): void {
        this.appearance.opacity = Number.parseFloat(this.opacityString);
        this.$emit("update-appearance", this.appearance);
    }
}
</script>

<style scoped>
.appearance-menu {
    padding-bottom: 2vw;
}

.menu {
    display: flex;
    justify-content: center;
    position: relative;
}

.sub-menu {
    padding-top: 1.25vw;
}

.left {
    position: absolute;
    left: 0;
}

.right {
    position: absolute;
    right: 0;
}

.icon-button {
    font-size: 0.7vw;
}

.colorBox {
    display: flex;
    justify-content: safe;
    flex-wrap: wrap;
}

.colorBox .icon-button {
    font-size: 1.0vw;
}
</style>