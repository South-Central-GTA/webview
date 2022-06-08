<template>
    <div class='tattoos'>
        <h4>Tattoos</h4>
        <div class='row'>
            <tattoo-menu ref='hatMenu' title='Kopf' v-on:update-tattoo='updateHead($event)' />
            <tattoo-menu ref='torsoMenu' title='Torso' v-on:update-tattoo='updateTorso($event)' />
            <tattoo-menu ref='leftArmMenu' title='Linker Arm' v-on:update-tattoo='updateLeftArm($event)' />
            <tattoo-menu ref='rightArmMenu' title='Rechter Arm' v-on:update-tattoo='updateRightArm($event)' />
            <tattoo-menu ref='leftLegMenu' title='Linkes Bein' v-on:update-tattoo='updateLeftLeg($event)' />
            <tattoo-menu ref='rightLegMenu' title='Rechtes Bein' v-on:update-tattoo='updateRightLeg($event)' />
        </div>

        <div class='alert alert-info'>
            <p>
                Zahlreiche Kopf-Tattoos können perfekt mit Haaren kombiniert werden, dies ist GTA interne Logik das haben wir uns nicht ausgedacht. </p>
        </div>
    </div>
</template>

<script lang='ts'>
import TattooMenu from "@/components/CharCreator/Menus/TattooMenu.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {TattoosInterface} from "@/scripts/interfaces/character/tattoos.interface";
import {PedOverlayInterface} from "@/scripts/interfaces/ped/ped-overlay.interface";
import {PedOverlayCollectionInterface} from "@/scripts/interfaces/ped/ped-overlay-collection.interface";
import {TattooInterface} from "@/scripts/interfaces/character/tattoo.interface";

@Options({
    components: {
        TattooMenu,
    },
})
export default class Tattoos extends Vue {
    @Ref() private readonly hatMenu!: TattooMenu;
    @Ref() private readonly torsoMenu!: TattooMenu;
    @Ref() private readonly leftArmMenu!: TattooMenu;
    @Ref() private readonly rightArmMenu!: TattooMenu;
    @Ref() private readonly leftLegMenu!: TattooMenu;
    @Ref() private readonly rightLegMenu!: TattooMenu;

    private gender = 0;
    private tattoos: TattoosInterface = {
        headCollection: "",
        headHash: "",
        torsoCollection: "",
        torsoHash: "",
        leftArmCollection: "",
        leftArmHash: "",
        rightArmCollection: "",
        rightArmHash: "",
        leftLegCollection: "",
        leftLegHash: "",
        rightLegCollection: "",
        rightLegHash: "",
    };

    public setGender(gender: number): void {
        this.gender = gender;
        this.setMaxComponents();
    }

    public setCharacterTattoos(gender: number, tattoos: TattoosInterface): void {
        this.gender = gender;
        this.tattoos = tattoos;

        this.setMaxComponents(tattoos);
    }

    private setMaxComponents(tattoos?: TattoosInterface): void {
        fetch("http://assets/southcentral-assets/dumps/pedOverlayCollections.json").then(async (response) => {
            const data: PedOverlayCollectionInterface[] = await response.json();
            const genderString = this.gender === 0 ? "GENDER_MALE" : "GENDER_FEMALE";

            const overlays = data
                .flatMap((oc) => oc.Overlays)
                .filter((o) => o.Type === "TYPE_TATTOO" && o.Gender === genderString);
            overlays.forEach((overlay: PedOverlayInterface, index: number) => {
                if (overlay?.TranslatedLabel != null) {
                    overlay.Title = overlay.TranslatedLabel["German"];
                } else {
                    overlay.Title = "Namenslos #" + index;
                }
            });

            const hats = overlays.filter((o) => o.ZoneName === "ZONE_HEAD");
            if (tattoos !== undefined) {
                this.hatMenu?.setMax(hats, data, {
                    hash: tattoos?.headHash, collection: tattoos?.headCollection,
                });
            } else {
                this.hatMenu?.setMax(hats, data);
            }

            const torso = overlays.filter((o) => o.ZoneName === "ZONE_TORSO");
            if (tattoos !== undefined) {
                this.torsoMenu?.setMax(torso, data, {
                    hash: tattoos?.torsoHash, collection: tattoos?.torsoCollection,
                });
            } else {
                this.torsoMenu?.setMax(torso, data);
            }

            const leftArm = overlays.filter((o) => o.ZoneName === "ZONE_LEFT_ARM");
            if (tattoos !== undefined) {
                this.leftArmMenu?.setMax(leftArm, data, {
                    hash: tattoos?.leftArmHash, collection: tattoos?.leftArmCollection,
                });
            } else {
                this.leftArmMenu?.setMax(leftArm, data);
            }

            const rightArm = overlays.filter((o) => o.ZoneName === "ZONE_RIGHT_ARM");
            if (tattoos !== undefined) {
                this.rightArmMenu?.setMax(rightArm, data, {
                    hash: tattoos?.rightArmHash, collection: tattoos?.rightArmCollection,
                });
            } else {
                this.rightArmMenu?.setMax(rightArm, data);
            }

            const leftLeg = overlays.filter((o) => o.ZoneName === "ZONE_LEFT_LEG");
            if (tattoos !== undefined) {
                this.leftLegMenu?.setMax(leftLeg, data, {
                    hash: tattoos?.leftLegHash, collection: tattoos?.leftLegCollection,
                });
            } else {
                this.leftLegMenu?.setMax(leftLeg, data);
            }

            const rightLeg = overlays.filter((o) => o.ZoneName === "ZONE_RIGHT_LEG");
            if (tattoos !== undefined) {
                this.rightLegMenu?.setMax(rightLeg, data, {
                    hash: tattoos?.leftLegHash, collection: tattoos?.leftLegCollection,
                });
            } else {
                this.rightLegMenu?.setMax(rightLeg, data);
            }
        });
    }

    private updateHead(tattoo: TattooInterface): void {
        this.tattoos.headCollection = tattoo.collection;
        this.tattoos.headHash = tattoo.hash;

        this.$emit("update-tattoos", this.tattoos);
    }

    private updateTorso(tattoo: TattooInterface): void {
        this.tattoos.torsoCollection = tattoo.collection;
        this.tattoos.torsoHash = tattoo.hash;

        this.$emit("update-tattoos", this.tattoos);
    }

    private updateLeftArm(tattoo: TattooInterface): void {
        this.tattoos.leftArmCollection = tattoo.collection;
        this.tattoos.leftArmHash = tattoo.hash;

        this.$emit("update-tattoos", this.tattoos);
    }

    private updateRightArm(tattoo: TattooInterface): void {
        this.tattoos.rightArmCollection = tattoo.collection;
        this.tattoos.rightArmHash = tattoo.hash;

        this.$emit("update-tattoos", this.tattoos);
    }

    private updateLeftLeg(tattoo: TattooInterface): void {
        this.tattoos.leftLegCollection = tattoo.collection;
        this.tattoos.leftLegHash = tattoo.hash;

        this.$emit("update-tattoos", this.tattoos);
    }

    private updateRightLeg(tattoo: TattooInterface): void {
        this.tattoos.rightLegCollection = tattoo.collection;
        this.tattoos.rightLegHash = tattoo.hash;

        this.$emit("update-tattoos", this.tattoos);
    }
}
</script>

<style scoped>
.tattoos {
    padding: 1vw;
    height: 100%;
    overflow: auto;
}
</style>
