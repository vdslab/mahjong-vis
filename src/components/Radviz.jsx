import * as d3 from "d3";
import { Card, Typography } from "@mui/material";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { shantenState, tehaiState } from "./atoms";
import { defineFeature } from "../functions/defineFeature";
import { DIMENSIONS } from "../const/clusterValue";
import { defineYaku } from "../functions/defineYaku";
import { useEffect } from "react";

const calc_dist = (a, b, n) => {
  let sum = 0;
  for (let i = 0; i < n; ++i) {
    sum += (a[i] - b[i]) * (a[i] - b[i]);
  }
  return Math.sqrt(sum);
};

const radviz = (data, r) => {
  const n = Object.keys(DIMENSIONS).length;
  const power = Object.values(DIMENSIONS).map((dim) => calc_dist(data, dim, n));
  const scale = d3.scaleLinear().domain(d3.extent(power)).range([0, 1]);

  let a = 0;
  let b = 0;
  let c = 0;
  const dt = (2 * Math.PI) / n;
  for (let j = 0; j < n; ++j) {
    const v = 1 - scale(power[j]);
    a += v * Math.cos(dt * j);
    b += v * Math.sin(dt * j);
    c += v;
  }
  a *= r / c;
  b *= r / c;
  const d = Math.sqrt(a * a + b * b);
  const t = Math.atan2(b, a);
  return { x: d * Math.cos(t), y: d * Math.sin(t) };
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  // 手牌の特徴量を計算
  const { featureList, shanten } = defineFeature(tehai);
  const setShanten = useSetRecoilState(shantenState);

  useEffect(() => {
    setShanten(shanten);
  }, [shanten]);
  if (tehai.length === 0) return <></>;

  // 図の大きさ
  const r = 300;
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";

  // 役を推定
  const data = defineYaku(featureList, 14, 0);
  // 点の座標
  const point = radviz(data, r);
  // 点の大きさ
  const pointSize = 10;

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Radvis
      </Typography>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin + r},${margin + r})`}>
          <circle r={r} fill="none" stroke={lineColor} />
          {Object.keys(DIMENSIONS).map((property, i) => {
            return (
              <g
                key={i}
                transform={`rotate(${
                  (360 / Object.keys(DIMENSIONS).length) * i + 90
                })`}
              >
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
                  {property}
                </text>
              </g>
            );
          })}
          {point.x && point.y ? (
            <g transform={`translate(${-point.x},${-point.y})`}>
              <circle r={pointSize} opacity="0.8" />
            </g>
          ) : (
            <></>
          )}
        </g>
      </svg>
    </Card>
  );
};
