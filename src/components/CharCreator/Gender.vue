<template>
    <div class='gender'>
        <h4>Geschlecht</h4>
        <div class='row'>
            <div class='col-6'>
                <div class='float-end'>
                    <button class='icon-button' type='button' @click='setGender(0)'>
                        <font-awesome-icon icon='mars' v-bind:class='{ male: gender === 0}' />
                    </button>
                </div>
            </div>
            <div class='col-6'>
                <button class='icon-button' type='button' @click='setGender(1)'>
                    <font-awesome-icon icon='venus' v-bind:class='{ female: gender === 1}' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>

import {Vue} from "vue-class-component";

export default class Gender extends Vue {
    private gender = 0;

    public setup(gender: number): void {
        this.gender = gender;
    }

    private setGender(gender: number): void {
        this.gender = gender;
        this.$emit('set-gender', this.gender);
    }
}
</script>

<style scoped>
.gender {
    padding: 1vw;
    height: 100%;
}

.icon-button {
    font-size: 7vw;
}

.icon:hover {
    color: rgba(255, 255, 255, 0.6);
}

.female {
    color: #c373e4;
}

.female:hover {
    color: #a662c1;
}

.male {
    color: #299be6;
}

.male:hover {
    color: #2286c7;
}
</style>