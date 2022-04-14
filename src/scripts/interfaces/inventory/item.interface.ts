import {ItemState} from "@/scripts/enums/item.state";
import {CatalogItemInterface} from "@/scripts/interfaces/catalog-item.interface";

export interface ItemInterface {
    id: number;
    catalogItem?: CatalogItemInterface;
    slot: number;
    customData: string;
    note: string;
    amount: number;
    condition: number;
    isBought: boolean;
    itemState: ItemState;

    // only for weapon attachments
    attachedToWeaponItem?: number;
    attachmentItems?: ItemInterface[];
}
