/// <reference types="@altv/types-webview" />

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import BankingService from '@/scripts/services/banking.service'
import HouseService from '@/scripts/services/house.service'
import GroupService from '@/scripts/services/group.service'
import CharacterService from '@/scripts/services/character.service'
import AccountService from '@/scripts/services/account.service'
import '@/scss/custom.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import ContextMenu from '@imengyu/vue3-context-menu'

import {
    faSignInAlt,
    faSignOutAlt,
    faPlay,
    faArrowLeft,
    faArrowRight,
    faArrowDown,
    faArrowUp,
    faRedo,
    faUndo,
    faSave,
    faVenus,
    faMars,
    faCog,
    faCircle,
    faEraser,
    faTrash,
    faPlus,
    faPhone,
    faCaretLeft,
    faCaretRight,
    faComments,
    faAddressBook,
    faHeart,
    faMap,
    faGlobe,
    faSignal,
    faTimes,
    faPaperPlane,
    faMoneyBill,
    faCheck,
    faChevronLeft,
    faImages,
    faHandPointer,
    faTimesCircle,
    faEnvelope,
    faBuilding,
    faQuestionCircle,
    faShip,
    faShippingFast,
    faCaretSquareDown,
    faCaretSquareUp,
    faArchive,
    faStar,
    faPhoneSlash,
    faWindowClose,
    faCar,
    faChevronUp,
    faChevronDown,
    faSquare,
    faBox,
    faUser,
    faUsers,
    faShoppingBag,
    faMapMarker,
    faInbox,
    faFile,
    faFolder,
    faPen,
    faUniversalAccess,
    faBold,
    faItalic,
    faStrikethrough,
    faCode,
    faHeading,
    faListUl,
    faListOl,
    faFileCode,
    faQuoteLeft,
    faGripLines
} from '@fortawesome/free-solid-svg-icons'

import MailingService from "@/scripts/services/mailing.service";
import MdcService from "@/scripts/services/mdc.service";

library.add(faSignInAlt, faSignOutAlt, faPlay, faArrowLeft, faArrowRight, faArrowDown, faArrowUp, faRedo, faUndo, faSave,
    faVenus, faMars, faCog, faCircle, faEraser, faTrash, faPlus, faPhone, faCaretLeft, faCaretRight,
    faComments, faAddressBook, faHeart, faMap, faGlobe, faSignal, faTimes, faPaperPlane,
    faMoneyBill, faCheck, faChevronLeft, faImages, faHandPointer, faTimesCircle, faEnvelope, faBuilding, faQuestionCircle,
    faShip, faShippingFast, faCaretSquareDown, faCaretSquareUp, faArchive, faStar, faPhoneSlash, faWindowClose, faCar, faChevronUp, faChevronDown,
    faSquare, faBox, faUser, faUsers, faShoppingBag, faMapMarker, faInbox, faFile, faFolder, faPen, faUniversalAccess, faBold, faItalic,
    faStrikethrough, faCode, faHeading, faListUl, faListOl, faFileCode, faQuoteLeft, faGripLines);


BankingService.getInstance().listenToEvents();
HouseService.getInstance().listenToEvents();
GroupService.getInstance().listenToEvents();
CharacterService.getInstance().listenToEvents();
AccountService.getInstance().listenToEvents();
MailingService.getInstance().listenToEvents();
MdcService.getInstance().listenToEvents();

createApp(App)
    .use(router)
    .use(ContextMenu)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
