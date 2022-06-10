<template>
    <div :hidden='!active' class='mdc-base'>
        <div class='screen'>
            <mdc-header-bar ref='header'></mdc-header-bar>

            <div :hidden='!isLoading' class='login-screen'>
                <h1 class='center text-white'>{{ loadingText }}</h1>
            </div>

            <span v-if='infoMessage.length !== 0' class='info-message'>
        {{ infoMessage }}
      </span>

            <div :hidden='isLoading' class='content-screen'>
                <mdc-pd-base ref='pdBase' :hidden='factionType !== 1' v-on:show-notification='onShowNotification'></mdc-pd-base>
                <mdc-fd-base ref='fdBase' :hidden='factionType !== 2' v-on:show-notification='onShowNotification'></mdc-fd-base>
            </div>

            <mdc-footer-bar ref='footer' :hidden='isLoading'></mdc-footer-bar>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import MdcFooterBar from "@/components/MDC/General/MdcFooterBar.vue";
import {Ref} from "vue-property-decorator";
import MdcHeaderBar from "@/components/MDC/General/MdcHeaderBar.vue";
import MdcPdBase from "@/components/MDC/Factions/PD/MdcPdBase.vue";
import MdcFdBase from "@/components/MDC/Factions/FD/MdcFdBase.vue";
import {FactionType} from "@/scripts/enums/faction.type";
import {MdcSearchEntityInterface} from "@/scripts/interfaces/mdc/mdc-search-entity.interface";
import {CallSignInterface} from "@/scripts/interfaces/mdc/call-sign.interface";

@Options({
    components: {
        MdcFdBase, MdcPdBase, MdcHeaderBar, MdcFooterBar,
    },
})
export default class MdcBase extends Vue {
    @Ref() private readonly header!: MdcHeaderBar;
    @Ref() private readonly footer!: MdcFooterBar;
    @Ref() private readonly pdBase!: MdcPdBase;
    @Ref() private readonly fdBase!: MdcFdBase;

    private active: boolean = false;
    private isLoading: boolean = false;
    private loadingText: string = "";
    private loadingInterval?: number = undefined;
    private rankName?: string = undefined;
    private characterName: string = "";
    private factionType: FactionType = FactionType.CITIZEN;

    private infoMessage: string = "";
    private infoTimeout: number | undefined;

    public mounted(): void {
        alt.on("mdc:open",
            (factionType: FactionType, canLogin: boolean, characterName: string, rankName?: string) => this.onOpen(
                factionType, canLogin, characterName, rankName));
        alt.on("mdc:updatecallsigns", (args: any[]) => this.onUpdateCallSigns(args[0], args[1]));
        alt.on("mdc:sendentities", (args: any[]) => this.onSetEntities(args[0]));
        alt.on("mdc:close", () => this.onClose());
    }

    public unmounted(): void {
        alt.off("mdc:open");
        alt.off("mdc:updatecallsigns");
        alt.off("mdc:sendentities");
        alt.off("mdc:close");
    }

    public showInfoMessage(info: string): void {
        this.infoMessage = info;

        if (this.infoTimeout) {
            clearTimeout(this.infoTimeout);
        }

        this.infoTimeout = setTimeout(() => {
            this.infoMessage = "";
        }, 3000);
    }

    public fakeLogin(canLogin: boolean): void {
        this.isLoading = true;

        let step = 0;
        this.loadingText = "Anmeldung .";

        if (this.loadingInterval !== undefined) {
            clearInterval(this.loadingInterval);
        }

        this.loadingInterval = setInterval(() => {
            if (step === 0) {
                this.loadingText = "Anmeldung ..";
            }
            if (step === 1) {
                this.loadingText = "Anmeldung ...";
            }
            if (step === 2) {
                this.loadingText = "Anmeldung .";
            }

            step++;
            if (step === 3) {
                step = 0;
            }

            if (!this.isLoading) {
                clearInterval(this.loadingInterval);
            }
        }, 500);

        setTimeout(() => {
            if (canLogin) {
                this.isLoading = false;
                this.login();
            } else {
                clearInterval(this.loadingInterval);
                this.loadingText = "Bio-Scan verweigert!";
            }
        }, 1500);
    }

    private onShowNotification(message: string): void {
        this.showInfoMessage(message);
    }

    private onOpen(factionType: FactionType, canLogin: boolean, characterName: string, rankName?: string): void {
        this.active = true;
        this.rankName = rankName;
        this.characterName = characterName;
        this.factionType = factionType;

        this.fakeLogin(canLogin);

        if (this.rankName !== undefined) {
            this.footer.setup(this.characterName, this.rankName);
        }
    }

    private onUpdateCallSigns(callSigns: CallSignInterface[], hasCallSign: boolean): void {
        switch (this.factionType) {
            case FactionType.POLICE_DEPARTMENT:
                this.pdBase.updateCallSigns(callSigns, hasCallSign);
                break;
            case FactionType.FIRE_DEPARTMENT:
                this.fdBase.updateCallSigns(callSigns, hasCallSign);
                break;
        }
    }

    private onSetEntities(entities: MdcSearchEntityInterface[]): void {
        switch (this.factionType) {
            case FactionType.POLICE_DEPARTMENT:
                this.pdBase.setEntities(entities);
                break;
            case FactionType.FIRE_DEPARTMENT:
                this.fdBase.setEntities(entities);
                break;
        }
    }

    private onClose(): void {
        this.active = false;

        switch (this.factionType) {
            case FactionType.POLICE_DEPARTMENT:
                this.pdBase.close();
                break;
            case FactionType.FIRE_DEPARTMENT:
                this.pdBase.close();
                break;
        }
    }

    private login(): void {
        this.header.setup();

        switch (this.factionType) {
            case FactionType.POLICE_DEPARTMENT:
                this.pdBase.setup();
                break;
            case FactionType.FIRE_DEPARTMENT:
                this.fdBase.setup();
                break;
        }
    }
}
</script>

<style lang='scss' scoped>
.mdc-base {
    z-index: 9999;
    position: absolute;
    background: #2c2c2c;
    border-radius: 0.2vw;
    border: 3px solid rgb(36, 36, 36);
    pointer-events: all;

    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
    width: 81vw;
    height: 40vw;
    overflow: hidden;
}

.screen {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.login-screen {
    height: 100%;
    background-color: #0a53be;
}

.content-screen {
    height: 100%;
}

.info-message {
    position: absolute;
    right: 2%;
    bottom: 5%;
    background-color: rgba(50, 52, 52, 0.87);
    color: white;
    padding: 0.5vw;
    z-index: 1000;
}
</style>
