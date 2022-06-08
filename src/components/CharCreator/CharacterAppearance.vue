<template>
    <div class='character-appearance'>
        <h4>Erscheinungsbild</h4>
        <div class='row'>
            <div class='col-6'>
                <div :hidden='gender !== 0'>
                    <appearance-menu ref='maleHairMenu' title='Haare' :colors='hairColors' :names='maleHairlist.map((mh) => mh.name)' :maxElements='maleHairlist.length' :clearNumber='0' :hasOpacity='false' :hasSecondaryColor='true' :menuIndex='1' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateHair($event)' />
                </div>
                <div :hidden='gender !== 1'>
                    <appearance-menu ref='femaleHairMenu' title='Haare' :colors='hairColors' :names='femaleHairlist.map((fh) => fh.name)' :maxElements='femaleHairlist.length' :clearNumber='0' :hasOpacity='false' :hasSecondaryColor='true' :menuIndex='1' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateHair($event)' />
                </div>
            </div>
            <div class='col-6'>
                <appearance-menu ref='eyeBrowsMenu' title='Augenbrauen' :colors='hairColors' :names='eyebrowNames' :maxElements='33' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='2' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateEyebrow($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='facialHairMenu' title='Gesichtsbehaarung' :colors='hairColors' :names='facialHairNames' :maxElements='28' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='3' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateFacialhair($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='chestHairMenu' title='Brustbehaarung' :colors='hairColors' :names='null' :maxElements='16' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='4' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateChesthair($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='ageingMenu' title='Hautalterung' :colors='null' :names='null' :maxElements='14' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='5' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateAging($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='complexionMenu' title='Teint' :colors='null' :names='complexionNames' :maxElements='11' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='6' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateComplexion($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='frecklesMenu' title='Hautmale' :colors='null' :names='frecklesNames' :maxElements='17' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='7' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateFreckles($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='sundamageMenu' title='Hautschaden' :colors='null' :names='sundamageNames' :maxElements='10' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='8' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateSkinDamage($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='blemishesMenu' title='Gesichtsunreinheiten' :colors='null' :names='blemishesNames' :maxElements='23' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='9' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateBlemishes($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='bodyBlemishesMenu' title='Körperunreinheiten' :colors='null' :names='null' :maxElements='11' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='10' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateBodyBlemishes($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='eyeColorMenu' title='Augenfarbe' :colors='null' :names='null' :maxElements='7' :clearNumber='0' :hasOpacity='false' :hasSecondaryColor='false' :menuIndex='11' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateEyeColor($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='blushMenu' title='Rouge' :colors='lipsColors' :names='blushNames' :maxElements='6' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='12' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateBlush($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='makeUpMenu' title='Make-up' :colors='null' :names='makeUpNames' :maxElements='74' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='13' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateMakeup($event)' />
            </div>
            <div class='col-6'>
                <appearance-menu ref='lipstickMenu' title='Lippenstift' :colors='lipsColors' :names='lipstickNames' :maxElements='9' :clearNumber='255' :hasOpacity='true' :hasSecondaryColor='false' :menuIndex='14' :currentMenuIndex='menuIndex' v-on:request-menu='onMenuButtonClicked($event)' v-on:update-appearance='updateLips($event)' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import AppearanceMenu from "./Menus/AppearanceMenu.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {AppearancesInterface} from "@/scripts/interfaces/character/appearances.interface";
import {AppearanceInterface} from "@/scripts/interfaces/character/appearance.interface";

@Options({
    components: {
        AppearanceMenu,
    },
})
export default class CharacterAppearance extends Vue {
    @Ref() private readonly maleHairMenu!: AppearanceMenu;
    @Ref() private readonly femaleHairMenu!: AppearanceMenu;
    @Ref() private readonly eyeBrowsMenu!: AppearanceMenu;
    @Ref() private readonly facialHairMenu!: AppearanceMenu;
    @Ref() private readonly chestHairMenu!: AppearanceMenu;
    @Ref() private readonly ageingMenu!: AppearanceMenu;
    @Ref() private readonly complexionMenu!: AppearanceMenu;
    @Ref() private readonly frecklesMenu!: AppearanceMenu;
    @Ref() private readonly sundamageMenu!: AppearanceMenu;
    @Ref() private readonly blemishesMenu!: AppearanceMenu;
    @Ref() private readonly bodyBlemishesMenu!: AppearanceMenu;
    @Ref() private readonly eyeColorMenu!: AppearanceMenu;
    @Ref() private readonly blushMenu!: AppearanceMenu;
    @Ref() private readonly makeUpMenu!: AppearanceMenu;
    @Ref() private readonly lipstickMenu!: AppearanceMenu;

    private hairColors = [{r: 28, b: 33, g: 31}, {r: 39, b: 44, g: 42}, {r: 49, b: 44, g: 46}, {
        r: 53,
        b: 28,
        g: 38
    }, {r: 75, b: 31, g: 50}, {r: 92, b: 36, g: 59}, {r: 109, b: 53, g: 76}, {r: 107, b: 59, g: 80}, {
        r: 118,
        b: 69,
        g: 92
    }, {r: 127, b: 78, g: 104}, {r: 153, b: 93, g: 129}, {r: 167, b: 105, g: 147}, {r: 175, b: 112, g: 156}, {
        r: 187,
        b: 99,
        g: 160
    }, {r: 214, b: 123, g: 185}, {r: 218, b: 142, g: 195}, {r: 159, b: 89, g: 127}, {r: 132, b: 57, g: 80}, {
        r: 104,
        b: 31,
        g: 43
    }, {r: 97, b: 12, g: 18}, {r: 100, b: 10, g: 15}, {r: 124, b: 15, g: 20}, {r: 160, b: 25, g: 46}, {
        r: 182,
        b: 40,
        g: 75
    }, {r: 162, b: 47, g: 80}, {r: 170, b: 43, g: 78}, {r: 98, b: 98, g: 98}, {r: 128, b: 128, g: 128}, {
        r: 170,
        b: 170,
        g: 170
    }, {r: 197, b: 197, g: 197}, {r: 70, b: 85, g: 57}, {r: 90, b: 107, g: 63}, {r: 118, b: 118, g: 60}, {
        r: 237,
        b: 227,
        g: 116
    }, {r: 235, b: 147, g: 75}, {r: 242, b: 188, g: 153}, {r: 4, b: 158, g: 149}, {r: 2, b: 134, g: 95}, {
        r: 2,
        b: 116,
        g: 57
    }, {r: 63, b: 106, g: 161}, {r: 33, b: 97, g: 124}, {r: 24, b: 85, g: 92}, {r: 182, b: 52, g: 192}, {
        r: 112,
        b: 11,
        g: 169
    }, {r: 67, b: 19, g: 157}, {r: 220, b: 87, g: 184}, {r: 229, b: 3, g: 177}, {r: 230, b: 2, g: 145}, {
        r: 242,
        b: 49,
        g: 136
    }, {r: 251, b: 87, g: 128}, {r: 226, b: 88, g: 139}, {r: 209, b: 60, g: 89}, {r: 206, b: 32, g: 49}, {
        r: 173,
        b: 3,
        g: 9
    }, {r: 136, b: 2, g: 3}, {r: 31, b: 20, g: 24}, {r: 41, b: 25, g: 31}, {r: 46, b: 27, g: 34}, {
        r: 55,
        b: 30,
        g: 41
    }, {r: 46, b: 24, g: 34}, {r: 35, b: 21, g: 27}, {r: 2, b: 2, g: 2}, // { r: 112, b: 102, g: 108 },
        // { r: 157, b: 80, g: 122 }
    ];
    private lipsColors = [{r: 153, g: 37, b: 50}, {r: 200, g: 57, b: 93}, {r: 189, g: 81, b: 108}, {
        r: 184,
        g: 99,
        b: 122
    }, {r: 166, g: 82, b: 107}, {r: 177, g: 67, b: 76}, {r: 127, g: 49, b: 51}, {r: 164, g: 100, b: 93}, {
        r: 193,
        g: 135,
        b: 121
    }, {r: 203, g: 160, b: 150}, {r: 198, g: 145, b: 143}, {r: 171, g: 111, b: 99}, {r: 176, g: 96, b: 80}, {
        r: 168,
        g: 76,
        b: 51
    }, {r: 180, g: 113, b: 120}, {r: 202, g: 127, b: 146}, {r: 237, g: 156, b: 190}, {r: 231, g: 117, b: 164}, {
        r: 222,
        g: 62,
        b: 129
    }, {r: 179, g: 76, b: 110}, {r: 113, g: 39, b: 57}, {r: 79, g: 31, b: 42}, {r: 170, g: 34, b: 47}, {
        r: 222,
        g: 32,
        b: 52
    }, {r: 207, g: 8, b: 19}, {r: 229, g: 84, b: 112}, {r: 220, g: 63, b: 181}, {r: 194, g: 39, b: 178}, {
        r: 160,
        g: 28,
        b: 169
    }, {r: 110, g: 24, b: 117}, {r: 115, g: 20, b: 101}, {r: 86, g: 22, b: 92}, {r: 109, g: 26, b: 157}, {
        r: 27,
        g: 55,
        b: 113
    }, {r: 29, g: 78, b: 167}, {r: 30, g: 116, b: 187}, {r: 33, g: 163, b: 206}, {r: 37, g: 194, b: 210}, {
        r: 35,
        g: 204,
        b: 165
    }, {r: 39, g: 192, b: 125}, {r: 27, g: 156, b: 50}, {r: 20, g: 134, b: 4}, {r: 112, g: 208, b: 65}, {
        r: 197,
        g: 234,
        b: 52
    }, {r: 225, g: 227, b: 47}, {r: 255, g: 221, b: 38}, {r: 250, g: 192, b: 38}, {r: 247, g: 138, b: 39}, {
        r: 254,
        g: 89,
        b: 16
    }, {r: 190, g: 110, b: 25}, {r: 247, g: 201, b: 127}, {r: 251, g: 229, b: 192}, {r: 245, g: 245, b: 245}, {
        r: 179,
        g: 180,
        b: 179
    }, {r: 145, g: 145, b: 145}, {r: 86, g: 78, b: 78}, {r: 24, g: 14, b: 14}, {r: 88, g: 150, b: 158}, {
        r: 77,
        g: 111,
        b: 140
    }, {r: 26, g: 43, b: 85}, {r: 160, g: 126, b: 107}, {r: 130, g: 99, b: 85}, {r: 109, g: 83, b: 70}, {
        r: 62,
        g: 45,
        b: 39
    },];

    private maleHairlist = [{id: 0, name: "Glatze"}, {id: 1, name: "Kurzgeschoren"}, {
        id: 2,
        name: "Iro, modisch"
    }, {id: 3, name: "Hipster"}, {id: 4, name: "Seitenscheitel"}, {id: 5, name: "Kurzhaarschnitt"}, {
        id: 6,
        name: "Bikerfrisur"
    }, {id: 7, name: "Pferdeschwanz"}, {id: 8, name: "Flechtreihen"}, {id: 9, name: "Gelfrisur"}, {
        id: 10,
        name: "Kurz gekämmt"
    }, {id: 11, name: "Stachelfrisur"}, {id: 12, name: "Cäsarenfrisur"}, {id: 13, name: "Zerzaust"}, {
        id: 14,
        name: "Dreadlocks"
    }, {id: 15, name: "Langhaarfrisur"}, {id: 16, name: "Zottellocken"}, {id: 17, name: "Surferfrisur"}, {
        id: 18,
        name: "Seitenscheitel"
    }, {id: 19, name: "Hochgekämmt"}, {id: 20, name: "Gelfrisur, lang"}, {id: 21, name: "Junger Hipster"}, {
        id: 22,
        name: "Vokuhila"
    }, {id: 24, name: "Dreads 1"}, {id: 25, name: "Dreads 2"}, {id: 26, name: "Dreads 3"}, {
        id: 27,
        name: "Dreads 4"
    }, {id: 28, name: "Dreads 5"}, {id: 29, name: "Dreads 6"}, {id: 30, name: ""}, {id: 31, name: ""}, {
        id: 32,
        name: ""
    }, {id: 33, name: ""}, {id: 34, name: ""}, {id: 35, name: ""}, {id: 36, name: ""}, {id: 37, name: ""}, {
        id: 38,
        name: ""
    }, {id: 39, name: ""}, {id: 40, name: ""}, {id: 41, name: ""}, {id: 42, name: ""}, {id: 43, name: ""}, {
        id: 44,
        name: ""
    }, {id: 45, name: ""}, {id: 46, name: ""}, {id: 47, name: ""}, {id: 48, name: ""}, {id: 49, name: ""}, {
        id: 50,
        name: ""
    }, {id: 51, name: ""}, {id: 52, name: ""}, {id: 53, name: ""}, {id: 54, name: ""}, {id: 55, name: ""}, {
        id: 56,
        name: ""
    }, {id: 57, name: ""}, {id: 58, name: ""}, {id: 59, name: ""}, {id: 60, name: ""}, {id: 61, name: ""}, {
        id: 62,
        name: ""
    }, {id: 63, name: ""}, {id: 64, name: ""}, {id: 65, name: ""}, {id: 66, name: ""}, {id: 67, name: ""}, {
        id: 68,
        name: ""
    }, {id: 69, name: ""}, {id: 70, name: ""}, {id: 71, name: ""}, {id: 72, name: ""}, {id: 73, name: ""}, {
        id: 74,
        name: ""
    }, {id: 75, name: ""}, {id: 76, name: ""}, {id: 77, name: ""}, {id: 78, name: ""}, {id: 79, name: ""}, {
        id: 80,
        name: ""
    }, {id: 81, name: ""}, {id: 82, name: ""}, {id: 83, name: ""}, {id: 84, name: ""}, {id: 85, name: ""}, {
        id: 86,
        name: ""
    }, {id: 87, name: ""}, {id: 88, name: ""}, {id: 89, name: ""}, {id: 90, name: ""}, {id: 91, name: ""}, {
        id: 92,
        name: ""
    }, {id: 93, name: ""}, {id: 94, name: ""}, {id: 95, name: ""}, {id: 96, name: ""}, {id: 97, name: ""}, {
        id: 98,
        name: ""
    },];
    private femaleHairlist = [{id: 0, name: "Glatze"}, {id: 1, name: "Kurz"}, {id: 2, name: "Stufenbob"}, {
        id: 3,
        name: "Zöpfe"
    }, {id: 4, name: "Pferdeschwanz"}, {id: 5, name: "Iro, geflochten"}, {id: 6, name: "Flechtzöpfe"}, {
        id: 7,
        name: "Bob"
    }, {id: 8, name: "Iro, modisch"}, {id: 9, name: "Bananenfrisur"}, {id: 10, name: "Langer Bob"}, {
        id: 11,
        name: "Locker"
    }, {id: 12, name: "Pixieschnitt"}, {id: 13, name: "Rasierter Pony"}, {id: 14, name: "Dutt"}, {
        id: 15,
        name: "Lockiger Bob"
    }, {id: 16, name: "Pin-up-Girl"}, {id: 17, name: "Wilder Dutt"}, {id: 19, name: "Kleiner Dutt"}, {
        id: 20,
        name: "Gelockter Bob"
    }, {id: 21, name: "Langer Pony"}, {id: 22, name: "Flechtdutt"}, {id: 23, name: ""}, {id: 25, name: ""}, {
        id: 26,
        name: ""
    }, {id: 27, name: ""}, {id: 28, name: ""}, {id: 29, name: ""}, {id: 30, name: ""}, {id: 31, name: ""}, {
        id: 32,
        name: ""
    }, {id: 33, name: ""}, {id: 34, name: ""}, {id: 35, name: ""}, {id: 36, name: ""}, {id: 37, name: ""}, {
        id: 38,
        name: ""
    }, {id: 39, name: ""}, {id: 40, name: ""}, {id: 41, name: ""}, {id: 42, name: ""}, {id: 43, name: ""}, {
        id: 44,
        name: ""
    }, {id: 45, name: ""}, {id: 46, name: ""}, {id: 47, name: ""}, {id: 48, name: ""}, {id: 49, name: ""}, {
        id: 50,
        name: ""
    }, {id: 51, name: ""}, {id: 52, name: ""}, {id: 53, name: ""}, {id: 54, name: ""}, {id: 55, name: ""}, {
        id: 56,
        name: ""
    }, {id: 57, name: ""}, {id: 58, name: ""}, {id: 59, name: ""}, {id: 60, name: ""}, {id: 61, name: ""}, {
        id: 62,
        name: ""
    }, {id: 63, name: ""}, {id: 64, name: ""}, {id: 65, name: ""}, {id: 66, name: ""}, {id: 67, name: ""}, {
        id: 68,
        name: ""
    }, {id: 69, name: ""}, {id: 70, name: ""}, {id: 71, name: ""}, {id: 72, name: ""}, {id: 73, name: ""}, {
        id: 74,
        name: ""
    }, {id: 75, name: ""}, {id: 76, name: ""}, {id: 77, name: ""}, {id: 78, name: ""}, {id: 79, name: ""}, {
        id: 80,
        name: ""
    }, {id: 81, name: ""}, {id: 82, name: ""}, {id: 83, name: ""}, {id: 84, name: ""}, {id: 85, name: ""}, {
        id: 86,
        name: ""
    }, {id: 87, name: ""}, {id: 88, name: ""}, {id: 89, name: ""}, {id: 90, name: ""}, {id: 91, name: ""}, {
        id: 92,
        name: ""
    }, {id: 93, name: ""}, {id: 94, name: ""}, {id: 95, name: ""}, {id: 96, name: ""}, {id: 97, name: ""}, {
        id: 98,
        name: ""
    }, {id: 99, name: ""}, {id: 100, name: ""}, {id: 101, name: ""}, {id: 102, name: ""}, {id: 103, name: ""}, {
        id: 104,
        name: ""
    }, {id: 105, name: ""}, {id: 106, name: ""}, {id: 107, name: ""},];
    private eyebrowNames = ["Normal", "Modisch", "Kleopatra", "Fragend", "Femme", "Verführerisch", "Verkniffen", "Chola", "Triomphe", "Sorglos", "Kurvig", "Mäuschen", "Doppelschwung", "Dünn", "Gestrichelt", "Gezupft", "Schmal und gerade", "Natürlich", "Buschig", "Ungekämmt", "Raupe", "Normal", "Mediterran", "Gepflegt", "Büschel", "Federig", "Stachelig", "Zusammengewachsen", "Geschwungen", "Dreifachschwung", "Hoher Bogen", "Scherenschnitt", "Schütter", "Einfachschwung", "Gleichmäßig",];
    private facialHairNames = ["Kurze Stoppeln", "Balbo", "Henriquatre", "Spitzbart", "Kinnbart", "Kinnflaum", "Dünner Kinnstreifen", "Ungepflegt", "Knebelbart", "Schnurrbart", "Kurzer Bart", "Dreitagebart", "Dünner Henriquatre", "Mongolenbart", "Stift und Koteletten", "Kinnstreifen", "Balbo und Backenbart", "Koteletten", "Ungepflegter Bart", "Gezwirbelt", "Gezwirbelt & Dreitagebart", "Langer Schnäuzer", "Faustisch", "Otto & Kinnbart", "Otto & Vollbart", "Dünner Franz", "Schnäuzer & Koteletten", "Backenbart", "Lincoln-Kinnbart",];
    private complexionNames = ["Rotbäckchen", "Stoppelausschlag", "Hitzewallung", "Sonnenbrand", "Blutunterlaufen", "Alkoholiker", "Fleckig", "Totem", "Äderchen", "Lädiert", "Bleich", "Gespenstisch",];
    private frecklesNames = ["Engelchen", "Überall", "Unregelmäßig", "Fleckentanz", "Über die Brücke", "Babypuppe", "Kobold", "Sonnenverwöhnt", "Schönheitsflecken", "Reihenweise", "Fotomodelling", "Vereinzelt", "Gesprenkelt", "Regentropfen", "Beide Bäckchen", "Einseitig", "Paarweise", "Wacker",];
    private blemishesNames = ["Masern", "Pickel", "Hautunreinheiten", "Ausschlag", "Mitesser", "Erhitzt", "Pusteln", "Eieterpusteln", "Furunkulose", "Akne", "Ringelröten", "Gesichtsausschlag", "Nasenbohrer", "Pubertät", "Matschauge", "Kinnausschlag", "Two-Face", "T-Zone", "Fettig", "Narbig", "Aknenarben", "Totale Kraterlandschaft", "Herpes", "Eiterflechte",];
    private sundamageNames = ["Uneben", "Sandpapier", "Ungleichmäßig", "Rau", "Ledrig", "Strukturiert", "Grob", "Zerklüftet", "Knittrig", "Rissig", "Hart",];
    private makeUpNames = ["Verruchtes Schwarz", "Bronze", "Hellgrau", "Retro-Glam", "Natürlicher Look", "Cat Eyes", "Chola", "Vamp", "Vinewood-Glamour", "Bubblegum", "Aqua-Traum", "Pin-Up", "Lila-Leidenschaft", "Verruchtes Cat Eye", "Glühender Rubin", "Pop-Prinzessin", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "Guyliner", "33", "Blutige Tränen", "Heavy-Metal", "Trauer", "Fürst der Finsternis", "Rochen", "Grufti", "Punk", "Verwüstet", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74",];
    private lipstickNames = ["Farbe, matt", "Farbe, glanz", "Umrandet, matt", "Umrandet, glanz", "Stark umrandet, matt", "Stark umrandet, glanz", "Nudelook, umrandet, matt", "Nudelook, umrandet, glanz", "Verwischt", "Geisha",];
    private blushNames = ["Voll", "Schräg", "Rund", "Horizontal", "Hoch", "Schätzchen", "Achtziger",];

    private appearances!: AppearancesInterface;

    private gender = 0;
    private hairIndex = -1;
    private menuIndex = -1;

    public setCharacterAppearances(appearances: AppearancesInterface): void {
        this.appearances = appearances;

        if (this.gender === 0) {
            this.maleHairMenu.setAppearance({
                value: this.appearances.hair,
                opacity: 1,
                primaryColor: this.appearances.primHairColor,
                secondaryColor: this.appearances.secHairColor,
            });
        } else if (this.gender === 1) {
            this.femaleHairMenu.setAppearance({
                value: this.appearances.hair,
                opacity: 1,
                primaryColor: this.appearances.primHairColor,
                secondaryColor: this.appearances.secHairColor,
            });
        }

        this.eyeColorMenu.setAppearance({
            value: this.appearances.eyeColor, opacity: 1, primaryColor: 0,
        });

        this.eyeBrowsMenu.setAppearance({
            value: this.appearances.eyebrowsValue,
            opacity: this.appearances.eyebrowsOpacity,
            primaryColor: this.appearances.eyebrowsColor,
        });

        this.blushMenu.setAppearance({
            value: this.appearances.blushValue,
            opacity: this.appearances.blushOpacity,
            primaryColor: this.appearances.blushColor,
        });

        this.makeUpMenu.setAppearance({
            value: this.appearances.makeupValue,
            opacity: this.appearances.makeupOpacity,
            primaryColor: this.appearances.makeupColor,
        });

        this.lipstickMenu.setAppearance({
            value: this.appearances.lipstickValue,
            opacity: this.appearances.lipstickOpacity,
            primaryColor: this.appearances.lipstickColor,
        });

        this.facialHairMenu.setAppearance({
            value: this.appearances.facialhairValue,
            opacity: this.appearances.facialhairOpacity,
            primaryColor: this.appearances.facialhairColor,
        });

        this.chestHairMenu.setAppearance({
            value: this.appearances.chesthairValue,
            opacity: this.appearances.chesthairOpacity,
            primaryColor: this.appearances.primHairColor,
        });

        this.ageingMenu.setAppearance({
            value: this.appearances.ageingValue,
            opacity: this.appearances.ageingOpacity,
            primaryColor: this.appearances.ageingColor,
        });

        this.complexionMenu.setAppearance({
            value: this.appearances.complexionValue,
            opacity: this.appearances.complexionOpacity,
            primaryColor: this.appearances.complexionColor,
        });

        this.frecklesMenu.setAppearance({
            value: this.appearances.frecklesValue,
            opacity: this.appearances.frecklesOpacity,
            primaryColor: this.appearances.frecklesColor,
        });

        this.sundamageMenu.setAppearance({
            value: this.appearances.sundamageValue,
            opacity: this.appearances.sundamageOpacity,
            primaryColor: this.appearances.sundamageColor,
        });

        this.blemishesMenu.setAppearance({
            value: this.appearances.blemishesValue,
            opacity: this.appearances.blemishesOpacity,
            primaryColor: this.appearances.blemishesColor,
        });

        this.bodyBlemishesMenu.setAppearance({
            value: this.appearances.bodyblemishesValue,
            opacity: this.appearances.bodyblemishesOpacity,
            primaryColor: this.appearances.bodyblemishesColor,
        });
    }

    public setGender(gender: number): void {
        this.gender = gender;
    }

    private onMenuButtonClicked(menuIndex: number): void {
        if (this.menuIndex === menuIndex) {
            this.menuIndex = -1;
        } else {
            this.menuIndex = menuIndex;
        }
    }

    private updateHair(appearance: AppearanceInterface): void {
        this.hairIndex = appearance.value;

        if (this.gender === 0) {
            this.appearances.hair = this.maleHairlist[this.hairIndex].id;
        } else if (this.gender === 1) {
            this.appearances.hair = this.femaleHairlist[this.hairIndex].id;
        }

        this.appearances.primHairColor = appearance.primaryColor;

        if (appearance.secondaryColor !== undefined) {
            this.appearances.secHairColor = appearance.secondaryColor;
        }

        this.$emit("update-appearances", this.appearances);
    }

    private updateEyebrow(appearance: AppearanceInterface): void {
        this.appearances.eyebrowsValue = appearance.value;
        this.appearances.eyebrowsOpacity = appearance.opacity;
        this.appearances.eyebrowsColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateFacialhair(appearance: AppearanceInterface): void {
        this.appearances.facialhairValue = appearance.value;
        this.appearances.facialhairOpacity = appearance.opacity;
        this.appearances.facialhairColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateChesthair(appearance: AppearanceInterface): void {
        this.appearances.chesthairValue = appearance.value;
        this.appearances.chesthairOpacity = appearance.opacity;
        this.appearances.chesthairColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateAging(appearance: AppearanceInterface): void {
        this.appearances.ageingValue = appearance.value;
        this.appearances.ageingOpacity = appearance.opacity;
        this.appearances.ageingColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateComplexion(appearance: AppearanceInterface): void {
        this.appearances.complexionValue = appearance.value;
        this.appearances.complexionOpacity = appearance.opacity;
        this.appearances.complexionColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateFreckles(appearance: AppearanceInterface): void {
        this.appearances.frecklesValue = appearance.value;
        this.appearances.frecklesOpacity = appearance.opacity;
        this.appearances.frecklesColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateSkinDamage(appearance: AppearanceInterface): void {
        this.appearances.sundamageValue = appearance.value;
        this.appearances.sundamageOpacity = appearance.opacity;
        this.appearances.sundamageColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateBlemishes(appearance: AppearanceInterface): void {
        this.appearances.blemishesValue = appearance.value;
        this.appearances.blemishesOpacity = appearance.opacity;
        this.appearances.blemishesColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateBodyBlemishes(appearance: AppearanceInterface): void {
        this.appearances.bodyblemishesValue = appearance.value;
        this.appearances.bodyblemishesOpacity = appearance.opacity;
        this.appearances.bodyblemishesColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateEyeColor(appearance: AppearanceInterface): void {
        this.appearances.eyeColor = appearance.value;

        this.$emit("update-appearances", this.appearances);
    }

    private updateBlush(appearance: AppearanceInterface): void {
        this.appearances.blushValue = appearance.value;
        this.appearances.blushOpacity = appearance.opacity;
        this.appearances.blushColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateMakeup(appearance: AppearanceInterface): void {
        this.appearances.makeupValue = appearance.value;
        this.appearances.makeupOpacity = appearance.opacity;
        this.appearances.makeupColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }

    private updateLips(appearance: AppearanceInterface): void {
        this.appearances.lipstickValue = appearance.value;
        this.appearances.lipstickOpacity = appearance.opacity;
        this.appearances.lipstickColor = appearance.primaryColor;

        this.$emit("update-appearances", this.appearances);
    }
}
</script>

<style scoped>
.character-appearance {
    padding: 1vw;
    height: 100%;
    overflow: auto;
}

.menu {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
}

.left {
    position: absolute;
    left: 0%;
}

.right {
    position: absolute;
    right: 0%;
}

.menu > .icon-button {
    font-size: 0.7vw;
}
</style>
