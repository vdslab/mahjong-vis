import { atom } from "recoil";

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
