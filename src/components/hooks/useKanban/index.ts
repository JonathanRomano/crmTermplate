import { changeProposalStatus } from "@core/app/actions";
import Proposal from "@core/models/Proposal";
import { useState } from "react";

const useKanban = (proposalsInitialState: Proposal[]) => {
    const [proposals, setProposals] = useState(proposalsInitialState);

    const stateList = ["created", "accepted", "rejected", "expired"];

    const addProposal = (proposal: Proposal) => {
        setProposals([...proposals, proposal]);
    }
    
    const handleDrop = async (id: string, status: string) => {
        const result = await changeProposalStatus(id, status);
        
        if (result!.success) {
            setProposals(
                proposals.map((proposal: Proposal) =>
                    proposal.id!.toString() == id
                    ? { ...proposal, status: status }
                    : proposal
                )
            )
        }
    }

    const handleDragStart = (e: any) => {
        e.dataTransfer.setData("text/plain", e.target.id);
    }

    /*(e) => {
        e.dataTransfer.setData("text/plain", proposal.id!.toString());
    */

    return {
        proposals,
        stateList,
        addProposal,
        handleDrop,
        handleDragStart
    }
};

export default useKanban;