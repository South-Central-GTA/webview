<template>
    <div :hidden='!active' class='phone' v-bind:class="{
      'slide-down': isPhoneDown,
      'slide-up': !isPhoneDown,
      'vertical-phone': isPhoneVertical,
      'horizontal-phone': !isPhoneVertical,
    }">
        <button type='button' v-bind:class="{
        'vertical-home-button': isPhoneVertical,
        'horizontal-home-button': !isPhoneVertical,
      }" @click='backToHome'></button>
        <div :style="{ backgroundImage: 'url(\'' + getImage(backgroundId) + '\')' }" v-bind:class="{
        'vertical-background': isPhoneVertical,
        'horizontal-background': !isPhoneVertical,
      }">
            <status-bar ref='statusBar' />

            <home-page :hidden='pageId !== 0' v-on:open-pageid='openPageId($event)' />

            <call-page ref='callPage' :hidden='pageId !== 1' v-on:add-contact='addContractFromCallField($event)' v-on:call-number='callNumber($event)' />

            <open-chats-page ref='openChatsPage' :hidden='pageId !== 2' v-on:add-chat='addChat($event)' v-on:delete-chat='deleteChat($event)' />

            <contacts-page ref='contactsPage' :hidden='pageId !== 3' v-on:call-contact='callContact($event)' v-on:text-contact='textContact($event)' v-on:add-contact='addContact($event)' v-on:edit-contact='editContact($event)' v-on:remove-contact='removeContact($event)' />

            <settings-page ref='settings' :hidden='pageId !== 4' />

            <mail-app ref='mailApp' :hidden='pageId !== 5' v-on:close-app='backToHome' />

            <internet-app ref='internetApp' :hidden='pageId !== 6' v-on:close-app='backToHome' />

            <bank-page ref='banking' :hidden='pageId !== 8' />

            <delivery-page ref='delivery' :hidden='pageId !== 10' />

            <company-page ref='company' :hidden='pageId !== 11' />

            <locating-page ref='locating' :hidden='pageId !== 12' />

            <get-call-page ref='getCallPage' :hidden='pageId !== 1000' v-on:deny='onHangup(true)' />

            <active-call ref='activeCall' :hidden='pageId !== 1001' v-on:close='onAfterCall()' v-on:hangup='onHangup(true)' v-on:connect-call='onConnectCall($event)' />
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import StatusBar from "./Pages/Components/StatusBar.vue";
import HomePage from "./Pages/HomePage.vue";
import CallPage from "./Pages/CallPage.vue";
import OpenChatsPage from "./Pages/OpenChatsPage.vue";
import ContactsPage from "./Pages/ContactsPage.vue";
import GetCallPage from "./Pages/GetCallPage.vue";
import BankPage from "./Pages/BankPage.vue";
import SettingsPage from "./Pages/SettingsPage.vue";
import ActiveCall from "./Pages/Components/ActiveCall.vue";
import CompanyPage from "./Pages/CompanyPage.vue";
import DeliveryPage from "./Pages/DeliveryPage.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import MailApp from "@/components/Phone/Pages/MailApp.vue";
import InternetApp from "@/components/Phone/Pages/InternetApp.vue";
import LocatingPage from "@/components/Phone/Pages/LocatingPage.vue";
import {onFocus} from "@/scripts/helpers/helpers";
import {PhoneInterface} from "@/scripts/interfaces/phone/phone.interface";
import {PhoneChatInterface} from "@/scripts/interfaces/phone/phone-chat.interface";
import {PhoneContactInterface} from "@/scripts/interfaces/phone/phone-contact.interface";

@Options({
    components: {
        LocatingPage,
        InternetApp,
        MailApp,
        StatusBar,
        HomePage,
        CallPage,
        OpenChatsPage,
        ContactsPage,
        GetCallPage,
        ActiveCall,
        BankPage,
        SettingsPage,
        CompanyPage,
        DeliveryPage,
    },
})
export default class Phone extends Vue {
    @Ref() private readonly statusBar!: StatusBar;
    @Ref() private readonly openChatsPage!: OpenChatsPage;
    @Ref() private readonly contactsPage!: ContactsPage;
    @Ref() private readonly callPage!: CallPage;
    @Ref() private readonly getCallPage!: GetCallPage;
    @Ref() private readonly activeCall!: ActiveCall;
    @Ref() private readonly settings!: SettingsPage;
    @Ref() private readonly mailApp!: MailApp;
    @Ref() private readonly internetApp!: InternetApp;
    @Ref() private readonly banking!: BankPage;
    @Ref() private readonly delivery!: DeliveryPage;
    @Ref() private readonly company!: CompanyPage;
    @Ref() private readonly locating!: LocatingPage;

