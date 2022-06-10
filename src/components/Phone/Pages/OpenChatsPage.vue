<template>
    <div class='open-chats-page'>
        <div class='phone-header'>
            <div>
                <span>Nachrichten</span>
            </div>
        </div>

        <div :hidden='!isChatOpen'>
            <active-chat ref='activeChat' />
        </div>

        <div class='chats-block'>
            <div v-for='chat in chats' v-bind:key='chat.id'>
                <open-chat v-bind:chat='chat' v-on:open-chat='openChat($event)' v-on:delete-chat='deleteChat($event)' />
            </div>
        </div>

        <div v-if='chats.length === 0' class='no-messages-block'>
            <h4>Keine Nachrichten verfügbar...</h4>
        </div>
    </div>
</template>

<script lang='ts'>
import ActiveChat from "./Components/ActiveChat.vue";
import OpenChat from "./Components/OpenChat.vue";
import {UID} from "@/scripts/helpers/helpers";
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {PhoneChatInterface} from "@/scripts/interfaces/phone/phone-chat.interface";
import {PhoneContactInterface} from "@/scripts/interfaces/phone/phone-contact.interface";

@Options({
    components: {
        ActiveChat, OpenChat,
    },
})
export default class OpenChatsPage extends Vue {
    @Ref() private readonly activeChat!: ActiveChat;
    private isChatOpen = false;
    private activeChatId: number | undefined = undefined;
    private phoneOwner = -1;
    private chats: PhoneChatInterface[] = [];

    get IsChatOpen() {
        return this.isChatOpen;
    }

    public mounted(): void {
        alt.on("phone:opennewchat", (oldId: number, chat: PhoneChatInterface) => this.openNewChat(oldId, chat));
    }

    public unmounted(): void {
        alt.off("phone:opennewchat");
    }

    public setup(phoneOwner: number, chats: PhoneChatInterface[]): void {
        this.phoneOwner = phoneOwner;

        this.chats = chats;

        this.orderChats();

        if (this.isChatOpen) {
            const updatedChat = this.chats.find((c) => c.id === this.activeChatId);
            if (!updatedChat) {
                return;
            }

            this.updateChat(updatedChat);
        }
    }

    public reset(): void {
        this.activeChat.reset();
    }

    public orderChats(): void {
        this.chats = this.chats.sort((a, b) => {
            if (a.messages.length === 0 || b.messages.length === 0) {
                return 0;
            }

            const aLength = a.messages.length - 1;
            const bLength = b.messages.length - 1;

            let order = -1;

            if (a.messages[aLength].sendetAt > b.messages[bLength].sendetAt) {
                order = -1;
            }

            if (a.messages[aLength].sendetAt < b.messages[bLength].sendetAt) {
                order = 1;
            }

            return order;
        });
    }

    public openChatWithContact(contact: PhoneContactInterface): void {
        const chat = this.chats.find((o) => o.phoneNumber === contact.phoneNumber);
        if (chat !== undefined) {
            this.openChat(chat);
        } else {
            const newChat: PhoneChatInterface = {
                id: UID(), name: contact.name, phoneNumber: contact.phoneNumber, lastUsageJson: "", messages: [],
            };
            this.chats.push(newChat);

            this.$emit("add-chat", newChat);
        }
    }

    public closeActiveChat(): void {
        alt.emit("phone:updatelastusage", this.activeChatId);

        this.isChatOpen = false;
        this.activeChatId = undefined;
    }

    private openChat(chat: PhoneChatInterface): void {
        this.isChatOpen = true;
        this.activeChatId = chat.id;

        this.activeChat.setup();
        this.updateChat(chat);

        alt.emit("phone:updatelastusage", chat.id);
    }

    private openNewChat(oldId: number, newChat: PhoneChatInterface): void {
        const chat = this.chats.find((c) => c.id === oldId);
        if (!chat) {
            return;
        }

        const index = this.chats.indexOf(chat);
        this.chats[index] = newChat;

        this.isChatOpen = true;
        this.activeChatId = newChat.id;

        this.activeChat.setup();
        this.activeChat.updateChat(newChat, true);
    }

    private updateChat(chat: PhoneChatInterface): void {
        this.activeChat.updateChat(chat);
    }

    private deleteChat(chat: PhoneChatInterface): void {
        this.chats = this.chats.filter((c) => c.id !== chat.id);

        this.$emit("delete-chat", chat.id);
    }
}
</script>

<style lang='scss' scoped>
.open-chats-page {
    height: 100%;
    text-align: center;
    background-image: url("../../../assets/images/patterns/double-bubble.png");
}

.chats-block {
    overflow: auto;
    width: 100%;
    height: 21vw;
}

.no-messages-block {
    position: absolute;
    top: 20%;
}

.chats-block::-webkit-scrollbar {
    display: none;
}
</style>
