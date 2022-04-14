import {GenderType} from '@/scripts/enums/gender.type';

export interface PropVariationInterface {
    GenderType: GenderType;
    NameHash: string;
    AnchorPoint: string;
    ComponentType: string;
    ComponentId: number;
    DrawableId: number;
    TextureId: number
    Title: string;
    TranslatedLabel: { [key: string]: string; };
    Price: number;
    RestrictionTags: string[];
}
