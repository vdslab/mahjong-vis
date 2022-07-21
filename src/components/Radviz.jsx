import * as d3 from "d3";
import { Card, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { defineFeature } from "../functions/defineFeature";
import { tehaiState } from "./atoms";
import { DIMENSIONS } from "../const/clusterValue";

const calc_dist = (a, b, n) => {
  let sum = 0;
  for (let i = 0; i < n; ++i) {
    sum += (a[i] - b[i]) * (a[i] - b[i]);
  }
  return Math.sqrt(sum);
};

const radviz = (data, dimensions, r) => {
  const n = Object.keys(dimensions).length;
  // const scales = Object.keys(dimensions).map((property) => {
  //   console.log(property);
  //   return d3
  //     .scaleLinear()
  //     .domain(d3.extent(data, (item) => item[property]))
  //     .range([0, 1]);
  // });
  return data.map((item, i) => {
    let a = 0;
    let b = 0;
    let c = 0;
    const dt = (2 * Math.PI) / n;
    for (let j = 0; j < n; ++j) {
      const v = calc_dist(item, dimensions[Object.keys(dimensions)[j]], n);
      a += v * Math.cos(dt * j);
      b += v * Math.sin(dt * j);
      c += v;
    }
    a *= r / c;
    b *= r / c;
    const d = Math.sqrt(a * a + b * b);
    const t = Math.atan2(b, a);
    return { x: d * Math.cos(t), y: d * Math.sin(t) };
  });
};

export const Radviz = () => {
  const tehai = useRecoilValue(tehaiState);
  const feature = defineFeature(tehai);
  const dimensions = DIMENSIONS;
  const data = [
    [
      0, 0, 100, 0, 0, 56.66666667, 0, 48.33333333, 48.88888889, 0, 46, 0, 15,
      0, 0, 0, 0, 42.85714286, 42.85714286,
    ],
  ];
  const r = 300;
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";

  const points = radviz(data, dimensions, r);
  // console.log(points);

  return (
    <Card sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Radvis
      </Typography>
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin + r},${margin + r})`}>
          <circle r={r} fill="none" stroke={lineColor} />
          {Object.keys(dimensions).map((property, i) => {
            return (
              <g
                key={i}
                transform={`rotate(${
                  (360 / Object.keys(dimensions).length) * i + 90
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
                >
                  {property}
                </text>
              </g>
            );
          })}
          {data.map((item, i) => {
            const { x, y } = points[i];
            return (
              <g key={i} transform={`translate(${x},${y})`}>
                <circle r="3" opacity="0.8" />
              </g>
            );
          })}
        </g>
      </svg>
    </Card>
  );
};
