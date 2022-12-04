import { atom } from "recoil";
import { DIMENSIONS } from "../const/dimensions";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";

export const tehaiState = atom({
  key: "tehai",
  default: [],
});

export const suteHaiListState = atom({
  key: "sutehaiList",
  default: [],
});

export const haiCheckListState = atom({
  key: "haiCheckList",
  default: [
    Array(9).fill(0),
    Array(9).fill(0),
    Array(9).fill(0),
    Array(4).fill(0),
    Array(3).fill(0),
  ],
});

export const shantenState = atom({
  key: "shanten",
  default: {
    other: 8,
    chitoitu: 6,
    kokushi: 13,
  },
});

export const diffShantenState = atom({
  key: "diffShanten",
  default: {},
});

export const yakuValueState = atom({
  key: "yakuValue",
  default: {},
});

export const selectedTileState = atom({
  key: "selectedTile",
  default: "",
});

export const decompositionsState = atom({
  key: "decompositions",
  default: {},
});

export const allTileState = atom({
  key: "allTile",
  default: {
    shanten: {
      other: 8,
      chitoitu: 6,
      kokushi: 13,
    },
    yaku: Object.keys(YAKU_DESCRIPTION).reduce(
      (obj, x) => Object.assign(obj, { [x]: 0 }),
      {}
    ),
  },
});

export const haiModeState = atom({
  key: "haiMode",
  default: 0,
});

export const ryanmenState = atom({
  key: "ryanmen",
  default: new Set(),
});

export const dimensionState = atom({
  key: "dimension",
  default: DIMENSIONS[0],
});

export const testState = atom({
  key: "test",
  default: false,
});

export const tanyaoState = atom({
  key: "tanyao",
  default: false,
});
export const chitoituState = atom({
  key: "chitoitu",
  default: false,
});
export const honituState = atom({
  key: "honitu",
  default: false,
});
