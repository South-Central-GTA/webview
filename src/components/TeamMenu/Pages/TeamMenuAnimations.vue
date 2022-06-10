<template>
    <div class='team-menu-animations'>
        <h2>Animations Catalog</h2>
        <input v-model='searchBar' class='form-control-dark mb-2' placeholder='Suche nach einem Namen' type='text' @input='search()' />

        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Dictionary</th>
                    <th>Clip</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='animation in animations' v-bind:key='animation.id' class='entry'>
                    <td>{{ animation.id }}</td>
                    <td>{{ animation.name }}</td>
                    <td>{{ animation.dictionary }}</td>
                    <td>{{ animation.clip }}</td>
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

export default class TeamMenuAnimations extends Vue {
    @Ref() private readonly mailContextElement!: HTMLDivElement;

    private animations: AnimationInterface[] = [];
    private cachedAnimations: AnimationInterface[] = [];
    private searchBar = "";

    public open(): void {
        alt.emitServerWithResponse<AnimationInterface[]>("animationcatalog:open")
            .then((animations: AnimationInterface[]) => {
                this.animations = animations;
                this.cachedAnimations = this.animations;
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
