import KanBanView from "@core/components/KanBanView";
import { getProposals } from "../actions";

const NewProposal = async () => {
  const proposalsInitialState = await getProposals();
  
  return <div>
    <KanBanView proposalsInitialState={proposalsInitialState}/>
  </div>;
};

export default NewProposal;
