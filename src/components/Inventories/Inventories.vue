<template>
    <div ref='inventories' :hidden='!active' class='inventories'>
        <div class='row own-inventories text-white'>
            <inventory ref='ownInventory' class='transparent-card col-11' v-bind:inventory='ownInventories[activeOwnInventoryIndex]' v-on:open-context-menu='requestItemContextMenu' v-on:start-dragging='startItemDragging' v-on:stop-dragging='stopItemDragging' v-on:drop-item-in-zone='dropItemInZone' />
            <div v-if='ownInventories.length !== 1' class='button-holder col'>
                <div v-for='ownInventory in ownInventories' v-bind:key='ownInventory.id'>
                    <button type='button' v-bind:class="{
              'inventory-button':
                activeOwnInventoryIndex !==
                ownInventories.indexOf(ownInventory),
              'inventory-button-active':
                activeOwnInventoryIndex ===
                ownInventories.indexOf(ownInventory),
            }" @click='openOwnInventory(ownInventory.id)' @mouseup='onMouseUpOnInventoryButton(ownInventory.id)'>
                        <font-awesome-icon :icon='getInventoryIcon(ownInventory.inventoryType)' />
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='extraneousInventories.length === 0' class='row extraneous-inventories text-white'>
            <inventory ref='extraneousInventory' class='transparent-card col-11' v-bind:inventory='extraneousInventories[activeExtraneousInventoryIndex]' v-on:open-context-menu='requestItemContextMenu' v-on:start-dragging='startItemDragging' v-on:stop-dragging='stopItemDragging' v-on:drop-item-in-zone='dropItemInZone' />

            <div v-if='extraneousInventories.length !== 1' class='button-holder col'>
                <div v-for='extraneousInventory in extraneousInventories' v-bind:key='extraneousInventory.id'>
                    <button type='button' v-bind:class="{
              'inventory-button':
                activeExtraneousInventoryIndex !==
                extraneousInventories.indexOf(extraneousInventory),
              'inventory-button-active':
                activeExtraneousInventoryIndex ===
                extraneousInventories.indexOf(extraneousInventory),
            }" @click='openExtraneousInventory(extraneousInventory.id)' @mouseup='onMouseUpOnInventoryButton(extraneousInventory.id)'>
                        <font-awesome-icon :icon='getInventoryIcon(extraneousInventory.inventoryType)' />
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='!isSplitOpen' class='modal-dialog' style='width: 20vw; top: 40%'>
            <div class='modal-content sc-dark text-white'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Item aufteilen</h5>
                    <button class='icon-button float-end p-3' type='button' @click='closeMenu()'>
                        <font-awesome-icon class='center text-white' icon='times' />
                    </button>
                </div>
                <div class='modal-body'>
                    <p>Wie viel möchtest du von diesem Item aufteilen?</p>
                    <input v-model='splitAmount' class='form-control-dark' maxlength='10' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' style='margin-bottom: 1vw' type='number' @blur='onFocus(false)' @focus='onFocus(true)' @input='onSplitInput()' @keypress='allowOnlyNumbers($event)' v-on:keydown.enter='onSplitClicked()' />
                </div>
                <div class='modal-footer'>
                    <button :disabled='splitButtonDisabled' class='btn btn-primary w-50' type='button' @click='onSplitClicked()'>
                        Aufteilen
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='!isNoteOpen' class='modal-dialog' style='width: 20vw; top: 40%'>
            <div class='modal-content sc-dark text-white'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Notiz schreiben</h5>
                    <button class='icon-button float-end p-3' type='button' @click='closeMenu()'>
                        <font-awesome-icon class='center text-white' icon='times' />
                    </button>
                </div>
                <div class='modal-body'>
                    <p>Welche Notiz möchtest du an dem Item heften?</p>
                    <input v-model='itemNote' class='form-control-dark' maxlength='28' style='margin-bottom: 1vw' type='text' @blur='onFocus(false)' @focus='onFocus(true)' v-on:keydown.enter='onSetNoteClicked()' />
                </div>
                <div class='modal-footer'>
                    <button class='btn btn-primary w-50' type='button' @click='onSetNoteClicked()'>
                        Notieren
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='!isRenameOpen' class='modal-dialog' style='width: 20vw; top: 40%'>
            <div class='modal-content sc-dark text-white'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Namen ersetzen</h5>
                    <button class='icon-button float-end p-3' type='button' @click='closeMenu()'>
                        <font-awesome-icon class='center text-white' icon='times' />
                    </button>
                </div>
                <div class='modal-body'>
                    <p>Wie soll das Kleidungsstück heißen?</p>
                    <input v-model='itemName' class='form-control-dark' maxlength='32' style='margin-bottom: 1vw' type='text' @blur='onFocus(false)' @focus='onFocus(true)' v-on:keydown.enter='onSetNameClicked()' />
                </div>
                <div class='modal-footer'>
                    <button class='btn btn-primary w-50' type='button' @click='onSetNameClicked()'>
                        Notieren
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='!isCharactersAroundOpen' class='modal-dialog' style='width: 20vw; top: 40%'>
            <div class='modal-content sc-dark text-white'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Item übergeben</h5>
                    <button class='icon-button float-end p-3' type='button' @click='closeMenu()'>
                        <font-awesome-icon class='center text-white' icon='times' />
                    </button>
                </div>
                <div class='modal-body'>
                    <p>Welchen Charakter möchtest du das Item übergeben?</p>

                    <div class='characters-list'>
                        <div v-for='character in charactersAroundPlayer' v-bind:key='character.id'>
                            <button class='btn btn-secondary mt-1' type='button' @click='giveItemToCharacter(character.id)'>
                                {{ character.firstName }} {{ character.lastName }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import Inventory from "./Inventory.vue";
import {allowOnlyNumbers, onFocus} from "@/scripts/helpers/helpers";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {MenuItem} from "@imengyu/vue3-context-menu";
import {ItemInterface} from "@/scripts/interfaces/inventory/item.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {InventoryInterface} from "@/scripts/interfaces/inventory/inventory.interface";
import {ItemState} from "@/scripts/enums/item.state";
import {ActionInterface} from "@/scripts/interfaces/action.interface";
import {InventoryType} from "@/scripts/enums/inventory.type";
import {ClothingInterface} from "@/scripts/interfaces/character/clothing.interface";
import {ClothingItemTypes} from "@/scripts/enums/clothing-item.types";

@Options({
    components: {
        Inventory,
    },
})
export default class Inventories extends Vue {
    @Ref() private readonly inventories!: HTMLElement;
    @Ref() private readonly ownInventory!: Inventory;
    @Ref() private readonly extraneousInventory!: Inventory;
    @Ref() private readonly actionMenu!: HTMLElement;

    private active = false;

    private showcaseItem: HTMLElement | undefined;
    private currentItem: ItemInterface | undefined;

    private charactersAroundPlayer: CharacterInterface[] = [];

    private ownInventories: InventoryInterface[] = [];
    private activeOwnInventoryIndex: number = 0;

    private extraneousInventories: InventoryInterface[] = [];
    private activeExtraneousInventoryIndex: number = 0;

    private isSplitOpen = false;
    private splitAmount = "";

    private isNoteOpen = false;
    private itemNote = "";

    private isRenameOpen = false;
    private itemName = "";

    private pageX = 0;
    private pageY = 0;

    private splitButtonDisabled = false;

    private isCharactersAroundOpen = false;

    public mounted(): void {
        alt.emit("inventory:ready");

        alt.on("inventory:toggleui", (state: boolean) => this.toggleUI(state));
        alt.on("inventory:setup", (inventories: InventoryInterface[]) => this.setup(inventories));
        alt.on("inventory:sendcharactersinrange", (args: any[]) => this.openCharactersAroundMenu(args[0]));
        alt.on("itemactions:opencontextmenu", (args: any[]) => this.openItemContextMenu(args[0]));

        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
    }

    public unmounted(): void {
        alt.off("inventory:toggleui");
        alt.off("inventory:setup");
        alt.off("inventory:sendcharactersinrange");
        alt.off("itemactions:opencontextmenu");

        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);

        // TODO: clear current context on close and here.
    }

    private requestItemContextMenu(mouseEvent: MouseEvent, item: ItemInterface): void {
        if (item.itemState === ItemState.FORCE_EQUIPPED) {
            return;
        }

        mouseEvent.preventDefault();
        this.pageX = mouseEvent.pageX;
        this.pageY = mouseEvent.pageY;

        this.currentItem = item;

        alt.emitServer("itemactions:get", item.id);
    }

    private openItemContextMenu(actions: ActionInterface[]): void {
        let items: MenuItem[] = [];

        actions.forEach((action: ActionInterface) => {
            items.push({
                label: action.title, onClick: () => {
                    this.chooseItemAction(action);
                },
            });
        });

        this.$contextmenu({
            x: this.pageX, y: this.pageY, items: items,
        });
    }

    private startItemDragging(event: MouseEvent, element: Element, item: ItemInterface): void {
        if (this.ownInventories
            .flatMap((i) => i.items)
            .findIndex((i) => i.id === item.id) !== -1) {
            if (this.extraneousInventory !== null) {
                this.extraneousInventory?.toggleDropZone(true);
            }

            if (this.ownInventory !== null) {
                this.ownInventory?.toggleDropZone(false);
            }
        }

        if (this.extraneousInventories
            .flatMap((i) => i.items)
            .findIndex((i) => i.id === item.id) !== -1) {
            if (this.extraneousInventory !== null) {
                this.extraneousInventory?.toggleDropZone(false);
            }

            if (this.ownInventory !== null) {
                this.ownInventory?.toggleDropZone(true);
            }
        }

        const itemElement = element as HTMLElement;

        this.showcaseItem = itemElement.cloneNode(true) as HTMLElement;
        this.showcaseItem.style.width = "28vw";
        this.showcaseItem.style.color = "white";
        this.showcaseItem.style.opacity = "0.85";
        this.showcaseItem.style.pointerEvents = "none";

        this.inventories.appendChild(this.showcaseItem);
        this.updatePlaceholderPosition(event);

        this.currentItem = item;
    }

    private stopItemDragging(event: MouseEvent, item: ItemInterface): void {
        if (this.showcaseItem) {
            if (!this.currentItem || item.itemState === ItemState.EQUIPPED || item.itemState === ItemState.FORCE_EQUIPPED) {
                return;
            }

            alt.emit("inventory:swapitem", this.currentItem.id, item.id);
        }
    }

    private dropItemInZone(inventoryId: number): void {
        this.switchItem(inventoryId);
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.showcaseItem) {
            this.updatePlaceholderPosition(event);
        }
    }

    private onMouseUp(): void {
        this.extraneousInventory.toggleDropZone(false);
        this.ownInventory.toggleDropZone(false);

        if (this.showcaseItem) {
            this.showcaseItem.remove();
            this.showcaseItem = undefined;
        }
    }

    private toggleUI(state: boolean): void {
        this.ownInventory.clearSearchBar();
        this.extraneousInventory.clearSearchBar();

        this.resetVariables();
        this.active = state;

        if (!state) {
            this.ownInventories = [];
            this.extraneousInventories = [];
        }
    }

    private setup(inventories: InventoryInterface[]): void {
        this.ownInventories = [];
        this.extraneousInventories = [];

        inventories.forEach((inventory: InventoryInterface) => {
            switch (inventory.inventoryType) {
                case InventoryType.PLAYER:
                case InventoryType.CLOTHING:
                    this.ownInventories.push(inventory);
                    break;
                case InventoryType.GROUP_MEMBER:
                case InventoryType.HOUSE:
                case InventoryType.VEHICLE:
                case InventoryType.FRISK:
                    this.extraneousInventories.push(inventory);
                    break;
            }
        });
    }

    private closeMenu(): void {
        this.resetVariables();
    }

    private onSplitInput(): void {
        const amount = Number.parseInt(this.splitAmount);
        const maxAmount = this.currentItem?.amount;

        this.splitButtonDisabled = false;

        if (!maxAmount) {
            this.splitButtonDisabled = true;
            return;
        }

        if (!amount) {
            this.splitButtonDisabled = true;
            return;
        }

        if (amount < 1) {
            this.splitButtonDisabled = true;
            return;
        }

        if (amount >= maxAmount) {
            this.splitButtonDisabled = true;
            return;
        }
    }

    private onSplitClicked(): void {
        const amount = Number.parseInt(this.splitAmount);
        const maxAmount = this.currentItem?.amount;

        if (!maxAmount) {
            return;
        }

        if (!this.splitAmount) {
            return;
        }

        if (amount < 1) {
            return;
        }

        if (amount >= maxAmount) {
            return;
        }

        alt.emit("inventory:splititem", this.currentItem?.id, amount);
        this.splitAmount = "";

        this.resetVariables();
    }

    private onSetNoteClicked(): void {
        alt.emit("inventory:noteitem", this.currentItem?.id, this.itemNote);
        this.itemNote = "";

        this.isNoteOpen = false;
    }

    private onSetNameClicked(): void {
        if (this.itemName.length === 0) {
            alt.emit("notification:error", "Bitte definiere einen Namen für dieses Kleidungsitem.");
            return;
        } else if (this.itemName.length <= 5) {
            alt.emit("notification:error", "Der Name ist zu kurz.");
            return;
        } else if (!/^[1-9a-zA-ZÀ-ž, ]*$/.test(this.itemName)) {
            alt.emit("notification:error", "Diese Art von Sonderzeichen ist nicht erlaubt.");
            return;
        }

        alt.emit("inventory:renameitem", this.currentItem?.id, this.itemName);
        this.itemName = "";

        this.isRenameOpen = false;
    }

    private openCharactersAroundMenu(characters: CharacterInterface[]): void {
        this.charactersAroundPlayer = characters;
        this.isCharactersAroundOpen = true;
    }

    private chooseItemAction(action: ActionInterface): void {
        if (this.currentItem === undefined) {
            return;
        }

        if (action.event === "item:setnote") {
            this.isNoteOpen = true;
            return;
        }

        if (action.event === "item:rename") {
            this.isRenameOpen = true;
            return;
        }

        if (action.event === "item:split") {
            this.isSplitOpen = true;
            return;
        }

        if (action.event === "item:placeonground") {
            alt.emit("item:placeonground", this.currentItem.id);
            return;
        }

        if (action.event === "item:removeattachment") {
            if (action.customData === undefined) {
                return;
            }

            alt.emitServer("item:removeattachment", Number.parseInt(action.customData));
            return;
        }

        alt.emitServer(action.event, this.currentItem.id);

        if (action.event !== "item:getplayersaround") {
            this.resetVariables();
        }
    }

    private giveItemToCharacter(charId: number): void {
        alt.emit("item:giveitemtocharacter", charId, this.currentItem?.id);
        this.resetVariables();
    }

    private resetVariables(): void {
        this.showcaseItem?.remove();
        this.showcaseItem = undefined;
        this.currentItem = undefined;

        this.charactersAroundPlayer = [];

        this.isSplitOpen = false;
        this.isNoteOpen = false;
        this.isRenameOpen = false;
        this.isCharactersAroundOpen = false;
        this.splitAmount = "";
        this.itemNote = "";
        this.itemName = "";
    }

    private updatePlaceholderPosition(event: MouseEvent): void {
        if (!this.showcaseItem) {
            return;
        }

        this.showcaseItem.style.left = event.pageX - this.showcaseItem.offsetWidth * 0.5 + "px";
        this.showcaseItem.style.top = event.pageY - this.showcaseItem.offsetHeight * 0.5 + "px";
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

    private onMouseUpOnInventoryButton(inventoryId: number): void {
        this.switchItem(inventoryId);
    }

    private switchItem(inventoryId: number): void {
        this.extraneousInventory.toggleDropZone(false);
        this.ownInventory.toggleDropZone(false);

        if (this.showcaseItem) {
            if (!this.currentItem) {
                return;
            }

            alt.emit("inventory:switchitem", inventoryId, this.currentItem.id);
        }
    }

    private openOwnInventory(id: number): void {
        const inventory = this.ownInventories.find((ei) => ei.id === id);
        if (!inventory) {
            return;
        }

        this.ownInventory.clearSearchBar();
        this.activeOwnInventoryIndex = this.ownInventories.indexOf(inventory);
    }

    private openExtraneousInventory(id: number): void {
        const inventory = this.extraneousInventories.find((ei) => ei.id === id);
        if (!inventory) {
            return;
        }

        this.extraneousInventory.clearSearchBar();
        this.activeExtraneousInventoryIndex = this.extraneousInventories.indexOf(inventory);
    }

    private getInventoryIcon(type: InventoryType): string {
        switch (type) {
            case 0:
                return "user";
            case 1:
                return "car";
            case 2:
                return "box";
            case 3:
                return "users";
            case 4:
                return "shopping-bag";
            default:
                return "";
        }
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style lang='scss' scoped>
.inventories {
    position: absolute;
    width: 100%;
    height: 100%;
}

.own-inventories {
    position: absolute;
    bottom: 1%;
    left: 50%;
    width: 32vw;
    height: 20vw;
    transform: translate(-100%, 0%);
    overflow: hidden;
}

.extraneous-inventories {
    position: absolute;
    bottom: 1%;
    right: 50%;
    width: 32vw;
    height: 20vw;
    transform: translate(100%, 0%);
    overflow: hidden;
}

.col {
    padding-right: 0;
    padding-left: 0;
}

.inventory-button {
    height: 2vw;
    width: 2vw;
    border: 0;
    outline: 0;
    border-radius: 0 0.3vw 0.3vw 0;
    color: white;
    margin-bottom: 0.2vw;
    background-color: rgba(0, 0, 0, 0.3);
}

.inventory-button-active {
    @extend .inventory-button;
    background-color: rgba(0, 0, 0, 0.5);
}

.action-menu {
    position: absolute;
    width: 200px;
}

.action-menu button {
    padding: 10px;
    width: 100%;
}

.dialog-menu-button {
    margin: 0.8vw;
}

.dialog-menu-button button {
    width: 100%;
    padding: 0.8vw;
}
</style>
