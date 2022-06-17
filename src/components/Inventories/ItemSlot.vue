<template>
    <div class='item-slot row' v-bind:class='{ 
            poor: this.item.catalogItem.rarity === 0, 
            common: this.item.catalogItem.rarity === 1, 
            uncommon: this.item.catalogItem.rarity === 2, 
            rare: this.item.catalogItem.rarity === 3, 
            epic: this.item.catalogItem.rarity === 4, 
            legendary: this.item.catalogItem.rarity === 5}' @mousedown='onMouseDown' @mouseup='onMouseUp'>
        <div class='col-1'>
            <img :src='getImage(item)' class='item-icon' />
            <img v-if='!this.item.isBought' class='unbought-icon' src='@/assets/images/coupon.png' />
            <img v-if='this.item.itemState === 2' class='equipp-icon' src='@/assets/images/equipped-icon.png' />
            <img v-if='this.item.itemState === 3' class='equipp-icon' src='@/assets/images/force-equipped-icon.png' />
        </div>
        <div class='col-9'>
            <div class='row'>
                <div class='col-12'>
                    <p>{{ this.getItemName(item) }} <span class='note-text'>{{ item.note }}</span></p>
                </div>
                <div class='col-12 description-text text-white-50'>
                    <p>{{ this.item.catalogItem.description }}</p>
                    <div v-if='this.item.attachmentItems'>
                        <p>Angebaute Erweiterungen:</p>
                        <div v-for='attachedWeaponComponent in this.item.attachmentItems' v-bind:key='attachedWeaponComponent.id'>
                            <div class='row'>
                                <div class='col-1'>
                                    <img :src='getImage(attachedWeaponComponent)' class='attached-weapon-component-icon' />
                                </div>
                                <div class='col-9 pt-1'>
                                    <div class='col-12'>
                                        <p>{{ this.getName(attachedWeaponComponent) }}</p>
                                    </div>
                                    <div class='col-12 note-text'>
                                        <p>{{ attachedWeaponComponent.noten }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='col-2'>
            <p v-if='this.item.amount > 1 && this.item.catalogItem.stackable'>x{{ this.item.amount }}</p>
        </div>
    </div>
</template>

<script lang='ts'>
import {ItemInterface} from '@/scripts/interfaces/inventory/item.interface';
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {ItemState} from "@/scripts/enums/item.state";
import {ClothingItemTypes} from "@/scripts/enums/clothing-item.types";
import {ClothingInterface} from "@/scripts/interfaces/character/clothing.interface";

export default class ItemSlot extends Vue {
    @Prop() private readonly item!: ItemInterface;

    private onMouseDown(event: MouseEvent): void {
        if (event.button === 2) {
            return;
        }

        if (this.item.itemState === ItemState.EQUIPPED || this.item.itemState === ItemState.FORCE_EQUIPPED) {
            return;
        }

        this.$emit("start-dragging", event, this.$el, this.item);
    }

    private onMouseUp(event: MouseEvent): void {
        this.$emit("stop-dragging", event, this.item);
    }

    private getImage(item: ItemInterface): string {
        if (!item.catalogItem) {
            return "";
        }

        const images = require.context('@/assets/images/item_icons/', false, /\.png$/);
        return images("./" + item.catalogItem.image + ".png");
    }

    private getItemName(item: ItemInterface): string {
        const clothingItemTypes = Object.keys(ClothingItemTypes);
        let name = "";
        
        if (item.catalogItem) {
            if (clothingItemTypes.indexOf(item.catalogItem.id.toString()) > -1 && item.title !== undefined) {
                name = item.title;
            } else {
                name = item.catalogItem?.name;
            }
        }

        return name;
    }
}
</script>
<style lang='scss' scoped>
.item-slot {
    position: relative;
    pointer-events: all;
}

p {
    margin: unset;
}

.note-text {
    font-size: 0.5vw;
    color: #f1c40f;
}

.description-text {
    font-size: 0.5vw;
}

.unbought-icon {
    width: 1vw;
    height: auto;
    position: absolute;
    top: 20%;
    left: 2.5%;
}

.equipp-icon {
    width: 0.5vw;
    height: auto;
    position: absolute;
    top: 5%;
    left: 2.5%;
}

.item-icon {
    width: 1.8vw;
    margin: 0.5vw;
}

.attached-weapon-component-icon {
    width: 0.5vw;
    margin: 0.5vw;
}

.poor {
    background-color: rgba(127, 140, 141, .2);
}

.common {
    background-color: rgba(95, 95, 95, .2);
}

.uncommon {
    background-color: rgba(46, 204, 113, .2);
}

.rare {
    background-color: rgba(52, 152, 219, .2);
}

.epic {
    background-color: rgba(132, 23, 175, .2);
}

.legendary {
    background-color: rgba(211, 84, 0, .2);
}
</style>
