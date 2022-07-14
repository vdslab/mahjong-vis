import { RecoilRoot } from "recoil";
import { Main } from "../components/Main";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
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
