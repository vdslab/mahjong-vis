import AbondonedHaiView from "./AbandonedHaiView";
import AssessmentView from "./AssessmentView";
import RadvizChart from "./RadvizChart";
import TehaiView from "./TehaiView";

export default function Main (){
  return (<div>
    <AbondonedHaiView />
    <RadvizChart />
    <AssessmentView />
    <TehaiView />
  </div>)
  }