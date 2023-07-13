"use client";
import Proposal from "@core/models/Proposal";
import { v4 as uuid } from "uuid";
import useKanban from "./hooks/useKanban";
import NewProposalModal from "./NewProposalModal";

const KanBanView = ({
  proposalsInitialState,
}: {
  proposalsInitialState: Proposal[];
}) => {
  const { proposals, stateList, handleDrop, addProposal, handleDragStart } =
    useKanban(proposalsInitialState);
  const KanBanCard = ({ proposal }: { proposal: Proposal }) => {
    return (
      <div
        draggable
        className="bg-white rounded py-2 px-4 border border-blue-200 hover:border-blue-500 hover:shadow-2xl"
        id={proposal.id!.toString()}
        onDragStart={handleDragStart}
      >
        <p>Client: {proposal.client.entity}</p>
        <p>Id: {proposal.id}</p>
        <p>Value: €{proposal.value}</p>
        <p>Contact: {proposal.defaultContact.name}</p>
        <p>Deadline: {proposal.endDate.toISOString().slice(0, 10)}</p>
      </div>
    );
  };

  const KanBanColumn = ({
    proposals,
    state,
  }: {
    proposals: Proposal[];
    state: string;
  }) => {
    const filteredProposals = proposals.filter(
      (proposal) => proposal.status == state
    );

    return (
      <div
        className="border border-blue-500 flex flex-col gap-2 p-2 m-2 rounded overflow-y-auto"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          handleDrop(e.dataTransfer.getData("text/plain"), state);
        }}
      >
        <h1 className="text-4xl">{state}</h1>
        {filteredProposals.map((proposal) => (
          <KanBanCard proposal={proposal} key={uuid()} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 flex gap-4">
        <NewProposalModal callback={addProposal} />
        <input className="border border-blue-500 rounded" />
      </div>
      <div className="grid grid-cols-4 h-screen">
        {stateList.map((state) => (
          <KanBanColumn key={uuid()} proposals={proposals} state={state} />
        ))}
      </div>
    </div>
  );
};

export default KanBanView;
