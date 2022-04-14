import {PedOverlay} from "@/scripts/interfaces/ped/ped-overlay.interface";

export interface PedOverlayCollections {
    CollectionName: string;
    CollectionHash: number;

    Overlays: PedOverlay[];
}
