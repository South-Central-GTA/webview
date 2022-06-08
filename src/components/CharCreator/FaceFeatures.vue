<template>
    <div class='face-features'>
        <h4>Gesichtszüge</h4>
        <div class='row'>
            <div class='col-6'>
                <h5>Stirn</h5>
                <two-d-slider ref='browSlider' topText='Hoch' bottomText='Runter' leftText='Nach Innen' rightText='Nach Außen' v-on:change-position='updateBrow($event)' />
            </div>
            <div class='col-6'>
                <h5>Nase</h5>
                <two-d-slider ref='noseSlider' topText='Hoch' bottomText='Runter' leftText='Dünn' rightText='Breit' v-on:change-position='updateNose($event)' />
            </div>
            <div class='col-6'>
                <h5>Nasenprofil</h5>
                <two-d-slider ref='noseProfilSlider' topText='Kurvig' bottomText='Gekrümmt' leftText='Kurz' rightText='Lang' v-on:change-position='updateNoseProfil($event)' />
            </div>
            <div class='col-6'>
                <h5>Nasenspitze</h5>
                <two-d-slider ref='noseTipSlider' topText='Hoch' bottomText='Runter' leftText='Links' rightText='Rechts' v-on:change-position='updateNoseTip($event)' />
            </div>
            <div class='col-6'>
                <h5>Wangenknochen</h5>
                <two-d-slider ref='cheekboneSlider' topText='Hoch' bottomText='Runter' leftText='Nach Innen' rightText='Nach Außen' v-on:change-position='updateCheekbone($event)' />
            </div>
            <div class='col-6'>
                <h5>Kiefer</h5>
                <two-d-slider ref='jawSlider' topText='Rund' bottomText='Kantig' leftText='Oval' rightText='Breit' v-on:change-position='updateJaw($event)' />
            </div>
            <div class='col-6'>
                <h5>Kinn</h5>
                <two-d-slider ref='chinSlider' topText='Spitz' bottomText='Eckig' leftText='Nach Innen' rightText='Nach Außen' v-on:change-position='updateChin($event)' />
            </div>
            <div class='col-6'>
                <h5>Kinnform</h5>
                <two-d-slider ref='chinShapeSlider' topText='Rund' bottomText='Grübchen' leftText='Kurz' rightText='Lang' v-on:change-position='updateChinShape($event)' />
            </div>

            <h5>Augen</h5>
            <input type='range' class='form-range-dark' min='-100' max='100' v-model='eyesSize' @input='onEyesSizeUpdated()' />
            <div style='margin: unset'>
                <p class='float-start'>Eng</p>
                <p class='float-end'>Weit</p>
            </div>

            <h5>Wangen</h5>
            <input type='range' class='form-range-dark' min='-100' max='100' v-model='cheekWidth' @input='onCheekWidthUpdated()' />
            <div style='margin: unset'>
                <p class='float-start'>Eingefallen</p>
                <p class='float-end'>Geschwollen</p>
            </div>

            <h5>Nacken</h5>
            <input type='range' class='form-range-dark' min='-100' max='100' v-model='neckWidth' @input='onNeckWidthUpdated()' />
            <div style='margin: unset'>
                <p class='float-start'>Eng</p>
                <p class='float-end'>Weit</p>
            </div>

            <h5>Lippen</h5>
            <input type='range' class='form-range-dark' min='-100' max='100' v-model='lipsThickness' @input='onLipsThicknessUpdated()' />
            <div style='margin: unset'>
                <p class='float-start'>Dick</p>
                <p class='float-end'>Dünn</p>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import TwoDSlider from "../TwoDSlider.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {FaceFeaturesInterface} from "@/scripts/interfaces/character/facefeatures.interface";
import {TwoDValueInterface} from "@/scripts/interfaces/two-d-value.interface";

@Options({
    components: {
        TwoDSlider,
    },
})
export default class FaceFeatures extends Vue {
    @Ref() private readonly browSlider!: TwoDSlider;
    @Ref() private readonly noseSlider!: TwoDSlider;
    @Ref() private readonly noseProfilSlider!: TwoDSlider;
    @Ref() private readonly noseTipSlider!: TwoDSlider;
    @Ref() private readonly cheekboneSlider!: TwoDSlider;
    @Ref() private readonly jawSlider!: TwoDSlider;
    @Ref() private readonly chinSlider!: TwoDSlider;
    @Ref() private readonly chinShapeSlider!: TwoDSlider;

