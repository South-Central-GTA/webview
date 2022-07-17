import alt from "@/scripts/services/alt.service";
import {VehicleServicePurchaseInterface} from "@/scripts/interfaces/vehicle-service-purchase.interface";
import LiteEvent from "@/scripts/systems/lite-event";
import {VehicleServicePriceTable} from "@/scripts/interfaces/vehicle-service-price-table.interface";
import {VehicleServiceInfoDataInterface} from "@/scripts/interfaces/vehicle-service-info-data.interface";
import {VehicleModType} from "@/scripts/enums/vehicle-mod.type";

class PlayerVehicleWorkshopService {
    get getOrders() {
        return this.orders;
    }
    
    get onMoneyCostsChanged() {
        return this.moneyCostsChanged.expose();
    }
    
    get onProductCostsChanged() {
        return this.productCostsChanged.expose();
    }
    
    get onCompanyProductCountChanged() {
        return this.companyProductCountChanged.expose();
    }
    
    get onPurchasesChanged() {
        return this.purchasesChanged.expose();
    }
    
    private readonly moneyCostsChanged = new LiteEvent<number>();
    private readonly productCostsChanged = new LiteEvent<number>();
    private readonly companyProductCountChanged = new LiteEvent<number>();
    private readonly purchasesChanged = new LiteEvent<VehicleServicePurchaseInterface[]>();
    
    private orders = new Map<VehicleModType, VehicleServicePurchaseInterface>();
    private currentProductPrice!: number;
    private priceTable!: VehicleServicePriceTable;
    private vehiclePrice!: number;
    private vehicleDamagePercentage!: number;
    
    public setup(data: VehicleServiceInfoDataInterface): void {
        this.companyProductCountChanged.trigger(data.productCount);
        this.orders = new Map<VehicleModType, VehicleServicePurchaseInterface>();
        this.currentProductPrice = data.currentProductPrice;
        this.priceTable = data.priceTable;
        this.vehiclePrice = data.vehiclePrice;
        this.vehicleDamagePercentage = data.vehicleDamagePercentage;
    }
    
    public update(productCount: number): void {
        this.companyProductCountChanged.trigger(productCount);
    }
    
    public hasOrder(type: VehicleModType): boolean {
        return this.orders.has(type);
    }
    
    public orderService(type: VehicleModType, value: number = 0) {
        const costs = this.vehiclePrice * 0.05 + this.getPrice(type, value);
        const prods = costs / this.currentProductPrice * 0.3;
        
        this.orders.set(type, {
            type: type,
            value: value + 1,
            name: this.getName(type),
            description: this.getDescription(type),
            moneyCosts: costs,
            productCosts: prods,
        });

        this.updateCosts();
        this.updateTuningParts(type, value);
    }
    
    public resetOrderService(type: VehicleModType) {
        if(!this.orders.has(type)) {
            return;
        }
        
        this.orders.delete(type);

        this.updateCosts();
        this.updateTuningParts(type, -1);
    }
    
    private updateCosts(): void {
        this.moneyCostsChanged.trigger([...this.orders.values()].reduce((a, b) => a + b.moneyCosts, 0));
        this.productCostsChanged.trigger([...this.orders.values()].reduce((a, b) => a + b.productCosts, 0));
        this.purchasesChanged.trigger([...this.orders.values()]);
    }
    
    private updateTuningParts(type: VehicleModType, value: number): void {
        alt.emit("vehicleservice:updatetuningpart", type, value);
    }

