import { YAKU_DESCRIPTION } from "../const/yakuDescription";

export const defineYaku = (featureList, haiLen) => {
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
  // 枚数付与点(30点)
  yakuList["tanyao"] =
    (Math.max(
      featureList["chunchan_cnt"] -
        featureList["ichikyu_cnt"] -
        featureList["zi_cnt"],
      0
    ) /
      haiLen) *
    30;

  // 構造付与点(70点)
  yakuList["tanyao"] += Math.max(
    (featureList["chunchan_shuntu"] + featureList["chunchan_kotu"]) * 15 +
      featureList["chunchan_toitu"] * 10 +
      (featureList["3-7_ryanmen"] + featureList["2-8_kanchan"]) * 8 +
      featureList["23_78_ryanmen"] * 6 +
      featureList["13_79_kanchan"] * 3 +
      featureList["penchan"],
    featureList["chitoitu_chunchan_cnt"] * 10
  );

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
      Math.round(featureList["sangen_cnt"] + featureList["zikaze_bakaze_cnt"]),
      0
    ) -
    ((featureList["sangen_kotu"] + featureList["zikaze_bakaze_kotu"]) * 25 +
      (featureList["sangen_toitu"] + featureList["zikaze_bakaze_toitu"]) * 15 +
      (featureList["chunchan_kotu"] + featureList["ichikyu_kotu"]) +
      featureList["kaze_kotu"] * 20);

  // 一盃口
  yakuList["ipeko"] =
    (featureList["ipeko_score"] * 7 + featureList["ipeko_structure"] * 3) / 10;

  // 七対子
  yakuList["chitoitu"] = featureValue(
    featureList["chitoitu_chunchan_cnt"] +
      featureList["chitoitu_ichikyu_cnt"] +
      featureList["chitoitu_zi_cnt"],
    {
      7: 100,
      6: 95,
      5: 80,
      4: 50,
      3: 20,
      2: 10,
    }
  );

  // 二盃口
  yakuList["ryanpeko"] = 0;

  // 三色同順
  yakuList["sanshoku_dojun"] =
    (featureList["sanshoku_cnt"] * 70 + featureList["sanshoku_mentu"] * 30) / 9;

  // 三暗刻
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
  // 枚数点付与(40点)
  yakuList["ittu"] = (featureList["ittu_score"] / 9) * 40;
  // 構造点付与(60点)
  yakuList["ittu"] += featureList["ittu_structure"];

  // 小三元
  yakuList["shosangen"] =
    featureList["sangen_kotu"] * 40 + featureList["sangen_toitu"] * 20;

  // 混老頭
  // 枚数付与点(30点)
  yakuList["honroto"] =
    (Math.max(
      featureList["ichikyu_cnt"] +
        featureList["zi_cnt"] -
        featureList["chunchan_cnt"],
      0
    ) /
      haiLen) *
    30;
  // 構造付与点(70点)
  yakuList["honroto"] += Math.max(
    (featureList["zi_kotu"] + featureList["ichikyu_kotu"]) * 15 +
      (featureList["zi_toitu"] + featureList["ichikyu_toitu"]) * 10,
    (featureList["chitoitu_ichikyu_cnt"] + featureList["chitoitu_zi_cnt"]) * 10
  );

  // チャンタ
  yakuList["chanta"] =
    (featureList["ichikyu_kotu"] +
      featureList["ichikyu_shuntu"] +
      featureList["zi_kotu"]) *
      22 +
    (featureList["ichikyu_toitu"] + featureList["zi_toitu"]) * 12 +
    (featureList["penchan"] + featureList["13_79_kanchan"]) * 8 +
    featureList["2-8_kanchan"] * 4 +
    featureList["23_78_ryanmen"] * 2;

  // 純チャン
  yakuList["junchan"] =
    (featureList["ichikyu_kotu"] + featureList["ichikyu_shuntu"]) * 22 +
    featureList["ichikyu_toitu"] * 12 +
    (featureList["penchan"] + featureList["13_79_kanchan"]) * 8 +
    featureList["2-8_kanchan"] * 4 +
    featureList["23_78_ryanmen"] * 2;

  // 混一色
  // 枚数付与点(30点)
  yakuList["honitu"] =
    ((featureList["same_color_cnt"] + featureList["zi_cnt"]) / haiLen) * 30;
  // 構造付与点(70点)
  yakuList["honitu"] += featureList["honitu_score"];
  // 清一色
  // 枚数付与点(30点)
  yakuList["chinitu"] = (featureList["same_color_cnt"] / haiLen) * 30;
  // 構造付与点(70点)
  yakuList["chinitu"] += featureList["chinitu_score"];

  console.log(yakuList);
  // 100点を超えるやつを100に丸める
  for (const [key, value] of Object.entries(yakuList)) {
    yakuList[key] = Math.max(0, Math.min(100, value));
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
