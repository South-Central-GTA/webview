<template>
    <div class='notifications-holder'>
        <div class='notifications-list left'>
            <div v-for='(notification, index) in leftNotifications' v-bind:key='index'>
                <notification v-bind:notification='notification' />
            </div>
        </div>

        <div class='notifications-list right'>
            <div v-for='(notification, index) in rightNotifications' v-bind:key='index'>
                <notification v-bind:notification='notification' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import Notification from "./Notification.vue";
import {Options, Vue} from "vue-class-component";
import {NotificationInterface} from "@/scripts/interfaces/notification.interface";
import {NotificationPositionTypes} from "@/scripts/enums/notification-position.types";

@Options({
    components: {
        Notification,
    },
})
export default class NotificationsHolder extends Vue {
    private MAX_NOTIFICATIONS = 5;

    private leftNotifications: NotificationInterface[] = [];
    private rightNotifications: NotificationInterface[] = [];
    private notificationPosition: NotificationPositionTypes = NotificationPositionTypes.LEFT;

    public mounted(): void {
        alt.on("notification:push", (notification: NotificationInterface) => this.push(notification));
    }

    public unmounted(): void {
        alt.off("notification:push");
    }

    public setPosition(notificationPosition: NotificationPositionTypes): void {
        this.notificationPosition = notificationPosition;
    }

    private push(notification: NotificationInterface): void {
        if (this.notificationPosition === NotificationPositionTypes.LEFT) {
            if (this.leftNotifications.length >= this.MAX_NOTIFICATIONS) {
                this.leftNotifications.shift();
            }

            this.leftNotifications.push(notification);

            setTimeout(() => {
                if (this.leftNotifications.length > 0) {
                    this.leftNotifications.shift();
                }
            }, 12000);
        }

        if (this.notificationPosition === NotificationPositionTypes.RIGHT) {
            if (this.rightNotifications.length >= this.MAX_NOTIFICATIONS) {
                this.rightNotifications.shift();
            }

            this.rightNotifications.push(notification);

            setTimeout(() => {
                if (this.rightNotifications.length > 0) {
                    this.rightNotifications.shift();
                }
            }, 12000);
        }
    }
}
</script>

<style scoped>
.notifications-holder {
    pointer-events: none;
}

.notifications-list {
    position: absolute;
    z-index: 100;
    pointer-events: none;
}

.left {
    margin: 15vw 0.4vw;
    left: 1.1%;
    bottom: 0%;
}

.right {
    margin: 1vw 0vw;
    right: 0;
    bottom: 0;
}
</style>
