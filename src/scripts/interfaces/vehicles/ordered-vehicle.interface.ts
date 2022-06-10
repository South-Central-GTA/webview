export interface OrderedVehicleInterface {
    id: number;
    model: string;
    displayName: string;
    displayClass: string;

    orderedBy: string;
    deliverdAt: string;

    deliveryRequestedAtJson: string;
    deliveryRequestedBy: string;
}
