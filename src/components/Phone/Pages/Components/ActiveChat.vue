<template>
    <div class='active-chat'>
        <div class='phone-header'>
            <div>
                <span>{{ chat.name }}</span>
            </div>
        </div>

        <div ref='chatList' class='message-block'>
            <div v-for='message in chat.messages' v-bind:key='message.id'>
                <div class='chat-box' v-bind:class="{
            'your-text': message.local,
            'other-text': !message.local,
          }">
                    <p class='chat'>{{ message.context }}</p>
                    <p class='date-label float-end'>{{ getDate(message) }}</p>
                </div>
            </div>
        </div>

        <div class='text-box'>
            <input ref='textInput' class='form-control' maxlength='500' placeholder='Nachricht' type='text' @blur='onFocus(false)' @focus='onFocus(true)' v-on:keydown.enter='send' />
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {onFocus, UID} from "@/scripts/helpers/helpers";
import character from "@/scripts/services/character.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {PhoneChatInterface} from "@/scripts/interfaces/phone/phone-chat.interface";
import {PhoneMessageInterface} from "@/scripts/interfaces/phone/phone-message.interface";

export default class ActiveChat extends Vue {
    @Ref() private readonly chatList!: HTMLElement;
    @Ref() private readonly textInput!: HTMLInputElement;

    private characterId: number | undefined;
    private chat: PhoneChatInterface = {
        id: 0, phoneNumber: "", name: "", lastUsageJson: "", messages: [],
    };

    public setup(): void {
        if (character.getInstance().getCharacterId) {
            this.characterId = character.getInstance().getCharacterId;
        }

        this.reset();
    }

    public reset(): void {
        this.textInput.value = "";
    }

    public updateChat(updatedChat: PhoneChatInterface, forceScrollToBottom = false): void {
        this.chat = updatedChat;
        this.chat.messages = this.chat.messages.sort((a: PhoneMessageInterface, b: PhoneMessageInterface) => {
            return this.getTime(a.sendetAt) - this.getTime(b.sendetAt);
        });

        if (this.getScrolledUpMessagesAmount() <= 600 || forceScrollToBottom) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 10);
        }
    }

    private getTime(dateJson: string) {
        const date = new Date(JSON.parse(dateJson));
        return date !== null ? date.getTime() : 0;
    }

    private send(): void {
        if (this.textInput.value.length === 0) {
            return;
        }

        if (!this.characterId) {
            return;
        }

        if (!/\S/.test(this.textInput.value)) {
            // Didn't find something other than a space which means it's empty
            return;
        }

        if (!/^(?!\s*$)[-a-zA-Z0-9À-žÄÜÖäüö$€_:;?§%!?/[++|#=,.' \]&<²³>{~*^@}°''"'()]{1,100}$/gm.test(
            this.textInput.value)) {
            return;
        }

        const newMessage: PhoneMessageInterface = {
            id: UID(),
            chatId: this.chat.id,
            sendetAt: Date.now.toString(),
            ownerId: this.characterId,
            context: this.textInput.value,
            local: true,
        };

        alt.emit("phone:pushmessage", newMessage);

        this.reset();
    }

    private getScrolledUpMessagesAmount(): number {
        const amount = Math.round(this.chatList?.scrollHeight - this.chatList?.scrollTop);
        return amount > 0 ? amount : 0;
    }

    private scrollToBottom(): void {
        this.chatList.scrollTop = this.chatList.scrollHeight - this.chatList.clientHeight;
    }

    private getDate(message: PhoneMessageInterface): string {
        const date = new Date(JSON.parse(message.sendetAt));
        return date.toLocaleDateString("de-DE", {
            weekday: "short", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>

<style lang='scss' scoped>
.active-chat {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-image: url("../../../../assets/images/patterns/double-bubble.png");
    z-index: 10;
}

.message-block {
    overflow: scroll;
    position: absolute;
    width: 100%;
    height: 18.9vw;
}

.message-block::-webkit-scrollbar {
    display: none;
}

.chat-box {
    margin-top: 0.1vw;
    margin-bottom: 0.2vw;
    width: 10vw;
    padding: 0.35vw;
    border-radius: 0.3vw;
    text-align: left;
    font-size: 0.7vw;
    color: white;
}

.chat {
    margin: unset;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    hyphenate-limit-chars: 10 4 4;
}

.date-label {
    padding-top: 0.2vw;
    font-size: 0.4vw;
    float: right;
    margin: unset;
}

.your-text {
    float: right;
    margin-right: 0.2vw;
    background-color: rgb(61, 107, 206);
}

.other-text {
    float: left;
    margin-left: 0.2vw;
    background-color: rgb(121, 121, 121);
}

.text-box {
    position: absolute;
    width: 100%;
    bottom: 0;
    white-space: nowrap;
}

input[type="text"] {
    padding: 0.4vw;
    width: 100%;
    height: 5%;
    border-radius: 0;
}
</style>
