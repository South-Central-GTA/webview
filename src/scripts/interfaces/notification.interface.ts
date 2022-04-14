export enum NotificationTypes {
    INFO,
    WARNING,
    ERROR,
    SUCCESS
}

export enum NotificationPositionTypes {
    LEFT,
    RIGHT
}

export interface NotificationInterface {
    type: NotificationTypes;
    text: string;
}