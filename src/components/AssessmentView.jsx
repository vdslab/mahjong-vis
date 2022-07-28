import { useRecoilValue } from "recoil";
import { tehaiState, yakuValueState } from "./atoms";
import { changeHaiName2Path } from "./TehaiView";
import Image from "next/image";
import { DIMENSIONS } from "../const/upper";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const list = {
  zikaze_bakaze: "自風場風",
  sangenhai: "三元牌",
  tanyao: "タンヤオ",
  pinfu: "平和",
  ipeko: "一盃口",
  sanshoku_dojun: "三色同順",
  sanshoku_doko: "三色同刻",
  sananko: "三暗刻",
  ittu: "一気通貫",
  chitoitu: "七対子",
  toitoiho: "対々和",
  chanta: "チャンタ",
  sankantu: "三槓子",
  shosangen: "小三元",
  honroto: "混老頭",
  ryanpeko: "二盃口",
  junchan: "純チャン",
  honitu: "混一色",
  chinitu: "清一色",
};

export const AssessmentView = () => {
  const tehai = useRecoilValue(tehaiState);
  const yakuValue = useRecoilValue(yakuValueState);
  const rows = DIMENSIONS.map((dim, _) => [
    list[dim],
    yakuValue.map((item, _) => item[dim]),
  ]);

  return (
    <TableContainer component={Card} sx={{ p: 1 }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>役\牌</TableCell>
            {tehai.map((item, idx) => {
              return (
                <TableCell key={idx} align="center" sx={{ p: 0 }}>
                  <Image
                    src={changeHaiName2Path(item)}
                    width="30%"
                    height="40%"
                  />
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row[0]}
              </TableCell>
              {row[1].map((a, b) => {
                return (
                  <TableCell key={b} align="center" sx={{ p: 0 }}>
                    {Math.ceil(a)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
