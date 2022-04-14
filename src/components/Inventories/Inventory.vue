<template>
    <div class="inventory">
        <div class="row">
            <div class="col-7">
                <h5 class="name-text">{{ header }}</h5>
            </div>
            <div class="col-5">
                <p class="weight-text float-end m-0">Gewichtlimit: {{ currentWeight }} / {{ maxWeight }}</p>
            </div>
            <div class="col-12 m-0">
                <input type="text"
                       @focus="onFocus(true)"
                       @blur="onFocus(false)"
                       @input="search()" v-model="itemSearch"
                       id="search-bar"
                       class="form-control float-end m-1 text-white"
                       placeholder="Suche nach bestimmten Item..."/>
            </div>
        </div>

        <div class="items-block">
            <div v-for="item in items" v-bind:key="item.slot">
                <item-slot
                        v-bind:item="item"
                        @click.right="openContextMenu($event, item)"
                        v-on:start-dragging="startDragging"
                        v-on:stop-dragging="stopDragging"/>
            </div>
            <div class="drop-zone" v-if="dropZoneVisible" @mouseup="onMouseUp"></div>
        </div>
    </div>
</template>

<script lang="ts">
import {ItemInterface} from '@/scripts/interfaces/inventory/item.interface';
import ItemSlot from '@/components/Inventories/ItemSlot.vue';
import {Options, Vue} from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";
import {InventoryInterface} from "@/scripts/interfaces/inventory/inventory.interface";
import {onFocus} from "@/scripts/helpers/helpers";
import {ClothingItemTypes} from "@/scripts/enums/clothing-item.types";
import {ClothingInterface} from "@/scripts/interfaces/character/clothing.interface";

@Options({
    components: {
        ItemSlot,
    }
})
export default class Inventory extends Vue {
    @Prop() private readonly inventory!: InventoryInterface;

    private items: ItemInterface[] = [];
    private cachedItems: ItemInterface[] = [];
    private header = "";
    private itemSearch = "";
    private maxWeight = 0;
    private currentWeight = 0;
    private dropZoneVisible = false;
  
    @Watch('inventory')
    private onInventoryPropertyChanged(value: InventoryInterface, oldValue: InventoryInterface): void {
        if (value) {

            value.items.forEach((item: ItemInterface) => {
                if (item.attachedToWeaponItem !== null && item.attachedToWeaponItem !== -1) {
                    const weaponItem = value.items.find(i => i.id == item.attachedToWeaponItem);
                    if (weaponItem !== undefined) {
                        if (weaponItem.attachmentItems === undefined) {
                            weaponItem.attachmentItems = [];
                        }

                        weaponItem.attachmentItems.push(item);
                    }
                }
            });

            // We have to calc. the current weight before removing the attached weapon comps.
            this.currentWeight = this.getWeight(value.items);

            // Remove all attached weapon comps. so there are not getting shown in UI.
            value.items = value.items.filter(i => i.attachedToWeaponItem === -1)

            this.items = value.items.sort((a, b) => (a.slot > b.slot) ? 1 : -1);
            this.maxWeight = value.maxWeight;
            this.cachedItems = this.items;
            this.header = value.name;
        }
    }

    public getFreeSlot(): number {
        return this.items.length;
    }

    public clearSearchBar(): void {
        this.itemSearch = "";
    }
    
    public toggleDropZone(state: boolean): void {
        this.dropZoneVisible = state;
    }

    private openContextMenu(mouseEvent: MouseEvent, item: ItemInterface): void {
        if (!item.catalogItem || item.catalogItem.id === -1) {
            return;
        }

        this.$emit("open-context-menu", mouseEvent, item);
    }

    private startDragging(event: MouseEvent, element: Element, item: ItemInterface): void {
        this.$emit("start-dragging", event, element, item);
    }

    private stopDragging(event: MouseEvent, item: ItemInterface): void {
        this.$emit("stop-dragging", event, item);
    }

    private onMouseUp(event: MouseEvent): void {
        this.$emit("drop-item-in-zone", this.inventory.id);
    }

    private getItemName(item: ItemInterface): string {
        const clothingItemTypes = Object.keys(ClothingItemTypes);
        let name = "";

        if (item.catalogItem) {
            if (clothingItemTypes.indexOf(item.catalogItem.id.toString()) > -1) {
                const data: ClothingInterface = JSON.parse(item.customData);
                name = data.title;
            } else {
                name = item.catalogItem?.name;
            }
        }

        return name;
    }

    private search(): void {
        if (this.itemSearch === "") {
            this.items = this.cachedItems;
            return;
        }

        this.items = this.cachedItems;
        this.items = this.items.filter(i => this.getItemName(i).toLowerCase().includes(this.itemSearch.toLowerCase()));
    }

    private getWeight(items: ItemInterface[]): number {
        let weight = 0;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.catalogItem) {
                weight += item.catalogItem.weight * item.amount;
            }
        }

        return Math.round(weight * 100) / 100
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>
<style scoped lang="scss">
.inventory {
  padding: 0;
}

.items-block {
    overflow-x: hidden;
    overflow-y: auto;
    height: 15.8vw;
    width: 100%;
}

.items-block::-webkit-scrollbar {
    display: none;
}

.name-text {
    margin: 0.5vw;
    font-size: 1vw;
}

.weight-text {
    padding: 0.5vw;
    font-size: 0.8vw;
}

#search-bar {
    width: 10vw;
    font-size: 0.5vw;
    background-color: rgba(0, 0, 0, 0.5);
}

#search-bar::placeholder {
    font-size: 0.5vw;
    color: whitesmoke;
}

.drop-zone {
    background-color: rgba(0, 0, 0, .3);
    height: 3vw;
    border-radius: 0.3vw;
    margin: 0.5vw;
    border-style: dashed;
    border-color: rgba(255, 255, 255, 0.2);
    border-width: thin;
}
</style>