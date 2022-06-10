<template>
    <div class='settings-page'>
        <div class='phone-header'>
            <div>
                <span>Einstellungen</span>
            </div>
        </div>

        <background-setting ref='background' :hidden='currentTab !== 1' v-on:back='resetTab()' />

        <div class='phone-button-group'>
            <button class='btn btn-primary' type='button' @click='openTab(1)'>
                <font-awesome-icon class='background-icon' icon='images' />
                <span>Hintergrundbild</span>
            </button>
            <button class='btn btn-secondary' disabled type='button'>
                <font-awesome-icon class='call-icon' icon='phone' />
                <span>Klingeltöne</span>
            </button>
            <button class='btn btn-secondary' disabled type='button'>
                <font-awesome-icon class='internet-icon' icon='globe' />
                <span>Internet</span>
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import BackgroundSetting from './Components/SettingsPages/BackgroundSetting.vue';
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

@Options({
    components: {
        BackgroundSetting
    }
})
export default class SettingsPage extends Vue {
    @Ref() private readonly background!: BackgroundSetting;
    private currentTab = 0;

    get getTab() {
        return this.currentTab;
    }

    public setup(backgroundId: number): void {
        this.background.setup(backgroundId);
    }

    public resetTab(): void {
        this.openTab(0);
    }

    private openTab(id: number): void {
        this.currentTab = id;
    }
}
</script>

<style lang='scss' scoped>
.settings-page {
    height: 100%;

    background-color: rgb(221, 221, 221);
    background-position: center center;
    background-size: 30vw;
}

.background-icon {
    color: rgb(230, 99, 99);
}

.call-icon {
    color: rgb(99, 156, 230);
}

.lock-screen-icon {
    color: rgb(178, 99, 230);
}

.internet-icon {
    color: rgb(189, 149, 21);
}

.phone-button-group {
    position: absolute;
    top: 20%;
}

.phone-button-group button {
    text-align: left;
}
</style>
