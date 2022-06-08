import alt from "@/scripts/services/alt.service";
import LiteEvent from "@/scripts/systems/lite-event";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

export default class HouseService {
    private static instance: HouseService;

    private constructor() {
        // do something construct...
    }

    static getInstance() {
        if (!HouseService.instance) {
            HouseService.instance = new HouseService();
            // ... any one time initialization goes here ...
        }
        return HouseService.instance;
    }

    get getHouses() {
        return this.houses;
    }

    get onChange() {
        return this.onHousesChanged.expose();
    }

    private readonly onHousesChanged = new LiteEvent<HouseInterface[]>();
    private houses: HouseInterface[] = [];

    public listenToEvents(): void {
        alt.on("house:updatecharacterhouses", (houses: HouseInterface[]) =>
            this.updateHouses(houses)
        );
    }

    private updateHouses(houses: HouseInterface[]): void {
        this.houses = houses;
        this.onHousesChanged.trigger(this.houses);
    }
}
