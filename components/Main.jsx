import AbondonedHaiView from "./AbandonedHaiView";
import AssessmentView from "./AssessmentView";
import RadvizChart from "./RadvizChart";
import TehaiView from "./TehaiView";

export default function Main (){
  return (<div style={{overflow:"hidden"}}>
    <div style={{overflow:"hidden",float:"left"}}>
    <AbondonedHaiView />
    <RadvizChart />
    <AssessmentView />
    </div>
    <TehaiView />
  </div>)
  }