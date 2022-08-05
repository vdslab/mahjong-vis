import { YAKU_DESCRIPTION } from "../const/yakuDescription";

export const defineYaku = (featureList, haiLen, naki_cnt) => {
  const yakuList = makeObject(Object.keys(YAKU_DESCRIPTION));

  // 自風場風
  // TODO:浮き
  yakuList["zikaze_bakaze"] =
    featureList["zikaze_bakaze_kotu"] || featureList["zikaze_bakaze_kantu"]
      ? 100
      : featureList["zikaze_bakaze_toitu"]
      ? 70
      : 0;

  // 三元
  // TODO:浮き
  yakuList["sangenhai"] =
    featureList["sangen_kotu"] || featureList["sangen_kantu"]
      ? 100
      : featureList["sangen_toitu"]
      ? 70
      : 0;

  // タンヤオ
  yakuList["tanyao"] =
    ((featureValue(
      featureList["chunchan_shuntu"] + featureList["chunchan_kotu"],
      {
        4: 90,
        3: 70,
        2: 30,
        1: 10,
      }
    ) +
      (featureList["chunchan_toitu"] ? 10 : 0)) *
      60 +
      (Math.max(
        featureList["chunchan_cnt"] -
          featureList["ichikyu_cnt"] -
          featureList["zi_cnt"],
        0
      ) /
        haiLen) *
        40) /
    100;

  // 鳴いてないときに付く役
  if (naki_cnt === 0) {
    // 平和
    // TODO:七対子の一盃口ぽいやつ対策？
    yakuList["pinfu"] =
      pinfu(
        Math.round(
          featureList["chitoitu_cnt"] - featureList["toitoi_sananko_cnt"]
        ),
        Math.round(
          featureList["ichikyu_shuntu"] + featureList["chunchan_shuntu"]
        ),
        Math.round(featureList["3-7_ryanmen"] + featureList["23_78_ryanmen"]),
        Math.round(featureList["13_79_kanchan"] + featureList["2-8_kanchan"]),
        Math.round(featureList["penchan"]),
        Math.round(
          featureList["sangen_cnt"] + featureList["zikaze_bakaze_cnt"]
        ),
        0
      ) -
      ((featureList["sangen_kotu"] + featureList["zikaze_bakaze_kotu"]) * 25 +
        (featureList["sangen_toitu"] + featureList["zikaze_bakaze_toitu"]) *
          15 +
        (featureList["chunchan_kotu"] + featureList["ichikyu_kotu"]) +
        featureList["kaze_kotu"] * 20);

    // 一盃口
    yakuList["ipeko"] =
      (featureList["ipeko_score"] * 7 + featureList["ipeko_structure"] * 3) /
      10;

    // 七対子
    yakuList["chitoitu"] = featureValue(featureList["chitoitu_cnt"], {
      7: 100,
      6: 95,
      5: 80,
      4: 50,
      3: 20,
      2: 10,
    });

    // 二盃口
    yakuList["ryanpeko"] = 0;
  }

  // 三色同順
  yakuList["sanshoku_dojun"] =
    (featureList["sanshoku_cnt"] * 70 + featureList["sanshoku_mentu"] * 30) / 9;

  // 三暗刻
  // TODO:三槓子と対々和と差別
  yakuList["sananko"] =
    ((featureList["zi_kantu"] +
      featureList["ichikyu_kantu"] +
      featureList["chunchan_kantu"] +
      featureList["zi_kotu"] +
      featureList["ichikyu_kotu"] +
      featureList["chunchan_kotu"]) *
      100) /
    3;
  yakuList["sananko"] +=
    Math.min(
      3,
      featureList["zi_toitu"] +
        featureList["ichikyu_toitu"] +
        featureList["chunchan_toitu"]
    ) * 15;

  // 一通
  yakuList["ittu"] =
    (featureList["1-9_cnt"] * 70 + featureList["ittu_cnt"] * 30) / 9;

  // 対々和
  // TODO:三槓子と対々和と差別
  yakuList["sananko"] = featureList["toitoi_sananko_cnt"] * 22;
  yakuList["sananko"] +=
    Math.min(
      5,
      featureList["chitoitu_cnt"] - featureList["toitoi_sananko_cnt"]
    ) * 12;

  // チャンタ
  // TODO:浮き,評価値
  yakuList["chanta"] =
    (featureList["ichikyu_kotu"] +
      featureList["ichikyu_kantu"] +
      featureList["ichikyu_shuntu"] +
      featureList["zi_kotu"] +
      featureList["zi_kantu"]) *
    22;
  yakuList["chanta"] +=
    (featureList["ichikyu_toitu"] + featureList["zi_toitu"]) * 12;
  yakuList["chanta"] +=
    (featureList["penchan"] + featureList["13_79_kanchan"]) * 8;
  yakuList["chanta"] += featureList["23_78_ryanmen"] * 4;

  // 三槓子
  yakuList["sankantu"] =
    ((featureList["zi_kantu"] +
      featureList["ichikyu_kantu"] +
      featureList["chunchan_kantu"]) *
      100) /
    3;
  yakuList["sankantu"] +=
    (featureList["zi_kotu"] +
      featureList["ichikyu_kotu"] +
      featureList["chunchan_kotu"]) *
    15;

  // 小三元
  yakuList["shosangen"] =
    (featureList["sangen_kotu"] + featureList["sangen_kantu"]) * 40 +
    featureList["sangen_toitu"] * 20;

  // 混老頭
  // TODO:浮き
  yakuList["honroto"] =
    (featureList["ichikyu_kotu"] +
      featureList["ichikyu_kantu"] +
      featureList["zi_kotu"] +
      featureList["zi_kantu"]) *
    22;
  yakuList["honroto"] +=
    (featureList["zi_toitu"] + featureList["ichikyu_toitu"]) * 12;

  // 純チャン
  yakuList["junchan"] =
    featureList["ichikyu_kotu"] +
    featureList["ichikyu_kantu"] +
    featureList["ichikyu_shuntu"];
  22;
  yakuList["junchan"] += featureList["ichikyu_toitu"] * 12;
  yakuList["junchan"] +=
    (featureList["penchan"] + featureList["13_79_kanchan"]) * 10;
  yakuList["junchan"] += featureList["23_78_ryanmen"] * 8;

  // 混一色
  // TODO:段階的にすべきかどうか
  yakuList["honitu"] =
    ((featureList["same_color_cnt"] + featureList["zi_cnt"]) * 100) / haiLen;

  // 清一色
  // TODO:段階的にすべきかどうか
  yakuList["chinitu"] = (featureList["same_color_cnt"] * 100) / haiLen;

  // 保険
  // 必要ないかも
  for (const [key, value] of Object.entries(yakuList)) {
    yakuList[key] = Math.min(100, value);
  }
  return yakuList;
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

const featureValue = (cnt, d) => {
  return d[cnt] ? d[cnt] : 0;
};

// 平和
// ziYakuCnt:役の付く字牌
const pinfu = (head, shuntu, ryanmen, kanchan, penchan, ziYakuCnt, ukiCnt) => {
  // 12枚
  if (shuntu === 4) {
    if (ziYakuCnt === 2) return 50;
    if (ziYakuCnt === 1 || penchan === 1 || kanchan === 1) return 60;
    return 70;
  }
  // 9枚
  if (shuntu === 3) {
    if (head === 1) {
      if (ryanmen === 1) return 100;
      if (kanchan === 1 || penchan === 1) return 80;
      return 60;
    } else {
      if (ryanmen === 2) return 80;
      if (ryanmen === 1 && (kanchan === 1 || penchan === 1)) return 70;
      return 60;
    }
  }
  // 6枚
  if (shuntu === 2) {
    if (head === 1) {
      if (ryanmen === 2) return 80;
      if (kanchan === 1 || penchan === 1) return 60;
      return 40;
    } else {
      if (ryanmen === 2) return 60;
      if (ryanmen === 1 && (kanchan === 1 || penchan === 1)) return 50;
      return 40;
    }
  }
  return 0;
};
