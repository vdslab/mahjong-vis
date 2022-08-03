import { Card } from "@mui/material";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  shantenState,
  tehaiState,
  yakuValueState,
  diffShantenState,
} from "./atoms";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { useEffect } from "react";

const radviz = (data, r, n) => {
  let a = 0;
  let b = 0;
  let c = 0;
  const dt = (2 * Math.PI) / n;
  for (let j = 0; j < n; ++j) {
    const v = data[DIMENSIONS[j]];
    a += v * Math.cos(dt * j);
    b += v * Math.sin(dt * j);
    c += v;
  }
  a *= r / c;
  b *= r / c;
  const d = (Math.sqrt(a * a + b * b) * 4) / 3;
  const t = Math.atan2(b, a);
  return { x: d * Math.cos(t), y: d * Math.sin(t) };
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  // 14枚の手牌の特徴量と向聴数を計算
  const { featureList, shanten } = defineFeature(tehai);
  const setShanten = useSetRecoilState(shantenState);
  const setYakuValue = useSetRecoilState(yakuValueState);
  const setDiffShanten = useSetRecoilState(diffShantenState);

  // 役を推定
  const data = defineYaku(featureList, 14, 0);

  // 14枚の手牌の特徴量と、13枚の手牌の特徴量の差
  const diffAssessment = {};
  // 14枚の手牌の向聴数と、13枚の手牌の向聴数の差
  const diffShanten = {};
  for (const [key, value] of Object.entries(deleteElement(tehai))) {
    const tmp = defineFeature(value);
    const yaku = defineYaku(tmp["featureList"], value.length, 0);
    diffAssessment[key] = DIMENSIONS.reduce(
      (obj, x) => Object.assign(obj, { [x]: yaku[x] - data[x] }),
      {}
    );
    diffShanten[key] = Object.keys(shanten).reduce(
      (obj, x) => Object.assign(obj, { [x]: shanten[x] - tmp["shanten"][x] }),
      {}
    );
  }

  useEffect(() => {
    setShanten(shanten);
  }, [shanten]);

  useEffect(() => {
    setYakuValue(diffAssessment);
  }, [diffAssessment]);

  useEffect(() => {
    setDiffShanten(diffShanten);
  }, [diffShanten]);

  if (tehai.length === 0) return <></>;

  // 図の大きさ
  const r = 300;
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";
  const n = DIMENSIONS.length;

  // 点の座標
  const { x, y } = radviz(data, r, n);
  // 点の大きさ
  const pointSize = 10;

  return (
    <Card sx={{ p: 1, height: "100%" }}>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin + r},${margin + r})`}>
          <circle r={r} fill="none" stroke={lineColor} />
          {DIMENSIONS.map((property, i) => {
            return (
              <g key={i} transform={`rotate(${(360 / n) * i + 90})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-r}
                  stroke={lineColor}
                  opacity={0.3}
                />
                <text
                  y={-r}
                  textAnchor="middle"
                  dominantBaseline="text-after-edge"
                  fontSize={20}
                >
                  {YAKU_DESCRIPTION[property]["name"]}
                </text>
              </g>
            );
          })}
          <g transform={`translate(${x},${y})`}>
            <circle r={pointSize} opacity="0.8" />
          </g>
        </g>
      </svg>
    </Card>
  );
};

// 配列から取り除いた要素とそれ以外の要素のオブジェクトを返す
const deleteElement = (array) => {
  const res = {};
  for (let i = 0; i < array.length; ++i) {
    res[array[i]] = array.slice(0, i).concat(array.slice(i + 1));
  }
  return res;
};
