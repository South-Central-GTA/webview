import {DoorInterface} from "@/scripts/interfaces/door.interface";

export interface HouseInterface {
    id: number;
    houseType: number;
    interiorId: number;
    houseNumber: number;
    subName: string;
    ownerId: number;
    groupOwnerId: number;
    price: number;
    southCentralPoints: number;
    positionX: number;
    positionY: number;
    positionZ: number;
    roll: number;
    pitch: number;
    yaw: number;
    cancelDate: string;
    lockState: number;
    keyItemIds: string;
    doors: DoorInterface[];

    //Only clientside
    streetName: string;
}