<template>
    <div :hidden='!active' class='animation-wheel'>
        <div ref='actionMenu' class='actions-box'>
            <div class='action'>
                <a @click.prevent='stopAnimation()'>Animation stoppen</a>
            </div>
            <div v-for='(animation, index) in animations' v-bind:key='index' class='action'>
                <a @click.prevent='chooseAnimation(animation)'>{{ animation.name }}</a>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import CharacterMenuAnimations from "@/components/CharacterMenu/Pages/CharacterMenuAnimations.vue";
import {AnimationInterface} from "@/scripts/interfaces/animation.interface";

@Options({
    components: {
        CharacterMenuAnimations,
    },
})
export default class AnimationWheel extends Vue {
    @Ref() private readonly actionMenu!: HTMLElement;

    private animations: AnimationInterface[] = [];

    private active = false;

    public mounted(): void {
        alt.on("animationwheel:toggle", (visible: boolean) => this.onToggle(visible));
        alt.on("animationwheel:setanimations", (animations: AnimationInterface[]) => this.onSetAnimations(animations));
    }

    public unmounted(): void {
        alt.off("animationwheel:toggle");
        alt.off("animationwheel:setanimations");
    }

    private onToggle(visible: boolean): void {
        this.active = visible;
    }

    private onSetAnimations(animations: AnimationInterface[]): void {
        this.animations = animations;

        setTimeout(() => {
            this.setButtonPosition();
        }, 1);
    }

    private setButtonPosition(): void {
        const radius = 125;
        let maxElements = this.actionMenu.children.length;

        if (maxElements % 2 !== 0) {
            maxElements++;
        }

        const frags = 360 / maxElements;
        const mainHeight = parseInt(window.getComputedStyle(this.actionMenu).height.slice(0, -2));

        for (let index = 0; index <= this.actionMenu.children.length - 1; index++) {
            const element = this.actionMenu.children[index] as HTMLElement;

            const theta = (frags / 180) * index * Math.PI;

            const posX = Math.round(radius * Math.cos(theta)) + "px";
            const posY = Math.round(radius * Math.sin(theta)) + "px";

            element.style.top = mainHeight / 2 - parseInt(posY.slice(0, -2)) + "px";
            element.style.left = mainHeight / 2 + parseInt(posX.slice(0, -2)) + "px";
        }
    }

    private stopAnimation(): void {
        this.active = false;
        alt.emit("animationwheel:stopanim");
    }

    private chooseAnimation(animation: AnimationInterface): void {
        this.active = false;
        alt.emit("animationwheel:requestanim", animation.id);
    }
}
</script>

<style lang='scss' scoped>
.animation-wheel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.actions-box {
    position: relative;

    height: 20vw;
    width: 20vw;

    border: 1px solid rgba(0, 0, 0, 0.8);
    background-color: rgba(0, 0, 0, 0.45);
    border-radius: 100%;
}

.action {
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    height: 10vw;
    width: 10vw;

    a {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: white !important;
    }

    :hover {
        color: #d0d0d0 !important;
    }
}
</style>
