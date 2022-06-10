<template>
    <div class='home-page'>
        <h1 class='clock-text'>{{ clock }}</h1>
        <h1 class='day-text'>{{ day }}</h1>

        <div class='app-group'>
            <div class='row'>
                <button class='app clear'></button>
                <button class='app order' @click='openPageId(10)'>
                    <font-awesome-icon class='center' icon='ship' />
                </button>
                <button class='app company' @click='openPageId(11)'>
                    <font-awesome-icon class='center' icon='building' />
                </button>
                <button class='app locating' @click='openPageId(12)'>
                    <font-awesome-icon class='center' icon='map-marker' />
                </button>
            </div>
            <div class='row'>
                <button class='app mail' @click='openPageId(5)'>
                    <font-awesome-icon class='center' icon='envelope' />
                </button>
                <button class='app internet' @click='openPageId(6)'>
                    <font-awesome-icon class='center' icon='globe' />
                </button>
                <button class='app clear'></button>
                <button class='app bank' @click='openPageId(8)'>
                    <font-awesome-icon class='center' icon='money-bill' />
                </button>
            </div>
            <div class='row'>
                <button class='app phone' @click='openPageId(1)'>
                    <font-awesome-icon class='center' icon='phone' />
                </button>
                <button class='app contacts' @click='openPageId(3)'>
                    <font-awesome-icon class='center' icon='address-book' />
                </button>
                <button class='app texting' @click='openPageId(2)'>
                    <font-awesome-icon class='center' icon='comments' />
                </button>
                <button class='app settings' @click='openPageId(4)'>
                    <font-awesome-icon class='center' icon='cog' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";

export default class HomePage extends Vue {
    private day = "";
    private clock = "";

    private timeInterval: any;

    public mounted(): void {
        this.updateDate();
        this.timeInterval = setInterval(() => {
            this.updateDate();
        }, 1000);
    }

    private destroyed(): void {
        clearInterval(this.timeInterval);
    }

    private updateDate(): void {
        const date = new Date();
        let day = "";

        switch (date.getDay()) {
            case 0:
                day = "Sonntag";
                break;
            case 1:
                day = "Montag";
                break;
            case 2:
                day = "Dienstag";
                break;
            case 3:
                day = "Mittwoch";
                break;
            case 4:
                day = "Donnerstag";
                break;
            case 5:
                day = "Freitag";
                break;
            case 6:
                day = "Samstag";
                break;
            default:
                day = "Error";
                break;
        }

        this.day = day;
        this.clock = date.toLocaleTimeString("de-DE", {hour: 'numeric', minute: 'numeric'});
    }

    private openPageId(id: number): void {
        this.$emit("open-pageid", id);
    }
}
</script>

<style lang='scss' scoped>
.home-page {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.clock-text {
    text-align: center;
    font-size: 2.5vw;
    font-weight: 400;
    padding-top: 2vw;

    color: #FFFFFF;
}

.day-text {
    text-align: center;
    font-size: 1vw;
    font-weight: 300;

    color: #FFFFFF;
    padding-bottom: 2.5vw;
}

.app-group {
    bottom: 0;
    width: 100%;
    padding: 0 0.6vw;
    margin-top: auto;

    & .row {
        padding: 0.5vw;
    }
}

.placeholder {
    width: 1.9vw;
    height: 1.9vw;
    float: left;
    margin: auto;
}

.app {
    position: relative;
    width: 2.3vw;
    height: 2.3vw;
    float: left;
    margin: auto;

    outline: none;
    border: none;
    background: #C4C4C4;
    border-radius: 0.5vw;
    font-size: 1.3vw;
    color: white !important;

    &:disabled {
        background: rgba(0, 0, 0, 0.2) !important;
        color: #C4C4C4 !important;
    }

    &:disabled:hover {
        background: rgba(0, 0, 0, 0.2) !important;
    }
}

.phone {
    background-color: rgb(91, 201, 139) !important;

    &:hover {
        background-color: rgb(70, 151, 105) !important;
    }
}

.texting {
    background-color: rgb(61, 107, 206) !important;

    &:hover {
        background-color: rgb(48, 88, 173) !important;
    }
}

.contacts {
    background-color: rgb(206, 184, 61) !important;

    &:hover {
        background-color: rgb(180, 161, 49) !important;
    }
}

.finder {
    background-color: rgb(182, 61, 206) !important;

    &:hover {
        background-color: rgb(152, 53, 172) !important;
    }
}

.bank {
    background-color: rgb(192, 27, 35) !important;

    &:hover {
        background-color: rgb(148, 26, 32) !important;
    }
}

.map {
    background-color: rgb(206, 61, 85) !important;

    &:hover {
        background-color: rgb(180, 55, 76) !important;
    }
}

.settings {
    background-color: rgb(90, 90, 90) !important;

    &:hover {
        background-color: rgb(58, 58, 58) !important;
    }
}

.internet {
    background-color: rgb(130, 204, 221);

    &:hover {
        background-color: rgb(74, 105, 189) !important;
    }
}

.mail {
    background-color: rgb(87, 101, 116) !important;

    &:hover {
        background-color: rgb(34, 47, 62) !important;
    }
}

.company {
    background-color: rgb(255, 127, 80) !important;

    &:hover {
        background-color: rgb(196, 100, 65) !important;
    }
}

.locating {
    background-color: #89CE3FFF !important;

    &:hover {
        background-color: #70b02b !important;
    }
}

.order {
    background-color: rgb(80, 229, 255) !important;

    &:hover {
        background-color: rgb(68, 191, 212) !important;
    }
}

.clear {
    opacity: 0;
}

</style>
