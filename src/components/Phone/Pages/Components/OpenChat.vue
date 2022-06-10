<template>
    <div class='open-chat'>
        <div class='bar'></div>

        <div v-if='isDeletePopupOpen' class='delete-popup'>
            <h1>Diesen Chat löschen?</h1>
            <button @click='deleteChat($event)'>Ja</button>
            <button @click='closeDeletePopup($event)'>Nein</button>
        </div>

        <div class='chat-entry' @click='openChat()'>
            <div class='delete-button float-end'>
                <button class='btn' type='button' @click='openDeletePopup($event)'>
                    <font-awesome-icon class='center' icon='trash' />
                </button>
            </div>

            <div class='chat-header'>
                <h1>{{ chat.name }}</h1>
                <div v-if='unreadedMessages' class='new-message-notifier'></div>
                <p class='prev'>{{ lastMessage }}</p>
            </div>
            <p class='date'>{{ dateFromLastMessage }}</p>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";
import {PhoneChatInterface} from "@/scripts/interfaces/phone/phone-chat.interface";
import {PhoneMessageInterface} from "@/scripts/interfaces/phone/phone-message.interface";

export default class OpenChat extends Vue {
    @Prop() private readonly chat!: PhoneChatInterface;

    private isDeletePopupOpen = false;
    private unreadedMessages = true;
    private intId = -1;
    private lastMessage = "";
    private dateFromLastMessage = "";

    public unmounted(): void {
        clearInterval(this.intId);
        this.intId = -1;
    }

    @Watch("chat")
    private onItemPropertyChanged(): void {
        if (this.intId !== -1) {
            clearInterval(this.intId);
            this.intId = -1;
        }

        this.intId = setInterval(() => {
            this.updateReadedDotNotifier();
        }, 500);

        this.chat.messages.sort((a: PhoneMessageInterface, b: PhoneMessageInterface) => {
            return this.getTime(a.sendetAt) - this.getTime(b.sendetAt);
        });

        this.lastMessage = this.getLastMessage();
        this.dateFromLastMessage = this.getDateFromLastMessage();
    }

    private getLastMessage(): string {
        if (!this.chat.messages || this.chat.messages.length === 0) {
            return "Noch keine Nachrichten geschrieben!";
        }

        return this.chat.messages[this.chat.messages.length - 1].context;
    }

    private getTime(dateJson: string) {
        const date = new Date(JSON.parse(dateJson));
        return date !== null ? date.getTime() : 0;
    }

    private getDateFromLastMessage(): string {
        if (!this.chat.messages || this.chat.messages.length === 0) {
            return "";
        }

        const message = this.chat.messages[this.chat.messages.length - 1];
        if (!message) {
            return "";
        }

        const date = new Date(JSON.parse(message.sendetAt));
        return date.toLocaleDateString("de-DE", {
            weekday: "long", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private openChat(): void {
        this.$emit("open-chat", this.chat);
        this.unreadedMessages = false;
    }

    private openDeletePopup(event: MouseEvent): void {
        event.stopPropagation();

        this.isDeletePopupOpen = true;
    }

    private closeDeletePopup(event: MouseEvent): void {
        event.stopPropagation();

        this.isDeletePopupOpen = false;
    }

    private deleteChat(event: MouseEvent): void {
        event.stopPropagation();

        this.isDeletePopupOpen = false;
        this.$emit("delete-chat", this.chat);
    }

    private updateReadedDotNotifier(): void {
        if (this.chat && this.chat.messages && this.chat.messages.length > 0) {
            const lastUsage = new Date(JSON.parse(this.chat.lastUsageJson));
            const lastMessageDate = new Date(JSON.parse(this.chat.messages[this.chat.messages.length - 1].sendetAt));

            this.unreadedMessages = lastUsage <= lastMessageDate;
        } else {
            this.unreadedMessages = false;
        }
    }
}
</script>

<style lang='scss' scoped>
.open-chat {
    background-color: rgb(207, 207, 207);
    width: 100%;
    height: 3vw;
    position: relative;
}

.open-chat:hover {
    background-color: rgb(199, 199, 199);
}

.chat-entry {
    height: 100%;
}

.chat-entry h1 {
    position: absolute;
    left: 5%;
    top: 20%;
    font-size: 0.7vw;
    width: 6.5vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    margin: unset;
    float: left;
}

.date {
    position: absolute;
    right: 2%;
    bottom: 2%;
    font-size: 0.5vw;
    margin: unset;
}

.prev {
    position: absolute;
    left: 5%;
    top: 50%;
    font-size: 0.5vw;
    width: 95%;
    margin: unset;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
}

.chat-header {
    width: 80%;
    padding: 0.2vw;
}

.new-message-notifier {
    position: absolute;
    right: 20%;
    top: 20%;
    width: 0.6vw;
    height: 0.6vw;
    border-radius: 100%;
    background: #ff001ead;
}

.delete-button {
    position: relative;
}

.delete-button button {
    color: rgb(212, 56, 56);
    font-size: 0.8vw;
}

.delete-popup {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    text-align: center;

    z-index: 10;
}

.delete-popup h1 {
    margin: unset;
    color: white;
    font-size: 0.8vw;
    padding-bottom: 0.3vw;
    padding-top: 0.4vw;
}

.delete-popup button {
    font-size: 0.7vw;
    margin-left: 0.3vw;
    margin-right: 0.3vw;
}

.bar {
    border-top: 0.1vw solid rgb(173, 173, 173);
    margin-left: 1vw;
}
</style>
