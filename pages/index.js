import { RecoilRoot } from "recoil";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <RecoilRoot>
      <div className="container">
        <Header />
        <Main />
        <Footer />
      </div>
    </RecoilRoot>
  );
}
