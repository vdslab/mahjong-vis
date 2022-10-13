import Image from "next/image";
import Images from "../../public/images/webImage/webImage.png";
import { Card, CardContent, Typography } from "@mui/material";

export const WebInfo = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          ①河
          <br />
          手牌から捨てた牌を表示します。
          <br />
          <br />
          ➁Radviz
          <br />
          手牌が今どの役に近いかを示しています。
          <br />
          赤い点→現在の手牌14枚から考えられる点
          <br />
          緑の点→対応する牌を捨てた後に、どこに移動するかを予測した点
          <br />
          <br />
          ③評価値表
          <br />
          それぞれの牌を捨てた際にどのくらい左側の役に近づけるかをそれぞれ表示しています。
          <br />
          青色に近いほど役から遠ざかり、赤色に近いほど役に近づいていきます。
          <br />
          <br />
          ④手牌
          <br />
          現在持っている手牌を表示します。カーソルを合わせることで、Radvizにおける緑点の
          強調表示や、評価値表における牌の強調表示を行えます。
          <br />
          青い矢印→捨てることで、向聴数（リーチまであと何手手前か）が増える可能性があることを示しています。
          <br />
          赤い矢印→捨てることで、向聴数が減る可能性があることを示しています。
          <br />
          自摸モード→出現させる牌の種類を選択することができます。
          <br />
          ・すべての牌：全種類の牌が出現
          <br />
          ・混一色：1種類の牌と字牌のみが出現
          <br />
          ・清一色：1種類の牌のみが出現
          <br />
          ・国士無双：1,9牌と字牌のみが出現
          <br />
          リセット→手牌をリセットします。
          <br />
          ツモ（上がれる場合のみ）→揃った役を確認後、手牌をリセットします。
        </Typography>
      </CardContent>
      <Image src={Images} alt="Image" />
    </Card>
  );
};
