<template>
    <div class='status-bar'>
        <div class='unextended-menu' @click='toggleExpand()'>
            <div class='right'>
                <font-awesome-icon v-if='missingNotifications' class='blink' icon='envelope' />
                <font-awesome-icon class='connection' icon='signal' />
                <font-awesome-icon v-if='inCall' class='phonecall' icon='phone' />
            </div>
        </div>
        <div v-if='extended' class='extended-menu'>
            <div class='notification-list'>
                <h1>Benachrichtigungen</h1>
                <div v-for='notification in notifications' v-bind:key='notification.id'>
                    <div class='notification' v-bind:class="{
              'maze-bank': notification.type === 1,
              gov: notification.type === 2,
              delivery: notification.type === 3,
            }">
                        <button class='notification-close icon-button' @click='deleteNotification(notification.id)'>
                            <font-awesome-icon icon='times-circle' />
                        </button>
                        <p>{{ notification.context }}</p>
                    </div>
                </div>
                <h2 v-if='notifications.length == 0'>
                    Du hast keine Benachrichtigungen! </h2>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {PhoneNotificationInterface} from "@/scripts/interfaces/phone/phone-notification";

export default class StatusBar extends Vue {
    public inCall = false;
    public missingNotifications = false;
    public extended = false;

    private notifications: PhoneNotificationInterface[] = [];

    public mounted(): void {
        alt.on("phone:pushnotification",
            (notification: PhoneNotificationInterface) => this.pushNotification(notification));
    }

    public unmounted(): void {
        alt.off("phone:pushnotification");
    }

    public setNotifications(notifications: PhoneNotificationInterface[], lastTimeOpenedNotificationsJson: string): void {
        this.notifications = notifications;

        if (this.notifications.length > 0) {
            const lastUsage = new Date(JSON.parse(lastTimeOpenedNotificationsJson));
            const lastMessageDate = new Date(JSON.parse(this.notifications[this.notifications.length - 1].createdAtJson));
            this.missingNotifications = lastUsage < lastMessageDate;
        }
    }

    public toggleExpand(): void {
        this.extended = !this.extended;

        if (this.extended) {
            alt.emit("phone:opennotifications");
        }
    }

    private pushNotification(notification: PhoneNotificationInterface): void {
        this.notifications.push(notification);
    }

    private deleteNotification(id: number): void {
        alt.emit("phone:deletenotification", id);
    }
}
</script>

<style lang='scss' scoped>
.status-bar {
    position: absolute;
    top: 0;
    width: 100%;
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    overflow: hidden;
    pointer-events: all;
}

.unextended-menu {
    font-size: 0.7vw;
    height: 1vw;
    line-height: 1vw;
}

.unextended-menu:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.extended-menu {
    font-size: 0.7vw;
    height: 10vw;
    border-bottom: rgba(0, 0, 0, 0.2) solid 0.1vw;
}

.notification-list {
    height: 10vw;
    overflow-y: scroll;
    overflow-x: hidden;
    pointer-events: all;
}

.notification-list::-webkit-scrollbar {
    display: none;
}

.notification-list h1 {
    font-size: 0.9vw;
    margin: unset;
    padding: 0.1vw 0.3vw;
}

.notification-list h2 {
    font-size: 0.7vw;
    margin: unset;
    padding: 0.1vw 0.3vw;
}

.notification {
    position: relative;
    margin: 0.2vw 0.3vw;
    padding: 0.1vw 0.2vw;
    color: black;
    border-radius: 0.2vw;
    background-color: rgba(255, 255, 255, 0.8);
    pointer-events: all;
}

.notification p {
    margin: unset;
    pointer-events: all;
}

.notification-close {
    float: right;
    color: rgb(53, 53, 53);
    pointer-events: all;
}

.right {
    text-align: right;
    padding-right: 0.1vw;
}

svg {
    padding-left: 0.2vw;
}

.blink {
    animation: blinker 2s linear infinite;
}

@keyframes blinker {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 0;
    }
}

.maze-bank {
    border-bottom: rgb(228, 36, 46) 0.2vw solid;
    padding-bottom: 2vw;
}

.maze-bank::before {
    content: "_____";
    color: transparent;

    position: absolute;
    right: 0%;
    bottom: 6%;

    background-image: url("../../../../assets/images/phone/maze-bank-notification-logo.png");
    background-size: 1.15vw;
    height: 1.25vw;
    background-repeat: no-repeat;
}

.gov {
    border-bottom: rgb(255, 234, 176) 0.2vw solid;
    padding-bottom: 2vw;
}

.gov::before {
    content: "_____";
    color: transparent;

    position: absolute;
    right: 0%;
    bottom: 6%;

    background-image: url("../../../../assets/images/phone/gov-seal.png");
    background-size: 1.15vw;
    height: 1.15vw;
    background-repeat: no-repeat;
}

.delivery {
    border-bottom: rgb(80, 229, 255) 0.2vw solid;
    padding-bottom: 1vw;
}
</style>
