<template>
    <div class='character-menu-animations'>
        <h2>Animationen</h2>
        <input v-model='searchBar' class='form-control-dark mb-2' placeholder='Suche nach einem Namen' type='text' @input='search()' />

        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Animation im Schnellmenu</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='animation in animations' v-bind:key='animation.id' class='entry'>
                    <td>{{ animation.name }}</td>
                    <td>
                        <button class='btn w-100' type='button' v-bind:class="{
                  'btn-outline-primary': !hasAnimation(animation.id),
                  'btn-primary': hasAnimation(animation.id),
                }" @click='toggleAnimation(animation.id)'>
                            {{ getLabel(animation) }}
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {AnimationInterface} from "@/scripts/interfaces/animation.interface";

export default class CharacterMenuAnimations extends Vue {
    @Ref() private readonly mailContextElement!: HTMLDivElement;

    private animations: AnimationInterface[] = [];
    private cachedAnimations: AnimationInterface[] = [];
    private searchBar = "";

    private playerAnimations: number[] = [];

    public mounted(): void {
        alt.on("animationcatalog:usersetup", (args: any[]) => this.setup(args[0], args[1]));
        alt.on("animationcatalog:addplayeranim", (args: any[]) => this.onAddPlayerAnimation(args[0]));
        alt.on("animationcatalog:removelayeranim", (args: any[]) => this.onRemovePlayerAnimation(args[0]));
    }

    public unmounted(): void {
        alt.off("animationcatalog:usersetup");
        alt.off("animationcatalog:addplayeranim");
        alt.off("animationcatalog:removelayeranim");
    }

    private setup(animations: AnimationInterface[], playerAnimations: number[]): void {
        this.cachedAnimations = this.animations;

        this.playerAnimations = playerAnimations;
        if (this.playerAnimations === undefined) {
            this.playerAnimations = [];
        }

        this.sortAnimations(animations);
    }

    private onAddPlayerAnimation(animationId: number): void {
        this.playerAnimations.push(animationId);
        this.sortAnimations(this.animations);
    }

    private onRemovePlayerAnimation(animationId: number): void {
        this.playerAnimations = this.playerAnimations.filter((id) => id !== animationId);
        this.sortAnimations(this.animations);
    }

    private toggleAnimation(animationId: number): void {
        if (this.hasAnimation(animationId)) {
            alt.emitServer("animationcatalog:removeplayeranimation", animationId);
        } else {
            alt.emitServer("animationcatalog:addplayeranimation", animationId);
        }
    }

    private getLabel(animation: AnimationInterface): string {
        if (this.hasAnimation(animation.id)) {
            return "Entfernen";
        } else {
            return "Hinzufügen";
        }
    }

    private hasAnimation(animationId: number): boolean {
        return this.playerAnimations.some((a) => a === animationId);
    }

    private sortAnimations(animations: AnimationInterface[]): void {
        this.animations = animations.sort((a: AnimationInterface, b: AnimationInterface) => {
            if (this.hasAnimation(a.id) && !this.hasAnimation(b.id)) {
                return -1;
            }

            if (!this.hasAnimation(a.id) && this.hasAnimation(b.id)) {
                return 1;
            }

            return 0;
        });
    }

    private search(): void {
        if (this.searchBar === "") {
            this.animations = this.cachedAnimations;
            return;
        }

        this.animations = this.cachedAnimations.filter(
            (m) => m.name.toLowerCase().includes(this.searchBar.toLowerCase()));
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.table,
.entry {
    color: white !important;
}
</style>
