<template>
    <div class="tattoo-menu">
        <h5>{{ title }}</h5>
        <div class="menu">
            <div class="left">
                <button type="button" class="btn btn-primary" @click="onPreviousButtonClicked()">
                    <font-awesome-icon icon="caret-left"/>
                </button>
            </div>

            <p v-if="tattoo.hash !== 0">{{ name }}</p>
            <p v-if="tattoo.hash === 0">Kein Tattoo</p>

            <div>
                <button type="button" class="icon-button" @click="clear" :hidden="tattoo.hash === 0">
                    <font-awesome-icon icon="trash"/>
                </button>
            </div>
            <div class="right">
                <button type="button" class="btn btn-primary" @click="onNextButtonClicked()">
                    <font-awesome-icon icon="caret-right"/>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {TattooInterface} from "@/scripts/interfaces/character/tattoo.interface";
import {PedOverlay} from "@/scripts/interfaces/ped/ped-overlay.interface";
import {PedOverlayCollections} from "@/scripts/interfaces/ped/ped-overlay-collections.interface";
import {Vue} from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";

export default class TattooMenu extends Vue {
    @Prop() private readonly title!: string;

    private overlays: PedOverlay[] = [];
    private names!: string[];
    private name = "";
    private index = -1;
    private overlayCollections: PedOverlayCollections[] = [];

    private tattoo: TattooInterface = {
        collection: "",
        hash: ""
    };

    public setMax(overlays: PedOverlay[], allCollections: PedOverlayCollections[], tattoo?: TattooInterface): void {
        this.overlays = overlays;
        this.overlayCollections = allCollections;
        this.names = this.overlays.flatMap(poc => poc.Title);

        if (tattoo !== undefined && tattoo?.hash !== "") {
            this.tattoo = tattoo;
            const overlay = this.overlays.find(o => o.OverlayHash === Number.parseInt(tattoo.hash));
    
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
            collection: "",
            hash: ""
        };

        this.index = -1;

        this.$emit("update-tattoo", this.tattoo);
    }

    private updateTattoo(sendEvent: boolean = true): void {
        this.name = this.overlays[this.index].Title;
        this.tattoo.hash = this.overlays[this.index].OverlayHash.toString();

        const collection = this.overlayCollections.find(oc => oc.Overlays.find(o => this.name == o.Title
            && Number.parseInt(this.tattoo.hash) === o.OverlayHash));

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