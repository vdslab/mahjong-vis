import { RecoilRoot } from "recoil";
import "../../styles/global.css";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <Component style={{ margin: 0 }} {...pageProps} />
    </RecoilRoot>
  );
};

export default MyApp;
