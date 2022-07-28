import { useRecoilValue } from "recoil";
import { tehaiState, yakuValueState } from "./atoms";
import { changeHaiName2Path } from "./TehaiView";
import Image from "next/image";
import { DIMENSIONS } from "../const/upper";
import { YAKU_DESCRIPTION } from "../const/yakuDescription";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const AssessmentView = () => {
  const tehai = useRecoilValue(tehaiState);
  const yakuValue = useRecoilValue(yakuValueState);
  const rows = DIMENSIONS.map((dim, _) => [
    YAKU_DESCRIPTION[dim]["name"],
    yakuValue.map((item, _) => item[dim]),
  ]);

  return (
    <TableContainer
      component={Card}
      sx={{ p: 1, height: "100%", minHeight: "100%", overflowY: "scroll" }}
    >
      <Table>
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
