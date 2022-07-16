<template>
    <div class='range-slider-menu mb-5'>
        <h5>{{ title }}</h5>
        <div class='row'>
            <div class='col-12'>
                <input v-model.number='value' :max='maxValue' class='form-range-dark' min='-1' type='range' @input='updateRange()' />
                <div style='margin: unset'>
                    <p class='float-end'>
                        {{
                            value === -1
                                ? "Nichts"
                                : value + 1
                        }} </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {ClothingInterface} from "@/scripts/interfaces/character/clothing.interface";
import {GenderType} from "@/scripts/enums/gender.type";

export default class RangeSliderMenu extends Vue {
    @Prop() private readonly title!: string;
    @Prop() private readonly maxValue!: number;

    private value = -1;

    private updateRange() {
        if (this.value !== -1) {
            this.$emit("update-range", this.value);
        } else {
            this.clear();
        }
    }

    private clear(): void {
        this.$emit("update-range", null);
    }
}
</script>