    private getPrice(type: VehicleModType, level: number = 0): number {
        switch (type) {
            case VehicleModType.PlateVanity:
                return this.priceTable.plateVanity;
            case VehicleModType.Dashboard:
                return this.priceTable.dashboard;
            case VehicleModType.DoorSpeaker:
                return this.priceTable.doorSpeaker;
            case VehicleModType.Seats:
                return this.priceTable.seats;
            case VehicleModType.Speaker:
                return this.priceTable.speaker;
            case VehicleModType.Trunk:
                return this.priceTable.trunk;
            case VehicleModType.EngineBlock:
                return this.priceTable.engineBlock;
            case VehicleModType.BoostOrAirFilter:
                return this.priceTable.boostOrAirFilter;
            case VehicleModType.Struts:
                return this.priceTable.struts;
            case VehicleModType.ArchCover:
                return this.priceTable.archCover;
            case VehicleModType.Aerials:
                return this.priceTable.aerials;
            case VehicleModType.Trim:
                return this.priceTable.trim;
            case VehicleModType.Tank:
                return this.priceTable.tank;
            case VehicleModType.Windows:
                return this.priceTable.windows;
            case VehicleModType.Spoilers:
                return this.priceTable.spoilers;
            case VehicleModType.FrontBumper:
                return this.priceTable.frontBumper;
            case VehicleModType.RearBumper:
                return this.priceTable.rearBumper;
            case VehicleModType.SideSkirt:
                return this.priceTable.sideSkirt;
            case VehicleModType.Exhaust:
                return this.priceTable.exhaust;
            case VehicleModType.Frame:
                return this.priceTable.frame;
            case VehicleModType.Grille:
                return this.priceTable.grille;
            case VehicleModType.Hood:
                return this.priceTable.hood;
            case VehicleModType.Fender:
                return this.priceTable.fender;
            case VehicleModType.RightFender:
                return this.priceTable.rightFender;
            case VehicleModType.Roof:
                return this.priceTable.roof;
            case VehicleModType.Engine:
                return this.priceTable.engine[level];
            case VehicleModType.Brakes:
                return this.priceTable.brakes[level];
            case VehicleModType.Transmission:
                return this.priceTable.transmission;
            case VehicleModType.Horns:
                return this.priceTable.horns;
            case VehicleModType.Suspension:
                return this.priceTable.suspension;
            case VehicleModType.Armor:
                return this.priceTable.armor;
            case VehicleModType.Turbo:
                return this.priceTable.turbo;
            case VehicleModType.Xenon:
                return this.priceTable.xenon;
            case VehicleModType.FrontWheels:
                return this.priceTable.frontWheels;
            case VehicleModType.BackWheels:
                return this.priceTable.backWheels;
            case VehicleModType.PlateHolder:
                return this.priceTable.plateholders;
            case VehicleModType.TrimDesign:
                return this.priceTable.trimDesign;
            case VehicleModType.Ornaments:
                return this.priceTable.ornaments;
            case VehicleModType.DialDesign:
                return this.priceTable.dialDesign;
            case VehicleModType.SteeringWheel:
                return this.priceTable.steeringWheel;
            case VehicleModType.ShiftLever:
                return this.priceTable.shiftLever;
            case VehicleModType.Plaques:
                return this.priceTable.plaques;
            case VehicleModType.Hydraulics:
                return this.priceTable.hydraulics;
            case VehicleModType.WindowTint:
                return this.priceTable.windowTint;
            case VehicleModType.Livery:
                return this.priceTable.livery;
            case VehicleModType.Plate:
                return this.priceTable.plate;
            case VehicleModType.Colour1:
                return this.priceTable.colour1;
            case VehicleModType.Colour2:
                return this.priceTable.colour2;
        }

        return 0;
    }

    public getName(type: VehicleModType): string {
        switch (type) {
            default:
                return "*Übersetzung fehlt*";
            case VehicleModType.PlateVanity:
                return "Nummernschild Art";
            case VehicleModType.Dashboard:
                return "Dashboard";
            case VehicleModType.DoorSpeaker:
                return "Türlautsprecher";
            case VehicleModType.Seats:
                return "Sitze";
            case VehicleModType.Speaker:
                return "Lautsprecher";
            case VehicleModType.Trunk:
                return "Kofferraum";
            case VehicleModType.EngineBlock:
                return "Motorblock";
            case VehicleModType.BoostOrAirFilter:
                return "Boost";
            case VehicleModType.Struts:
                return "Streben";
            case VehicleModType.ArchCover:
                return "Radabdeckung";
            case VehicleModType.Aerials:
                return "Antenne";
            case VehicleModType.Trim:
                return "Armaturenbrett";
            case VehicleModType.Tank:
                return "Tank";
            case VehicleModType.Windows:
                return "Fenster";
            case VehicleModType.Spoilers:
                return "Heckspoiler";
            case VehicleModType.FrontBumper:
                return "Frontstoßstange";
            case VehicleModType.RearBumper:
                return "Heckstoßstange";
            case VehicleModType.SideSkirt:
                return "Seitenleiste";
            case VehicleModType.Exhaust:
                return "Auspuffanlage";
            case VehicleModType.Frame:
                return "Rahmen";
            case VehicleModType.Grille:
                return "Kühlergrill";
            case VehicleModType.Hood:
                return "Motorhaube";
            case VehicleModType.Fender:
                return "Linker Flügel";
            case VehicleModType.RightFender:
                return "Rechter Flügel";
            case VehicleModType.Roof:
                return "Dach";
            case VehicleModType.Engine:
                return "Motorleistung";
            case VehicleModType.Brakes:
                return "Bremsen";
            case VehicleModType.Transmission:
                return "Getriebe";
            case VehicleModType.Horns:
                return "Hupe";
            case VehicleModType.Suspension:
                return "Federung";
            case VehicleModType.Armor:
                return "Panzerung";
            case VehicleModType.Turbo:
                return "Turbo";
            case VehicleModType.Xenon:
                return "Xenon";
            case VehicleModType.FrontWheels:
                return "Reifen";
            case VehicleModType.BackWheels:
                return "Hinterreifen";
            case VehicleModType.PlateHolder:
                return "Numernschildhalterung";
            case VehicleModType.TrimDesign:
                return "Felgen";
            case VehicleModType.Ornaments:
                return "Instrumententafel";
            case VehicleModType.DialDesign:
                return "Zifferblattdesign";
            case VehicleModType.SteeringWheel:
                return "Lenkrad";
            case VehicleModType.ShiftLever:
                return "Schalter";
            case VehicleModType.Plaques:
                return "Plaketten";
            case VehicleModType.Hydraulics:
                return "Hydraulik";
            case VehicleModType.WindowTint:
                return "Fenster";
            case VehicleModType.Livery:
                return "Lackierung";
            case VehicleModType.Plate:
                return "Nummernschild";
            case VehicleModType.Colour1:
                return "Primärfarbe";
            case VehicleModType.Colour2:
                return "Sekundärfarbe";
        }
    }

