<template>
    <div class='tattoo-menu'>
        <h5>{{ title }}</h5>
        <div class='menu'>
            <div class='left'>
                <button class='btn btn-primary' type='button' @click='onPreviousButtonClicked()'>
                    <font-awesome-icon icon='caret-left' />
                </button>
            </div>

            <p v-if='tattoo.hash !== 0'>{{ name }}</p>
            <p v-if='tattoo.hash === 0'>Kein Tattoo</p>

            <div>
                <button :hidden='tattoo.hash === 0' class='icon-button' type='button' @click='clear'>
                    <font-awesome-icon icon='trash' />
                </button>
            </div>
            <div class='right'>
                <button class='btn btn-primary' type='button' @click='onNextButtonClicked()'>
                    <font-awesome-icon icon='caret-right' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {TattooInterface} from "@/scripts/interfaces/character/tattoo.interface";
import {PedOverlayInterface} from "@/scripts/interfaces/ped/ped-overlay.interface";
import {PedOverlayCollectionInterface} from "@/scripts/interfaces/ped/ped-overlay-collection.interface";

export default class TattooMenu extends Vue {
    @Prop() private readonly title!: string;

    private overlays: PedOverlayInterface[] = [];
    private names!: string[];
    private name = "";
    private index = -1;
    private overlayCollections: PedOverlayCollectionInterface[] = [];

    private tattoo: TattooInterface = {
        collection: "", hash: "",
    };

    public setMax(overlays: PedOverlayInterface[], allCollections: PedOverlayCollectionInterface[], tattoo?: TattooInterface): void {
        this.overlays = overlays;
        this.overlayCollections = allCollections;
        this.names = this.overlays.flatMap((poc) => poc.Title);

        if (tattoo !== undefined && tattoo?.hash !== "") {
            this.tattoo = tattoo;
            const overlay = this.overlays.find((o) => o.OverlayHash === Number.parseInt(tattoo.hash));

            if (overlay != undefined) {
                this.index = this.overlays.indexOf(overlay);
                this.updateTattoo(false);
            }
        }
    }

    private onPreviousButtonClicked(): void {
        this.index--;

        if (this.index < 0) {
            this.index = this.overlays.length - 1;
        }

        this.updateTattoo();
    }

    private onNextButtonClicked(): void {
        this.index++;

        if (this.index > this.overlays.length - 1) {
            this.index = 0;
        }

        this.updateTattoo();
    }

    private clear(): void {
        this.tattoo = {
            collection: "", hash: "",
        };

        this.index = -1;
        this.name = "";

        this.$emit("update-tattoo", this.tattoo);
    }

    private updateTattoo(sendEvent: boolean = true): void {
        this.name = this.overlays[this.index].Title;
        this.tattoo.hash = this.overlays[this.index].OverlayHash.toString();

        const collection = this.overlayCollections.find((oc) => oc.Overlays.find(
            (o) => this.name == o.Title && Number.parseInt(this.tattoo.hash) === o.OverlayHash));

        if (collection === undefined) {
            return;
        }

        this.tattoo.collection = collection.CollectionName;

        if (sendEvent) {
            this.$emit("update-tattoo", this.tattoo);
        }
    }
}
</script>

<style scoped>
.tattoo-menu {
    padding-bottom: 2vw;
}

.menu {
    display: flex;
    justify-content: center;
    position: relative;
}

.left {
    position: absolute;
    left: 0%;
}

.right {
    position: absolute;
    right: 0%;
}

.icon-button {
    font-size: 0.7vw;
}
</style>
