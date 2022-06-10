<template>
    <div class='background-setting'>
        <div class='phone-header'>
            <button class='icon-button' type='button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Hintergrundbild</span>
            </button>
        </div>

        <div class='thumbnail-block'>
            <div v-for='index in maxBackgrounds' :key='index'>
                <button class='thumbnail' type='button' @click='selectBackground(index - 1)'>
                    <font-awesome-icon v-if='currentBackgroundId === index - 1' class='selected-icon' icon='hand-pointer' />
                    <img :src='getImage(index - 1)' v-bind:alt='index' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";

export default class BackgroundSetting extends Vue {
    private maxBackgrounds = 9;
    private currentBackgroundId = 0;

    public setup(backgroundId: number): void {
        this.currentBackgroundId = backgroundId;
    }

    private back(): void {
        this.$emit("back");
    }

    private getImage(id: number): string {
        const images = require.context("@/assets/images/phone/backgrounds/", false, /\.jpg$/);
        return images("./background" + id + ".jpg");
    }

    private selectBackground(id: number): void {
        if (this.currentBackgroundId === id) return;

        alt.emit("phone:selectbackground", id);
    }
}
</script>

<style lang='scss' scoped>
.background-setting {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.thumbnail-block {
    width: 94%;
    display: flex;
    overflow-x: scroll;
    padding: 0vw 0.3vw;
    flex-wrap: nowrap;
}

.thumbnail {
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    border: none;
}

.thumbnail img {
    border-radius: 0.2vw;
    height: 12vw;
    width: 6vw;
}

.selected-icon {
    position: absolute;
    bottom: 0.3vw;
    right: 0.5vw;
    color: white;
    font-size: 1.3vw;
}
</style>
