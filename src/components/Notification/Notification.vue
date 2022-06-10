<template>
    <div class='card notification' v-bind:class='{
      info: notification.type == 0,
      warning: notification.type == 1,
      danger: notification.type == 2,
      success: notification.type == 3,
    }'>
        <p class='text-white'>{{ notification.text }}</p>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {NotificationInterface} from "@/scripts/interfaces/notification.interface";

export default class Notification extends Vue {
    @Prop() private readonly notification!: NotificationInterface;
}
</script>

<style lang='scss' scoped>
.notification {
    width: 20vw;
    margin: 0.5vw 1vw;
    padding: 0.25vw;
    font-size: 0.8vw;

    animation: fadein 500ms;
    animation-fill-mode: forwards;

    & p {
        margin: unset;
    }
}

.alert {
    padding: 0.5vw;
}

.info {
    background-color: rgba(52, 134, 182, 0.8);
}

.warning {
    background-color: rgba(187, 185, 43, 0.8);
}

.danger {
    background-color: rgba(182, 52, 52, 0.8);
}

.success {
    background-color: rgba(46, 204, 113, 0.8);
}

.fade-out {
    animation: fadeout 500ms;
    animation-fill-mode: forwards;
}

@keyframes fadeout {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
