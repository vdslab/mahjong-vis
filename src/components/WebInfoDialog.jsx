import { Fragment, memo } from "react";
import Image from "next/image";
import Images from "../../public/images/webImage/webImage.png";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const WebInfoDialog = memo((props) => {
  const { open, onClose } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ display: "flex" }}>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            このサイトについて
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent id="alert-dialog-description">
        <Contents />
      </DialogContent>
    </Dialog>
  );
});

const Contents = () => {
  const text = [
    ["1.河", "手牌から捨てた牌を表示します。"],
    [
      "2.向聴数表示",
      "通常手、対子手、国士無双の向聴数を表示します。",
      "青矢印→捨てることで、向聴数（リーチまであと何手手前か）が増えることを示しています。",
      "黄緑矢印→捨てても向聴数が変化しません。",
      "赤矢印→捨てることで、向聴数が減ることを示しています。",
    ],
    [
      "3.Radviz",
      "手牌が今どの役に近いかを示しています。",
      "赤い点→現在の手牌13枚(ツモ牌を除く)から考えられる点",
      "緑の点→対応する牌を捨てた後に、どこに移動するかを予測した点",
    ],
    [
      "4.ヒートマップ",
      "それぞれの牌を捨てた際にどのくらい左側の役に近づけるかをそれぞれ表示しています。",
      "青色に近いほど役から遠ざかり、赤色に近いほど役に近づいていきます。",
    ],
    [
      "5.手牌",
      "現在持っている手牌を表示します。カーソルを合わせることで、Radvizにおける緑点の強調表示や、評価値表における牌の強調表示を行えます。",
      "青矢印→捨てることで、向聴数（リーチまであと何手手前か）が増えることを示しています。",
      "黄緑矢印→捨てても向聴数が変化しません。",
      "赤矢印→捨てることで、向聴数が減ることを示しています。",
      "リセット→手牌をリセットします。",
      "ツモ（アガれる場合のみ）→揃った役を確認後、手牌をリセットします。",
    ],
    [
      "6.分解ビュー",
      "左に表示されている牌を切ったときの、最小向聴数における分解の組み合わせを表示しています。",
      "組み合わせが複数ある場合もあり、全て向聴数は同一です",
    ],
    [
      "7.ツモモード",
      "出現させる牌の種類を選択することができます。",
      "・すべての牌:全種類の牌が出現",
      "・混一色:萬子と字牌のみの牌が出現",
      "・清一色:萬子のみの牌が出現",
      "・タンヤオ:19牌と字牌以外の牌が出現",
    ],
  ];

  return (
    <Box>
      {text.map((tmp) => {
        const title = tmp[0];
        const buf = tmp.slice(1);
        return (
          <Box key={title} sx={{ pb: 1 }}>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            {buf.map((description, i) => (
              <Typography
                key={`${buf}${i}`}
                gutterBottom
                variant="body1"
                color="text.secondary"
              >
                {description}
              </Typography>
            ))}
          </Box>
        );
      })}
      <Image src={Images} alt="Image" />
    </Box>
  );
};
