import {useRecoilValue } from 'recoil'
import { haiState,suteHaiListState } from './atoms'
export default function AbandonedHaiView (){
  const abandonedHai = useRecoilValue(haiState)
  const suteHaiList = useRecoilValue(suteHaiListState)
  console.log(suteHaiList)
  return <div style={{border:"1px solid black",height:"100px"}}>
    <p>捨て牌</p>
    <ul style={{clear:"both"}}>
      {
        suteHaiList.map(item => {
          return <li style={{float:"left",listStyle:"none",padding:"10px",display:"block"}}>{item}</li>
      })
    }
    </ul>

    </div>
  }