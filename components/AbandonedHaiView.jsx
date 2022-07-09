import {useRecoilValue } from 'recoil'
import { haiState,suteHaiListState } from './atoms'
export default function AbandonedHaiView (){
  const abandonedHai = useRecoilValue(haiState)
  const suteHaiList = useRecoilValue(suteHaiListState)
  console.log(suteHaiList)
  return <div style={{border:"1px solid black",width:"200px",height:"200px",float:"left"}}>
    <p>捨て牌</p>
    <ul style={{overflow:"hidden"}}>
      {
        suteHaiList.map(item => {
          return <li style={{float:"left",listStyle:"none",padding:"3px 10px",display:"block"}}>{item}</li>
      })
    }
    </ul>

    </div>
  }