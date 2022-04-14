import {MdcSearchType} from "@/scripts/enums/mdc-search.type";

export interface MdcSearchEntityInterface {
    id: number;
    stringId: string;
    name: string;
    type: MdcSearchType;
}