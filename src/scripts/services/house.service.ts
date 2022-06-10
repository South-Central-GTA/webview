import alt from "@/scripts/services/alt.service";
import LiteEvent from "@/scripts/systems/lite-event";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

export default class HouseService {
    private static instance: HouseService;
    private readonly onHousesChanged = new LiteEvent<HouseInterface[]>();
    private houses: HouseInterface[] = [];

    private constructor() {
        // do something construct...
    }

    get getHouses() {
        return this.houses;
    }

    get onChange() {
        return this.onHousesChanged.expose();
    }

    static getInstance() {
        if (!HouseService.instance) {
            HouseService.instance = new HouseService();
            // ... any one time initialization goes here ...
        }
        return HouseService.instance;
    }

    public listenToEvents(): void {
        alt.on("house:updatecharacterhouses", (houses: HouseInterface[]) => this.updateHouses(houses));
    }

    private updateHouses(houses: HouseInterface[]): void {
        this.houses = houses;
        this.onHousesChanged.trigger(this.houses);
    }
}
