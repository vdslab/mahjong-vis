import { CssBaseline } from "@mui/material";
import { RecoilRoot } from "recoil";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <CssBaseline>
        <Component style={{ margin: 0 }} {...pageProps} />
      </CssBaseline>
    </RecoilRoot>
  );
};

export default MyApp;
