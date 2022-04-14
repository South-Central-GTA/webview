<template>
    <div class="spawn-selector">
        <div class="selected-box sc-card text-white" v-if="selectedSpawn.id !== -1">
            <h4>Ausgewählter Spawn</h4>
            <h6>{{ selectedSpawn.name }}</h6>
            <button type="button" class="btn btn-secondary" @click="show()">Anschauen</button>
        </div>

        <div class="select-box sc-card text-white bottom-center">
            <div class="menu">
                <div class="left">
                    <button type="button" class="btn btn-secondary" @click="change(-1)">
                        <font-awesome-icon icon="caret-left"/>
                    </button>
                </div>

                <div class="w-100">
                    <h5 class="text-center" style="height:2vw">{{ currentSpawn.name }}</h5>
                    <button type="button" class="btn btn-primary" @click="select()"
                            :disabled="selectedSpawn.name === currentSpawn.name">Auswählen
                    </button>
                </div>

                <div class="right">
                    <button type="button" class="btn btn-secondary" @click="change(1)">
                        <font-awesome-icon icon="caret-right"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from '@/scripts/services/alt.service';
import {SpawnInterface} from '@/scripts/interfaces/spawn.interface'
import {Vue} from "vue-class-component";

export default class SpawnSelector extends Vue {
    private buttonDisabled = false;
    private selectButtonDisabled = false;

    private currentSpawn: SpawnInterface = {
        id: -1,
        name: ""
    };

    private selectedSpawn: SpawnInterface = {
        id: -1,
        name: ""
    };

    public mounted(): void {
        alt.on("spawnselector:setinfo", (spawn: SpawnInterface) => this.setInfo(spawn));
        alt.on("spawnselector:defaultselect", (spawn: SpawnInterface) => this.defaultSelect(spawn));
    }
    
    public unmounted(): void {
        alt.off("spawnselector:setinfo");
        alt.off("spawnselector:defaultselect");
    }

    private setInfo(spawn: SpawnInterface): void {
        this.currentSpawn = spawn;

        this.buttonDisabled = false;

        if (this.currentSpawn.id === this.selectedSpawn.id) {
            this.selectButtonDisabled = true;
        }
    }

    private change(direction: number): void {
        this.buttonDisabled = true;

        alt.emit("spawnselector:change", direction);

        this.selectButtonDisabled = false;
    }

    private defaultSelect(spawn: SpawnInterface): void {
        this.selectedSpawn = spawn;

        this.selectButtonDisabled = false;
        if (this.currentSpawn.id === this.selectedSpawn.id) {
            this.selectButtonDisabled = true;
        }
    }

    private select(): void {
        alt.emit("spawnselector:select", this.currentSpawn.id);

        this.selectedSpawn = this.currentSpawn;
        this.selectButtonDisabled = true;
    }

    private show(): void {
        alt.emit("spawnselector:show");
    }
}
</script>

<style scoped>
.selected-box {
    width: 20vw;
    margin: 1vw;
    padding: 1vw;
    border-radius: 0.3vw;
}

.select-box {
    padding: 0.5vw;
    margin-bottom: 1vw;
    width: 20vw;
}

.btn {
    width: 100%;
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
</style>