    private getDescription(type: VehicleModType): string {
        switch (type) {
            default:
                return "*Übersetzung fehlt*";
            case VehicleModType.PlateVanity:
                return "Nummernschild Art";
            case VehicleModType.Dashboard:
                return "Dashboard";
            case VehicleModType.DoorSpeaker:
                return "Türlautsprecher";
            case VehicleModType.Seats:
                return "Sitze";
            case VehicleModType.Speaker:
                return "Lautsprecher";
            case VehicleModType.Trunk:
                return "Kofferraum";
            case VehicleModType.EngineBlock:
                return "Motorblock";
            case VehicleModType.BoostOrAirFilter:
                return "Boost";
            case VehicleModType.Struts:
                return "Streben";
            case VehicleModType.ArchCover:
                return "Radabdeckung";
            case VehicleModType.Aerials:
                return "Antenne";
            case VehicleModType.Trim:
                return "Armaturenbrett";
            case VehicleModType.Tank:
                return "Tank";
            case VehicleModType.Windows:
                return "Fenster";
            case VehicleModType.Spoilers:
                return "Heckspoiler";
            case VehicleModType.FrontBumper:
                return "Frontstoßstange";
            case VehicleModType.RearBumper:
                return "Heckstoßstange";
            case VehicleModType.SideSkirt:
                return "Seitenleiste";
            case VehicleModType.Exhaust:
                return "Auspuffanlage";
            case VehicleModType.Frame:
                return "Rahmen";
            case VehicleModType.Grille:
                return "Kühlergrill";
            case VehicleModType.Hood:
                return "Motorhaube";
            case VehicleModType.Fender:
                return "Linker Flügel";
            case VehicleModType.RightFender:
                return "Rechter Flügel";
            case VehicleModType.Roof:
                return "Dach";
            case VehicleModType.Engine:
                return "Motorleistung";
            case VehicleModType.Brakes:
                return "Bremsen";
            case VehicleModType.Transmission:
                return "Getriebe";
            case VehicleModType.Horns:
                return "Hupe";
            case VehicleModType.Suspension:
                return "Federung";
            case VehicleModType.Armor:
                return "Panzerung";
            case VehicleModType.Turbo:
                return "Turbo";
            case VehicleModType.Xenon:
                return "Xenon";
            case VehicleModType.FrontWheels:
                return "Reifen";
            case VehicleModType.BackWheels:
                return "Hinterreifen";
            case VehicleModType.PlateHolder:
                return "Numernschildhalterung";
            case VehicleModType.TrimDesign:
                return "Felgen";
            case VehicleModType.Ornaments:
                return "Instrumententafel";
            case VehicleModType.DialDesign:
                return "Zifferblattdesign";
            case VehicleModType.SteeringWheel:
                return "Lenkrad";
            case VehicleModType.ShiftLever:
                return "Schalter";
            case VehicleModType.Plaques:
                return "Plaketten";
            case VehicleModType.Hydraulics:
                return "Hydraulik";
            case VehicleModType.WindowTint:
                return "Fenster";
            case VehicleModType.Livery:
                return "Lackierung";
            case VehicleModType.Plate:
                return "Nummernschild";
            case VehicleModType.Colour1:
                return "Primärfarbe";
            case VehicleModType.Colour2:
                return "Sekundärfarbe";
        }
    }

    public resetRepairOrderService(): void {
        if(!this.orders.has(VehicleModType.Repair)) {
            return;
        }

        this.orders.delete(VehicleModType.Repair);

        this.updateCosts();
    }

    public orderRepairService(): void {
        const costs = (this.vehiclePrice * 0.01) * (this.vehicleDamagePercentage);
        const prods = costs / this.currentProductPrice * 0.3;

        this.orders.set(VehicleModType.Repair, {
            type: VehicleModType.Repair,
            value: 2,
            name: "Fahrzeugreperatur",
            description: "Vollständige Reparatur des Fahrzeugs.",
            moneyCosts: costs,
            productCosts: prods,
        });

        this.updateCosts();
    }


    public updateProducts(products: number): void {
        this.companyProductCountChanged.trigger(products);
    }
}

// Export a singleton instance in the global namespace
export const playerVehicleWorkshopService = new PlayerVehicleWorkshopService();