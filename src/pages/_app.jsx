import { CssBaseline } from "@mui/material";
import { RecoilRoot } from "recoil";
import { DefaultSeo } from "next-seo";
import { SEO } from "../../next-seo.config";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  return (
    <RecoilRoot>
      <DefaultSeo {...SEO} />
      <CssBaseline>
        <Component style={{ margin: 0 }} {...pageProps} />
      </CssBaseline>
    </RecoilRoot>
  );
};

export default MyApp;
