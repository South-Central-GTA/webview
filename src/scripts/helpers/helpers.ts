import alt from "@/scripts/services/alt.service";

export function countWords(input: string): number {
    const regex = /[^\s]+/g;
    const words = input.toLowerCase().match(regex);

    if (!words || words.length === 0) {
        return 0;
    }

    return words.length;
}

export const UUIDV4 = (): string => {
    let uuid = "";
    for (let ii = 0; 32 > ii; ii += 1) {
        8 === ii || 20 === ii ? ((uuid += "-"), (uuid += (0 | (16 * Math.random())).toString(
                16))) : 12 === ii ? ((uuid += "-"), (uuid += "4")) : 16 === ii ? ((uuid += "-"), (uuid += (8 | (4 * Math.random())).toString(
                16))) : (uuid += (0 | (16 * Math.random())).toString(16));
    }
    return uuid;
};

export const UID = (): number => {
    return Math.floor(Math.random() * 9999999);
};

export const isNumeric = (value: string): boolean => {
    return /^-{0,1}\d+$/.test(value);
};

export const replaceUmlaut = (str: string): string => {
    const umlautMap: { [type: string]: string } = {
        "\u00dc": "UE", "\u00c4": "AE", "\u00d6": "OE", "\u00fc": "ue", "\u00e4": "ae", "\u00f6": "oe", "\u00df": "ss",
    };

    return str
            .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
                const big = umlautMap[a.slice(0, 1)];
                return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
            })
            .replace(new RegExp("[" + Object.keys(umlautMap).join("|") + "]", "g"), (a) => umlautMap[a]);
};

export const getUmlauteBack = (str: string): string => {
    return str
            .replace("ae", "ä")
            .replace("oe", "ö")
            .replace("ue", "ü")
            .replace("AE", "Ä")
            .replace("OE", "Ö")
            .replace("UE", "Ü");
};

export const onFocus = (state: boolean): void => {
    alt.emit("player:focusinput", state);
};

export const allowOnlyNumbers = (event: KeyboardEvent): void => {
    if (!/\d/.test(event.key) && event.key !== ".") {
        return event.preventDefault();
    }
};
