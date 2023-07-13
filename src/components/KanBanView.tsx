"use client";
import Proposal from "@core/models/Proposal";
import { v4 as uuid } from "uuid";
import { changeProposalStatus } from "@core/app/actions";
import { useState } from "react";
import NewProposalModal from "./NewProposalModal";

const KanBanCard = ({ proposal }: { proposal: Proposal }) => {
  return (
    <div
      draggable
      className="bg-white rounded py-2 px-4 border border-blue-200 hover:border-blue-500 hover:shadow-2xl"
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", proposal.id!.toString());
      }}
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
  handleDrop,
}: {
  proposals: Proposal[];
  state: string;
  handleDrop: (id: string, state: string) => void;
}) => {
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
      {proposals
        .filter((proposal) => proposal.status == state)
        .map((proposal) => (
          <KanBanCard proposal={proposal} key={uuid()} />
        ))}
    </div>
  );
};

export default function KanBanView({
  proposalsInitialState,
}: {
  proposalsInitialState: Proposal[];
}) {
  const [proposals, setProposals] = useState(proposalsInitialState);
  const stateList = ["created", "accepted", "rejected", "expired"];

  const handleDrop = async (id: string, state: string) => {
    const result = await changeProposalStatus(id, state);
    if (result!.success) {
      setProposals(
        proposals.map((proposal) =>
          proposal.id!.toString() == id
            ? { ...proposal, status: state }
            : proposal
        )
      );
    }
  };

  return (
    <div className="h-full">
      <div className="p-4 flex gap-4">
        <NewProposalModal
          callback={(Proposal) => {
            setProposals([...proposals, Proposal]);
          }}
        />
        <input className="border border-blue-500 rounded"/>
      </div>

      <div className="grid grid-cols-4 h-screen">
        {stateList.map((state) => (
          <KanBanColumn
            key={uuid()}
            proposals={proposals}
            state={state}
            handleDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
