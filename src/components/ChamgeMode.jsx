import { memo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Typography from "@mui/material/Typography";
import { haiModeState, suteHaiListState, dimensionState } from "../atoms/atoms";
import { DIMENSIONS } from "../const/dimensions";

export const ChangeMode = memo(() => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("0");
  const [haiMode, setHaiMode] = useRecoilState(haiModeState);
  const suteHaiList = useRecoilValue(suteHaiListState);
  const setDimension = useSetRecoilState(dimensionState);

  const handleChange = async (num) => {
    if (suteHaiList.length !== 0) {
      await setSelected(num);
      setOpen(true);
    } else {
      setHaiMode(num);
      setDimension(DIMENSIONS[num]);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div">
        現在のモード
      </Typography>
      <FormControl variant="outlined">
        <NativeSelect
          value={haiMode}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value={0}>すべての牌</option>
          <option value={1}>混一色</option>
          <option value={2}>清一色</option>
          <option value={3}>タンヤオ</option>
          {/* <option value={4}>国士</option> */}
          <option value={5}>すべての牌(アンカー配置最適)</option>
        </NativeSelect>
      </FormControl>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          モードを切り替えると現在の手牌はリセットされます。よろしいですか？
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpen(false)}
          >
            いいえ
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log(selected);
              setOpen(false);
              setHaiMode(selected);
              setDimension(DIMENSIONS[selected]);
            }}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