    private phone!: PhoneInterface;

    private active = false;
    private inCall = false;
    private pageId = 0;
    private pageBeforeCall = 0;
    private isPhoneDown = false;
    private isPhoneVertical = true;

    private backgroundId = 1;

    public mounted(): void {
        alt.emit("phone:ready");

        alt.on("phone:setup", (phone: PhoneInterface) => this.setup(phone));
        alt.on("phone:reset", () => this.reset());
        alt.on("phone:toggle", (state: boolean) => this.toggle(state));
        alt.on("phone:openactivecall", (displayedName: string) => this.openActiveCall(displayedName));
        alt.on("phone:getcallfrom", (displayedName: string) => this.getCall(displayedName));
        alt.on("phone:setphonedown", (state: boolean) => this.setPhoneDown(state));
        alt.on("phone:callgothungup", () => this.onHangup(false));
    }

    public unmounted(): void {
        alt.off("phone:setup");
        alt.off("phone:reset");
        alt.off("phone:toggle");
        alt.off("phone:openactivecall");
        alt.off("phone:getcallfrom");
        alt.off("phone:setphonedown");
        alt.off("phone:callgothungup");
    }

    private setup(phone: PhoneInterface): void {
        if (!phone) {
            return;
        }

        this.phone = phone;
        this.backgroundId = phone.backgroundImageId;

        this.statusBar?.setNotifications(this.phone.notifications, this.phone.lastTimeOpenedNotificationsJson);
        this.openChatsPage?.setup(this.phone.ownerId, this.phone.chats);
        this.contactsPage?.setup(this.phone.phoneNumber, this.phone.contacts);
        this.settings?.setup(this.backgroundId);
    }

    private reset(): void {
        this.openPageId(0);

        this.callPage.reset();
        this.openChatsPage.reset();
        this.locating.reset();

        this.company.resetLoading();
        this.banking.resetLoading();
        this.delivery.resetLoading();
    }

    private toggle(state: boolean): void {
        if (!state) {
            this.isPhoneDown = true;
            setTimeout(() => {
                this.active = state;
            }, 500);
        } else {
            if (this.pageId === 5) {
                this.mailApp.open();
            }

            if (this.pageId === 6) {
                this.internetApp.open();
            }

            if (this.pageId === 8) {
                this.banking.open();
            }

            if (this.pageId === 11) {
                this.company.open();
            }

            this.active = true;
            this.isPhoneDown = false;
        }
    }

    private backToHome(): void {
        if (this.statusBar.extended) {
            this.statusBar.toggleExpand();
            return;
        }

        if (this.openChatsPage.IsChatOpen) {
            this.openChatsPage.closeActiveChat();
            return;
        }

        if (this.contactsPage.isAddContactPopupOpen) {
            this.contactsPage.closeAddContactPopup();
            return;
        }

        if (this.contactsPage.isEditContactPopupOpen) {
            this.contactsPage.closeUpdateContactPopup();
            return;
        }

        if (this.contactsPage.isDeletePopupOpen) {
            this.contactsPage.closeDeletePopup();
            return;
        }

        if (this.contactsPage.isActionsPopupOpen) {
            this.contactsPage.closeActionsPopup();
            return;
        }

        if (this.settings.getTab !== 0) {
            this.settings.resetTab();
            return;
        }

        if (this.banking.getTab !== 0 && !this.banking.isCreatingAccount) {
            this.banking.resetTab();
            return;
        }

        if (this.company.getTab !== 0 && !this.company.isCreatingCompany) {
            this.company.resetTab();
            return;
        }

        if (this.delivery.getTab !== 0) {
            this.delivery.resetTab();
            return;
        }

        if (this.pageId === 5) {
            this.mailApp.reset();
        }

        if (this.pageId === 6) {
            this.mailApp.reset();
        }

        if (this.pageId === 7) {
            this.internetApp.reset();
        }

        // Player gets an call
        if (this.pageId === 1000) {
            return;
        }

        // Player gets an call
        if (this.pageId === 1001) {
            return;
        }

        this.isPhoneVertical = true;
        this.openPageId(0);
    }

    private openPageId(id: number): void {
        this.isPhoneVertical = true;

        if (id === 2) {
            this.openChatsPage.orderChats();
        }
        if (id === 5) {
            this.mailApp.open();
            this.isPhoneVertical = false;
        }
        if (id === 6) {
            this.internetApp.open();
            this.isPhoneVertical = false;
        }
        if (id === 8) {
            this.banking.open();
        }
        if (id === 10) {
            this.delivery.open();
        }
        if (id === 11) {
            this.company.open();
        }
        if (id === 12) {
            this.locating.open();
        }

        this.onFocus(!this.isPhoneVertical);

        this.pageId = id;
    }

