<template>
    <div class='character-menu'>
        <div :hidden='!active' class='sc-card text-white center' v-bind:class='{ enable: active, disable: !active }'>
            <div class='card-body'>
                <h5 class='card-title'>Charakter Menu</h5>
                <div class='row'>
                    <div class='col-2'>
                        <div class='btn-group-vertical'>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 0,
                  'btn-primary': activeTabId === 0,
                }" @click='openTab(0)'>
                                Start
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 1,
                  'btn-primary': activeTabId === 1,
                }" @click='openTab(1)'>
                                Definierter Job
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 2,
                  'btn-primary': activeTabId === 2,
                }" @click='openTab(2)'>
                                Gruppen
                            </button>
                            <button class='btn' type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 3,
                  'btn-primary': activeTabId === 3,
                }" @click='openTab(3)'>
                                Animationen
                            </button>
                            <button class='btn' disabled type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 4,
                  'btn-primary': activeTabId === 4,
                }" @click='openTab(4)'>
                                Charakter Geschichte
                            </button>
                            <button class='btn' disabled type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 5,
                  'btn-primary': activeTabId === 5,
                }" @click='openTab(5)'>
                                Fahrzeuge
                            </button>
                            <button class='btn' disabled type='button' v-bind:class="{
                  'btn-outline-primary': activeTabId !== 6,
                  'btn-primary': activeTabId === 6,
                }" @click='openTab(6)'>
                                Immobilien
                            </button>
                        </div>
                    </div>
                    <div class='col-10'>
                        <character-menu-job :hidden='activeTabId !== 1' />

                        <character-menu-groups ref='characterMenuGroups' :hidden='activeTabId !== 2' @close='requestCloseMenu' />

                        <character-menu-animations :hidden='activeTabId !== 3' />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import CharacterMenuAnimations from "@/components/CharacterMenu/Pages/CharacterMenuAnimations.vue";
import CharacterMenuJob from "@/components/CharacterMenu/Pages/CharacterMenuJob.vue";
import CharacterMenuGroups from "@/components/CharacterMenu/CharacterMenuGroups/CharacterMenuGroups.vue";

@Options({
    components: {
        CharacterMenuGroups, CharacterMenuJob, CharacterMenuAnimations,
    },
})
export default class CharacterMenu extends Vue {
    @Ref() private readonly characterMenuGroups!: CharacterMenuGroups;

    private activeTabId = 0;
    private active = false;

    public mounted(): void {
        alt.on("charactermenu:toggle", (state: boolean) => this.toggle(state));
    }

    public unmounted(): void {
        alt.off("charactermenu:toggle");
    }

    private toggle(state: boolean): void {
        this.active = state;

        this.openTab(this.activeTabId);
    }

    private openTab(tabId: number): void {
        this.activeTabId = tabId;

        if (tabId === 1) {
            alt.emitServer("definedjob:requestmenu");
        } else if (tabId === 2) {
            this.characterMenuGroups.open();
        } else if (tabId === 3) {
            alt.emitServer("animationcatalog:useropen");
        }
    }

    private requestCloseMenu(): void {
        alt.emit("charactermenu:requestclose");
    }
}
</script>

<style scoped>
.character-menu {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
}

.sc-card {
    width: 60vw;
    height: 35vw;
}
</style>
