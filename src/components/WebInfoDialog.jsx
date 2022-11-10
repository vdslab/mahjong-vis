import { memo } from "react";
import Image from "next/image";
import Images from "../../public/images/webImage/webImage.png";
import {
  Box,
  Card,
  CardContent,
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
            役説明
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
  return (
    <>
      <Typography variant="h6">
        ①河
        <br />
        手牌から捨てた牌を表示します。
        <br />
        <br />
        ➁向聴数（しゃんてんすう）
        <br />
        聴牌（読み方：てんぱい、意味：上がる直前の状態）になるまでの数を表しています。
        <br />
        青い矢印→捨てることで、向聴数（リーチまであと何手手前か）が増えることを示しています。
        <br />
        緑の矢印→捨てても向聴数が変化しません。
        <br />
        赤い矢印→捨てることで、向聴数が減ることを示しています。
        <br />
        <br />
        ③Radviz
        <br />
        手牌が今どの役に近いかを示しています。
        <br />
        赤い点→現在の手牌14枚から考えられる点
        <br />
        緑の点→対応する牌を捨てた後に、どこに移動するかを予測した点
        <br />
        <br />
        ④評価値表
        <br />
        それぞれの牌を捨てた際にどのくらい左側の役に近づけるかをそれぞれ表示しています。
        <br />
        青色に近いほど役から遠ざかり、赤色に近いほど役に近づいていきます。
        <br />
        手牌から作りやすい役には、役の左に金・銀・銅の点がついています。
        <br />
        <br />
        ⑤手牌
        <br />
        現在持っている手牌を表示します。カーソルを合わせることで、Radvizにおける緑点の
        強調表示や、評価値表における牌の強調表示を行えます。
        <br />
        リセット→手牌をリセットします。
        <br />
        ツモ（上がれる場合のみ）→揃った役を確認後、手牌をリセットします。
        <br />
        <br />
        ⑥モード切替
        <br />
        出現させる牌の種類を選択することができます。
        <br />
        ・すべての牌：全種類の牌が出現
        <br />
        ・混一色：1種類の牌と字牌のみが出現
        <br />
        ・清一色：1種類の牌のみが出現
        <br />
        ・国士無双：1,9牌と字牌のみが出現
      </Typography>
      <Image src={Images} alt="Image" />
    </>
  );
};
