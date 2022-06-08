<template>
    <div class='game'>
        <notifications-holder class='unselectable' />
        <mdc-base />
        <set-torso-menu />
        <vehicle-sell-menu />
        <hud />
        <speedo />
        <ATM />
        <players-list />
        <public-garage />
        <Ammunation />
        <Supermarket />
        <GasStation />
        <team-menu />
        <character-menu />
        <Inventories></Inventories>
        <context-menu />
        <animation-wheel />
        <chat />
        <phone />
    </div>
</template>

<script lang='ts'>
import Chat from "@/components/Chat.vue";
import Speedo from "@/components/Speedo.vue";
import Hud from "@/components/Hud.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import Phone from "@/components/Phone/Phone.vue";
import TeamMenu from "@/components/TeamMenu/TeamMenu.vue";
import ATM from "@/components/ATM/ATM.vue";
import PublicGarage from "@/components/PublicGarage/PublicGarage.vue";
import NotificationsHolder from "@/components/Notification/NotificationsHolder.vue";
import VehicleSellMenu from "@/components/Vehicle/VehicleSellMenu.vue";
import {Options, Vue} from "vue-class-component";
import Inventories from "@/components/Inventories/Inventories.vue";
import Supermarket from "@/components/Company/Supermarket.vue";
import Ammunation from "@/components/Company/Ammunation.vue";
import GasStation from "@/components/Company/GasStation.vue";
import SetTorsoMenu from "@/components/SetTorsoMenu.vue";
import CharacterMenu from "@/components/CharacterMenu/CharacterMenu.vue";
import AnimationWheel from "@/components/AnimationWheel.vue";
import PlayersList from "@/components/PlayersList.vue";
import MdcBase from "@/components/MDC/MdcBase.vue";

@Options({
    components: {
        MdcBase,
        PlayersList,
        AnimationWheel,
        CharacterMenu,
        SetTorsoMenu,
        GasStation,
        Ammunation,
        Supermarket,
        Inventories,
        VehicleSellMenu,
        NotificationsHolder,
        ATM,
        Chat,
        Speedo,
        Hud,
        ContextMenu,
        Phone,
        TeamMenu,
        PublicGarage,
    },
})
export default class Game extends Vue {
}
</script>

<style scoped>
.game {
    height: 100%;
    width: 100%;
}
</style>
