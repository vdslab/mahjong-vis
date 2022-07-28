import { Card } from "@mui/material";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { shantenState, tehaiState, yakuValueState } from "./atoms";
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
  // 手牌の特徴量を計算
  const { featureList, shanten } = defineFeature(tehai);
  const setShanten = useSetRecoilState(shantenState);
  const setYakuValue = useSetRecoilState(yakuValueState);

  // 役を推定
  const data = defineYaku(featureList, 14, 0);
  const test = deleteElement(tehai).map((i, _) => {
    const { featureList, shanten } = defineFeature(i);
    const yaku = defineYaku(featureList, 13, 0);
    return DIMENSIONS.reduce(
      (obj, x) => Object.assign(obj, { [x]: yaku[x] - data[x] }),
      {}
    );
  });

  useEffect(() => {
    setShanten(shanten);
  }, [shanten]);
  useEffect(() => {
    setYakuValue(test);
  }, [test]);

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

// 配列から1つの要素のみを取り除く
const deleteElement = (array) => {
  return [...Array(array.length)].map((_, idx) =>
    array.slice(0, idx).concat(array.slice(idx + 1))
  );
};
