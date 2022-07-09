import { atom } from 'recoil'
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();
export const haiState = atom({
  key: 'abandonedHai',
  default:"hoge",
})
export const tehaiState = atom({
  key:"tehai",
  default:[{hai:"",id:0}],
  // effects_UNSTABLE: [persistAtom]
});
export const suteHaiListState = atom({
  key:"sutehaiList",
  default:[],
  // effects_UNSTABLE: [persistAtom]
});