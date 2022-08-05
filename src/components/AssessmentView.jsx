import * as d3 from "d3";
import { useRecoilValue, useRecoilState } from "recoil";
import { yakuValueState, selectedTileState } from "./atoms";
import { changeHaiName2Path } from "./TehaiView";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import { Card, Tooltip } from "@mui/material";
import { memo, useCallback } from "react";

export const AssessmentView = () => {
  const yakuValue = useRecoilValue(yakuValueState);
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileState);

  const margin = {
    top: 10,
    bottom: 50,
    left: 100,
    right: 90,
  };
  const contentWidth = 800;
  const contentHeight = 1200;
  const strokeColor = "#888";
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;

  const colorScale = useCallback(
    d3
      .scaleLinear()
      .domain([100, 0, -100])
      .range(["orangered", "whitesmoke", "dodgerblue"]),
    []
  );
  const xScale = d3
    .scaleLinear()
    .domain([0, Object.keys(yakuValue).length])
    .range([0, contentWidth])
    .nice();
  const yScale = useCallback(
    d3
      .scaleLinear()
      .domain([0, DIMENSIONS.length])
      .range([0, contentHeight - 200])
      .nice(),
    []
  );

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
            height={svgHeight}
          />
          <HorizontalAxis
            tiles={Object.keys(yakuValue)}
            scale={xScale}
            strokeColor={strokeColor}
            width={svgWidth}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
          />
          <Contents
            data={yakuValue}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
          />
          <Legends
            x={80}
            y={svgHeight - 160}
            width={svgWidth - 200}
            colorScale={colorScale}
          />
        </svg>
      )}
    </Card>
  );
};

const VerticalAxis = memo(({ names, scale, strokeColor, height }) => {
  const x = 70;
  const [y1, y2] = [-20, height - 180];
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={strokeColor} />
      {names.map((name, idx) => {
        return (
          <g key={idx} transform={`translate(${x}, ${120 + scale(idx)})`}>
            <Tooltip
              title={YAKU_DESCRIPTION[name]["description"]}
              placement="top-start"
              arrow
              disableInteractive
            >
              <text
                x="-20"
                textAnchor="end"
                dominantBaseline="central"
                fontSize="30"
                style={{ userSelect: "none" }}
              >
                {YAKU_DESCRIPTION[name]["name"]}
              </text>
            </Tooltip>
          </g>
        );
      })}
    </g>
  );
});

const HorizontalAxis = ({
  tiles,
  scale,
  strokeColor,
  width,
  selectedTile,
  setSelectedTile,
}) => {
  const y = 80;
  const [x1, x2] = [-60, width];
  const [tileWidth, tileHeight] = [51, 68];

  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={strokeColor} />
      {tiles.map((tile, idx) => {
        return (
          <g key={idx} transform={`translate(${80 + scale(idx)}, 0)`}>
            <image
              href={changeHaiName2Path(tile)}
              width={tileWidth}
              height={tileHeight}
              onClick={() => setSelectedTile(tile)}
            />
            {selectedTile === tile && (
              <rect
                fill="none"
                stroke="red"
                strokeWidth="4px"
                width={tileWidth}
                height={tileHeight}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

const Contents = ({ data, xScale, yScale, colorScale }) => {
  const viewData = transpose(Object.values(data).map((i) => Object.values(i)));

  return (
    <g transform={`translate(80, 90)`}>
      {viewData.map((rows, i) => {
        return rows.map((item, j) => {
          return (
            <Tooltip title={Math.ceil(item)} arrow disableInteractive>
              <rect
                key={i * viewData.length + j}
                x={xScale(j)}
                y={yScale(i)}
                width={52}
                height={58}
                fill={colorScale(item)}
              />
            </Tooltip>
          );
        });
      })}
    </g>
  );
};

const Legends = memo(({ x, y, width, colorScale }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <linearGradient id="gradient">
        {[...Array(41)].map((_, idx) => {
          return (
            <stop
              key={idx}
              offset={`${(idx * 5) / 2}%`}
              stopColor={colorScale(100 - idx * 5)}
            />
          );
        })}
      </linearGradient>
      <rect width={width} height="50" fill="url('#gradient')" />
      <text
        dominantBaseline="text-after-edge"
        fontSize={30}
        y="100"
        style={{ userSelect: "none" }}
      >
        {`<---- その役になる`}
      </text>
      <text
        textAnchor="end"
        dominantBaseline="text-after-edge"
        fontSize={30}
        x={width}
        y="100"
        style={{ userSelect: "none" }}
      >
        {`その役にならない ---->`}
      </text>
    </g>
  );
});

// 転置
const transpose = (a) => {
  return a[0].map((_, c) => a.map((r) => r[c]));
};
