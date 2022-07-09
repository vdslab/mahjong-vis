import { useRecoilState, useRecoilValue } from 'recoil';
import { haiState,tehaiState,suteHaiListState } from './atoms';
import { useEffect } from 'react';
export default function TehaiView (){
  const [abandonedHai, setAbandonedHai] = useRecoilState(haiState);
  const [tehai, setTehai] = useRecoilState(tehaiState);
  const [suteHaiList, setSuteHaiList] = useRecoilState(suteHaiListState)
  const HAITYPE = "mpskz";
  useEffect(()=>{
    const haiList = [];
    // 手牌生成
 for(let i = 0; i < 15; i++){
   let hai = "";
   hai += HAITYPE[getRandomInt(0, HAITYPE.length-1)];
   if(["m","p","s"].includes(hai)){
   hai += getRandomInt(1,9);
 } else if(hai === "k"){
   hai += getRandomInt(1,4);
 } else {
   hai + getRandomInt(1,3);
 }
 haiList.push({hai:hai,id:i});
 }
 setTehai(haiList);
  },[]);


  function clickHandler(e) {
    const clickedHai = e.currentTarget.getAttribute("data-hai");
    const id = e.currentTarget.getAttribute("data-id");
    const copiedTehai = JSON.parse(JSON.stringify(tehai));
    setAbandonedHai(clickedHai);
    setSuteHaiList([...suteHaiList,clickedHai]);
    const new_hai= copiedTehai.filter((item) => item.id != id);
    console.log("id "+id);

    console.log(new_hai)
    setTehai(new_hai);
  }
if(tehai.length < 2) {
  
  return <div></div>
} 
  else {
  return (
    <div style={{border:"1px solid black",height:"100px"}}>
    <p>手牌</p>
    <ul style={{clear:"both"}}>
      {tehai.map(item => {
        return <li style={{float:"left",listStyle:"none",padding:"10px"}} data-id={item.id} data-hai={item.hai} onClick={clickHandler}>{item.hai}</li>
      }
      )
    }
    </ul>
    </div>
  )
  }
}

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }