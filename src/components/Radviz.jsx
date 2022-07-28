import * as d3 from "d3";
import { Card, Grid } from "@mui/material";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { shantenState, tehaiState } from "./atoms";
import { defineFeature } from "../functions/defineFeature";
import { defineYaku } from "../functions/defineYaku";
import { LDIMENSIONS } from "../const/lower";
import { UDIMENSIONS } from "../const/upper";
import { useEffect } from "react";
import { aaa } from "../../public/data/tehai_yaku";

const radviz = (data, r, dim) => {
  const n = dim.length;

  return data.slice(0, 100).map((item) => {
    const yaku = defineYaku(defineFeature(item.tehai).featureList, 14, 0);

    let a = 0;
    let b = 0;
    let c = 0;
    const dt = (2 * Math.PI) / n;
    for (let j = 0; j < n; ++j) {
      const v = yaku[dim[j]];
      a += v * Math.cos(dt * j);
      b += v * Math.sin(dt * j);
      c += v;
    }
    a *= r / c;
    b *= r / c;
    const d = (Math.sqrt(a * a + b * b) * 4) / 3;
    const t = Math.atan2(b, a);
    return { x: d * Math.cos(t), y: d * Math.sin(t) };
  });
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  // 手牌の特徴量を計算
  const { featureList, shanten } = defineFeature(tehai);
  const setShanten = useSetRecoilState(shantenState);

  useEffect(() => {
    setShanten(shanten);
  }, [shanten]);

  // if (tehai.length === 0) return <></>;

  // 図の大きさ
  const r = 500;
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";

  // 役を推定
  // const data = defineYaku(featureList, 14, 0);
  // 点の座標
  const Lpoints = radviz(aaa, r, LDIMENSIONS);
  const Upoints = radviz(aaa, r, UDIMENSIONS);
  //点の色
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  for (const item of aaa) {
    if (item.yaku) color(item.yaku);
  }
  // 点の大きさ
  const pointSize = 10;

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Grid container sx={{ p: 3 }} columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <svg viewBox={`0 0 ${width} ${height}`}>
            <g transform={`translate(${margin + r},${margin + r})`}>
              <circle r={r} fill="none" stroke={lineColor} />
              {LDIMENSIONS.map((property, i) => {
                return (
                  <g
                    key={i}
                    transform={`rotate(${(360 / LDIMENSIONS.length) * i + 90})`}
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
              {aaa.slice(0, 100).map((item, i) => {
                if (item.yaku === null) return <></>;
                const { x, y } = Lpoints[i];
                // console.log(x, y);
                return (
                  <g
                    key={i}
                    transform={`translate(${x},${y})`}
                    onMouseEnter={() => console.log(item.tehai)}
                  >
                    <circle
                      r={pointSize}
                      fill={color(item.yaku)}
                      opacity="0.8"
                    />
                    <text>{item.yaku}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </Grid>
        <Grid item xs={6}>
          <svg viewBox={`0 0 ${width} ${height}`}>
            <g transform={`translate(${margin + r},${margin + r})`}>
              <circle r={r} fill="none" stroke={lineColor} />
              {UDIMENSIONS.map((property, i) => {
                return (
                  <g
                    key={i}
                    transform={`rotate(${(360 / UDIMENSIONS.length) * i + 90})`}
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
              {aaa.slice(0, 100).map((item, i) => {
                if (item.yaku === null) return <></>;
                const { x, y } = Upoints[i];
                // console.log(x, y);
                return (
                  <g
                    key={i}
                    transform={`translate(${x},${y})`}
                    onMouseEnter={() => console.log(item.tehai)}
                  >
                    <circle
                      r={pointSize}
                      fill={color(item.yaku)}
                      opacity="0.8"
                    />
                    <text>{item.yaku}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        </Grid>
      </Grid>
    </Card>
  );
};
