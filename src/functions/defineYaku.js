import { YAKU_LIST } from "../const/const";

export const defineYaku = (featureList, haiLen, naki_cnt) => {
  const yakuList = makeObject(YAKU_LIST);

  // 自風場風
  // TODO:浮き
  yakuList["zikaze_bakaze"] =
    featureList["zikaze_bakaze_kotu"] || featureList["zikaze_bakaze_kantu"]
      ? 100
      : featureList["zikaze_bakaze_toitu"]
      ? 60
      : 0;

  // 三元
  // TODO:浮き
  yakuList["sangenhai"] =
    featureList["sangen_kotu"] || featureList["sangen_kantu"]
      ? 100
      : featureList["sangen_toitu"]
      ? 60
      : 0;

  // タンヤオ
  yakuList["tanyao"] = (featureList["chunchan_cnt"] * 100) / haiLen;

  // 鳴いてないときに付く役
  if (naki_cnt === 0) {
    // 平和
    // TODO:七対子の一盃口ぽいやつ対策？
    // TODO:数値に段階を持たせる
    yakuList["pinfu"] =
      featureList["chitoitu_cnt"] - featureList["toitoi_sananko_cnt"] >= 1
        ? 1
        : 0;
    let tmp_cnt = 4;
    let sum_cnt =
      featureList["ichikyu_shuntu"] + featureList["chunchan_shuntu"];
    let coe = Math.min(tmp_cnt, sum_cnt);
    yakuList["pinfu"] += coe * 23;

    tmp_cnt -= coe;
    sum_cnt = featureList["3-7_ryanmen"] + featureList["23_78_ryanmen"];
    coe = Math.min(tmp_cnt, sum_cnt);
    yakuList["pinfu"] += coe * 15;

    tmp_cnt -= coe;
    sum_cnt = featureList["13_79_kanchan"] + featureList["2-8_kanchan"];
    coe = Math.min(tmp_cnt, sum_cnt);
    yakuList["pinfu"] += coe * 10;

    tmp_cnt -= coe;
    sum_cnt = featureList["penchan"];
    coe = Math.min(tmp_cnt, sum_cnt);
    yakuList["pinfu"] += coe * 4;

    // 一盃口
    yakuList["ipeko"] = 0;

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

  return Object.values(yakuList).map((data, _) => Math.min(100, data));
};

// 配列の中身をkeyとしたobjectを返す
const makeObject = (array, init = 0) => {
  return array.reduce((obj, x) => Object.assign(obj, { [x]: init }), {});
};

const featureValue = (cnt, d) => {
  return d[cnt] ? d[cnt] : 0;
};
