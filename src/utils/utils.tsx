import { RuneItem } from "../../types/common/main";

export const groupBy = (arr: RuneItem[], runesArray: RuneItem[]) => {
    const map = new Map();
    arr.forEach((coin: RuneItem) => {
        if (map.get(coin.value) === undefined) {
            map.set(coin.value, 1)
        }
        else {
            map.set(coin.value, map.get(coin.value) + 1)
        }
    }
    );
    
    const array = Array.from(map, ([key, value]) => {
        const runeObject=runesArray.filter(obj => {
            return obj.value === key
        })

        return {
            amountNeeded: value, value: key, name: runeObject[0].name, texture: runeObject[0].texture
        };
    });
    return array;
}

export const calculateRunesFromToLevel = (fromLevel: number, toLevel: number) => {
    let runesBetween=0;
    if(fromLevel>toLevel){
        return 0;
    }
    
    for(let i=fromLevel+1;i<=toLevel;i++){
        let x=((i+81)-92)*0.02;
        if(x<0){
            x=0;
        }
        const cost=Math.floor(((x+0.1)*((i+81)**2))+1)
        runesBetween+=cost;
    }
    return runesBetween;
}

export const enum ModesEnum {
    RUNES_MODE = "RUNES_MODE",
    LEVEL_MODE = "LEVEL_MODE",
    TARGET_MODE = "TARGET_MODE",
}

export enum BackgroundsEnum {
    black = "black",
    liurnia = "liurnia",
    caelid = "caelid",
    academy = "academy",
    erdtree = "erdtree",
    limgrave="limgrave",
    altus="altus"
}

export const setToLS = (key: any, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export const getFromLS = (key: any) => {
    const value = window.localStorage.getItem(key);
  
    if (value) {
      return JSON.parse(value);
    }
}
