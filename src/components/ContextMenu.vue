<template>
    <div :hidden='!active' class='context-menu'>
        <div ref='actionMenu' class='actions-box'>
            <div v-for='(action, index) in contextMenu.actions' v-bind:key='index' class='action'>
                <a @click.prevent='chooseAction(action)'>{{ action.title }}</a>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {ContextMenuInterface} from "@/scripts/interfaces/context-menu.interface";
import {ActionInterface} from "@/scripts/interfaces/action.interface";

export default class ContextMenu extends Vue {
    @Ref() private readonly actionMenu!: HTMLElement;

    private contextMenu: ContextMenuInterface = {
        title: "", x: 0, y: 0, actions: [],
    };

    private active = false;

    public mounted(): void {
        alt.on("contextmenu:setup", (contextMenu: ContextMenuInterface) => this.setup(contextMenu));
        alt.on("contextmenu:close", () => this.close());
    }

    public unmounted(): void {
        alt.off("contextmenu:setup");
        alt.off("contextmenu:close");
    }

    private setup(contextMenu: ContextMenuInterface): void {
        this.contextMenu = contextMenu;

        document.documentElement.style.setProperty("--pos-x", this.contextMenu.x + "px");
        document.documentElement.style.setProperty("--pos-y", this.contextMenu.y + "px");

        setTimeout(() => {
            this.setButtonPosition();
        }, 1);

        this.active = true;
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

    private close(): void {
        this.active = false;
    }

    private chooseAction(action: ActionInterface): void {
        alt.emit("contextmenu:selectaction", action);
    }
}
</script>

<style lang='scss' scoped>
$pos-x: var(--pos-x);
$pos-y: var(--pos-y);

.context-menu {
    position: absolute;
    left: $pos-x;
    top: $pos-y;
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

        :hover {
            color: #d0d0d0 !important;
        }
    }
}
</style>
