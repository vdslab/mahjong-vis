import * as d3 from "d3";
import { useRecoilValue } from "recoil";
import { yakuValueState } from "./atoms";
import { changeHaiName2Path } from "./TehaiView";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { Card } from "@mui/material";

export const AssessmentView = () => {
  const yakuValue = useRecoilValue(yakuValueState);

  const margin = {
    top: 10,
    bottom: 45,
    left: 100,
    right: 90,
  };
  const contentWidth = 800;
  const contentHeight = 1200;
  const strokeColor = "#888";
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;

  const colorScale = d3
    .scaleLinear()
    .domain([100, 0, -100])
    .range(["red", "yellow", "blue"]);
  const xScale = d3
    .scaleLinear()
    .domain([0, Object.keys(yakuValue).length])
    .range([0, contentWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain([DIMENSIONS.length, 0])
    .range([contentHeight, 0])
    .nice();

  return (
    <Card sx={{ p: 1, height: "100%" }}>
      {Object.keys(yakuValue).length === 0 ? (
        <div>loading...</div>
      ) : (
        <svg
          viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        >
          <VerticalAxis
            names={DIMENSIONS}
            scale={yScale}
            strokeColor={strokeColor}
            height={contentHeight}
          />
          <HorizontalAxis
            tiles={Object.keys(yakuValue)}
            scale={xScale}
            strokeColor={strokeColor}
            width={svgWidth}
          />
          <Contents
            data={yakuValue}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
          />
        </svg>
      )}
    </Card>
  );
};

const VerticalAxis = ({ names, scale, strokeColor, height }) => {
  const x = 70;
  const [y1, y2] = [-20, height + 50];
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={strokeColor} />
      {names.map((name, idx) => {
        return (
          <g key={idx} transform={`translate(${x}, ${140 + scale(idx)})`}>
            <text
              x="-20"
              textAnchor="end"
              dominantBaseline="central"
              fontSize="30"
            >
              {YAKU_DESCRIPTION[name]["name"]}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const HorizontalAxis = ({ tiles, scale, strokeColor, width }) => {
  const y = 85;
  const [x1, x2] = [-60, width];
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={strokeColor} />
      {tiles.map((tile, idx) => {
        return (
          <g key={idx} transform={`translate(${80 + scale(idx)}, 0)`}>
            <image href={changeHaiName2Path(tile)} width="57" height="76" />
          </g>
        );
      })}
    </g>
  );
};

const Contents = ({ data, xScale, yScale, colorScale }) => {
  const viewData = transpose(Object.values(data).map((i) => Object.values(i)));

  return (
    <g transform={`translate(80, 115)`}>
      {viewData.map((rows, i) => {
        return rows.map((item, j) => {
          return (
            <rect
              key={i * viewData.length + j}
              x={xScale(j)}
              y={yScale(i)}
              width={57}
              height={57}
              fill={colorScale(item)}
            />
          );
        });
      })}
    </g>
  );
};

// style={{
//   transitionDuration: "1s",
//   transitionProperty: "all",
//   transitionDelay: "0.2s",
// }}

// 転置
const transpose = (a) => {
  return a[0].map((_, c) => a.map((r) => r[c]));
};