    private addContractFromCallField(number: number): void {
        this.openPageId(3);
        this.contactsPage.openAddContactPopup(number);
    }

    private onConnectCall(): void {
        this.statusBar.inCall = true;
    }

    private callNumber(displayedName: string): void {
        this.openPageId(1001);
        this.activeCall.setup(displayedName);
        alt.emit("phone:call", displayedName.toString());
    }

    private callContact(contact: PhoneContactInterface): void {
        this.openPageId(1001);
        this.activeCall.setup(contact.name.toString());
        alt.emit("phone:call", contact.phoneNumber.toString());
    }

    private textContact(contact: PhoneContactInterface): void {
        this.openPageId(2);
        this.openChatsPage.openChatWithContact(contact);
    }

    private addChat(chat: PhoneChatInterface): void {
        alt.emit("phone:addchat", chat);
    }

    private deleteChat(chatId: number): void {
        alt.emit("phone:deletechat", chatId);
    }

    private addContact(contact: PhoneContactInterface): void {
        alt.emit("phone:addcontact", contact);
    }

    private editContact(contact: PhoneContactInterface): void {
        alt.emit("phone:editcontact", contact);
    }

    private removeContact(contactId: number): void {
        alt.emit("phone:removecontact", contactId);
    }

    private onAfterCall(): void {
        this.openPageId(this.pageBeforeCall);
    }

    private onHangup(didPlayerHangup: boolean): void {
        this.statusBar.inCall = false;
        this.inCall = false;

        if (didPlayerHangup) {
            alt.emit("phone:hangup");
        } else {
            this.activeCall.hangupCall();
        }
    }

    private openActiveCall(displayedName: string): void {
        this.openPageId(1001);

        this.activeCall.setup(displayedName, true);
    }

    private getCall(displayedName: string): void {
        if (this.pageId === 1000) {
            return;
        }

        this.pageBeforeCall = this.pageId;

        this.openPageId(1000);

        this.getCallPage.setup(displayedName);
    }

    private setPhoneDown(state: boolean): void {
        this.isPhoneDown = state;
    }

    private getImage(id: number): string {
        const images = require.context("@/assets/images/phone/backgrounds/", false, /\.jpg$/);
        return images("./background" + id + ".jpg");
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>

<style lang='scss' scoped>
.phone {
    position: absolute;
    background: #2c2c2c;
    border-radius: 0.2vw;
    border: 3px solid rgb(36, 36, 36);
    pointer-events: all;
}

.vertical-phone {
    right: 2%;
    bottom: 2%;
    width: 15vw;
    height: 33vw;
}

.horizontal-phone {
    right: 50%;
    bottom: 50%;
    width: 81vw;
    height: 39vw;
    transform: translate(50%, 50%);
}

.slide-down {
    animation: slide-down 0.5s forwards;
}

.slide-up {
    animation: slide-up 0.5s forwards;
}

.vertical-home-button {
    position: absolute;

    width: 1.1vw;
    height: 1.1vw;

    bottom: 1%;
    left: 50%;
    transform: translateX(-50%);

    background: #c4c4c4;
    border-radius: 50vw;
    border: none;
    outline: none;
}

.horizontal-home-button {
    position: absolute;

    width: 1.1vw;
    height: 1.1vw;

    bottom: 50%;
    right: 0.5%;
    transform: translateY(-50%);

    background: #c4c4c4;
    border-radius: 50vw;
    border: none;
    outline: none;
}

.horizontal-background {
    position: absolute;
    left: 0.1vw;
    right: 2vw;
    top: 0.1vw;
    bottom: 0.1vw;
    z-index: 1;

    overflow: hidden;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center center;
    background-color: #c4c4c4;
}

.vertical-background {
    position: absolute;
    left: 0.1vw;
    right: 0.1vw;
    top: 0.8vw;
    bottom: 2vw;
    z-index: 1;

    overflow: hidden;
    background-repeat: no-repeat;
    background-size: auto;
    background-position: center center;
    background-color: #c4c4c4;
}

@keyframes slide-up {
    0% {
        margin-bottom: -250px;
    }
    100% {
        margin-bottom: 0;
    }
}

@keyframes slide-down {
    0% {
        margin-bottom: 0;
    }
    100% {
        margin-bottom: -250px;
    }
}
</style>
