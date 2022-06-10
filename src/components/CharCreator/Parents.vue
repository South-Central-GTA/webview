<template>
    <div class='parents'>
        <h4>Eltern</h4>
        <h5>Mütterlicher Stammbaum</h5>
        <input v-model='blendOneIndex' :max='parentList.length - 1' class='form-range-dark' min='0' type='range' @input='onFatherChanged()' />
        <p>{{ parentList[blendOneIndex].name }}</p>

        <h5>Väterlicher Stammbaum</h5>
        <input v-model='blendTwoIndex' :max='parentList.length - 1' class='form-range-dark' min='0' type='range' @input='onMotherChanged()' />
        <p>{{ parentList[blendTwoIndex].name }}</p>

        <h5>Ähnlichkeit</h5>
        <input v-model='similarity' class='form-range-dark' max='100' min='0' type='range' @input='onsimilarityChanged()' />
        <div>
            <p class='float-start'>Väterlicher Stammbaum</p>
            <p class='float-end'>Mütterlicher Stammbaum</p>
        </div>

        <h5>Haut Ähnlichkeit</h5>
        <input v-model='skinSimilarity' class='form-range-dark' max='100' min='0' type='range' @input='onSkinsimilarityChanged()' />
        <div>
            <p class='float-start'>Väterlicher Stammbaum</p>
            <p class='float-end'>Mütterlicher Stammbaum</p>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {ParentsInterface} from "@/scripts/interfaces/character/parents.interface";

export default class Parents extends Vue {
    private parentList = [{id: 0, name: "Benjamin"}, {id: 1, name: "Daniel"}, {id: 2, name: "Joshua"}, {
        id: 3, name: "Noah"
    }, {id: 4, name: "Andrew"}, {id: 5, name: "Joan"}, {id: 6, name: "Alex"}, {id: 7, name: "Isaac"}, {
        id: 8, name: "Evan"
    }, {id: 9, name: "Ethan"}, {id: 10, name: "Vincent"}, {id: 11, name: "Angel"}, {id: 12, name: "Diego"}, {
        id: 13, name: "Adrian"
    }, {id: 14, name: "Gabriel"}, {id: 15, name: "Michael"}, {id: 16, name: "Santiago"}, {
        id: 17, name: "Kevin"
    }, {id: 18, name: "Louis"}, {id: 19, name: "Samuel"}, {id: 20, name: "Anthony"}, {id: 21, name: "Hannah"}, {
        id: 22, name: "Audrey"
    }, {id: 23, name: "Jasmine"}, {id: 24, name: "Giselle"}, {id: 25, name: "Amelia"}, {
        id: 26, name: "Isabella"
    }, {id: 27, name: "Zoe"}, {id: 28, name: "Ava"}, {id: 29, name: "Camilla"}, {id: 30, name: "Violet"}, {
        id: 31, name: "Sophia"
    }, {id: 32, name: "Eveline"}, {id: 33, name: "Nicole"}, {id: 34, name: "Ashley"}, {id: 35, name: "Grace"}, {
        id: 36, name: "Brianna"
    }, {id: 37, name: "Natalie"}, {id: 38, name: "Olivia"}, {id: 39, name: "Elizabeth"}, {
        id: 40, name: "Charlotte"
    }, {id: 41, name: "Emma"}, {id: 42, name: "John"}, {id: 43, name: "Niko"}, {id: 44, name: "Claude"}, {
        id: 45, name: "Misty"
    },];

    private blendOneIndex = 0;
    private blendTwoIndex = 0;
    private similarity = 50;
    private skinSimilarity = 50;

    private parents: ParentsInterface = {
        father: 0, mother: 21, similarity: 0, skinSimilarity: 0,
    };

    public setParents(parents: ParentsInterface): void {
        this.parents = parents;

        this.blendOneIndex = this.parentList.findIndex((f) => f.id === this.parents.father);
        this.blendTwoIndex = this.parentList.findIndex((f) => f.id === this.parents.mother);
        this.similarity = this.parents.similarity * 100;
        this.skinSimilarity = this.parents.skinSimilarity * 100;
    }

    public reset(): void {
        this.parents = {
            father: 0, mother: 21, similarity: 0, skinSimilarity: 0,
        };

        this.setParents(this.parents);
    }

    private onFatherChanged(): void {
        this.parents.father = this.parentList[this.blendOneIndex].id;
        this.$emit("update-parents", this.parents);
    }

    private onMotherChanged(): void {
        this.parents.mother = this.parentList[this.blendTwoIndex].id;
        this.$emit("update-parents", this.parents);
    }

    private onsimilarityChanged(): void {
        this.parents.similarity = this.similarity * 0.01;
        this.$emit("update-parents", this.parents);
    }

    private onSkinsimilarityChanged(): void {
        this.parents.skinSimilarity = this.skinSimilarity * 0.01;
        this.$emit("update-parents", this.parents);
    }
}
</script>

<style scoped>
.parents {
    padding: 1vw;
    height: 100%;
}

h5 {
    padding-top: 3vw;
}

p {
    margin: unset;
}
</style>