    private faceFeatures: FaceFeaturesInterface = {
        noseWidth: 0,
        noseHeight: 0,
        noseLength: 0,
        noseBridge: 0,
        noseTip: 0,
        noseBridgeShift: 0,
        browHeight: 0,
        browWidth: 0,
        cheekboneHeight: 0,
        cheekboneWidth: 0,
        cheekWidth: 0,
        eyesSize: 0,
        lipsThickness: 0,
        jawWidth: 0,
        jawHeight: 0,
        chinLength: 0,
        chinPosition: 0,
        chinWidth: 0,
        chinShape: 0,
        neckWidth: 0,
    };

    private eyesSize = 0;
    private cheekWidth = 0;
    private neckWidth = 0;
    private lipsThickness = 0;

    public setFaceFeatures(faceFeatures: FaceFeaturesInterface): void {
        this.faceFeatures = faceFeatures;

        this.eyesSize = -this.faceFeatures.eyesSize * 100;
        this.cheekWidth = -this.faceFeatures.cheekWidth * 100;
        this.neckWidth = this.faceFeatures.neckWidth * 100;
        this.lipsThickness = this.faceFeatures.lipsThickness * 100;

        this.browSlider.setPosition(this.faceFeatures.browWidth, this.faceFeatures.browHeight);
        this.noseSlider.setPosition(this.faceFeatures.noseWidth, this.faceFeatures.noseHeight);
        this.noseProfilSlider.setPosition(-this.faceFeatures.noseLength, -this.faceFeatures.noseBridge);
        this.noseTipSlider.setPosition(-this.faceFeatures.noseBridgeShift, this.faceFeatures.noseTip);
        this.cheekboneSlider.setPosition(this.faceFeatures.cheekboneWidth, this.faceFeatures.cheekboneHeight);
        this.jawSlider.setPosition(this.faceFeatures.jawWidth, this.faceFeatures.jawHeight);
        this.chinSlider.setPosition(this.faceFeatures.chinPosition, this.faceFeatures.chinWidth);
        this.chinShapeSlider.setPosition(this.faceFeatures.chinLength, this.faceFeatures.chinShape);
    }

    private onEyesSizeUpdated(): void {
        this.faceFeatures.eyesSize = -this.eyesSize / 100;
        this.$emit("update-face-features", this.faceFeatures);
    }

    private onCheekWidthUpdated(): void {
        this.faceFeatures.cheekWidth = -this.cheekWidth / 100;
        this.$emit("update-face-features", this.faceFeatures);
    }

    private onNeckWidthUpdated(): void {
        this.faceFeatures.neckWidth = this.neckWidth / 100;
        this.$emit("update-face-features", this.faceFeatures);
    }

    private onLipsThicknessUpdated(): void {
        this.faceFeatures.lipsThickness = this.lipsThickness / 100;
        this.$emit("update-face-features", this.faceFeatures);
    }

    private updateBrow(position: TwoDValueInterface): void {
        this.faceFeatures.browWidth = position.x;
        this.faceFeatures.browHeight = position.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    public updateNose(fieldData: TwoDValueInterface) {
        this.faceFeatures.noseWidth = fieldData.x;
        this.faceFeatures.noseHeight = fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    //Nose data is nativly inverted.
    public updateNoseProfil(fieldData: TwoDValueInterface) {
        this.faceFeatures.noseLength = -fieldData.x;
        this.faceFeatures.noseBridge = -fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    //Nose bridge shift is nativly inverted.
    public updateNoseTip(fieldData: TwoDValueInterface) {
        this.faceFeatures.noseBridgeShift = -fieldData.x;
        this.faceFeatures.noseTip = fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    public updateCheekbone(fieldData: TwoDValueInterface) {
        this.faceFeatures.cheekboneWidth = fieldData.x;
        this.faceFeatures.cheekboneHeight = fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    public updateJaw(fieldData: TwoDValueInterface) {
        this.faceFeatures.jawWidth = fieldData.x;
        this.faceFeatures.jawHeight = fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    public updateChin(fieldData: TwoDValueInterface) {
        this.faceFeatures.chinPosition = fieldData.x;
        this.faceFeatures.chinWidth = fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }

    public updateChinShape(fieldData: TwoDValueInterface) {
        this.faceFeatures.chinLength = fieldData.x;
        this.faceFeatures.chinShape = fieldData.y;

        this.$emit("update-face-features", this.faceFeatures);
    }
}
</script>

<style scoped>
.face-features {
    padding: 1vw;
    height: 100%;
    overflow: auto;
}

.col-6 {
    padding-bottom: 1.5vw;
}
</style>
