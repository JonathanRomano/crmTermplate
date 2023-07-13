import executeQuery from "@core/lib/db";
import NewProposalModal from "@core/components/NewProposalModal";
import KanBanView from "@core/components/KanBanView";
import Proposal from "@core/models/Proposal";

const getProposals = async () => {
  const proposals = await executeQuery({
    query: `
    SELECT
    proposals.id,
    JSON_OBJECT(
      'id', clients.id,
      'entity', clients.entity,
      'type', clients.type,
      'contacts', JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', contacts.id,
          'name', contacts.name,
          'email', contacts.email,
          'phone', contacts.phone
        )
      )
    ) AS client,
    JSON_OBJECT(
      'id', contacts.id,
      'name', contacts.name,
      'email', contacts.email,
      'phone', contacts.phone
    ) AS defaultContact,
    proposals.value,
    proposals.startDate,
    proposals.endDate,
    proposals.status
  FROM
    proposals
    JOIN clients ON proposals.client_id = clients.id
    JOIN contacts ON proposals.defaultContact_id = contacts.id
  GROUP BY
    proposals.id;
    `,
  });

  

  (proposals as any).map((proposal: any) => {
    proposal.client = JSON.parse(proposal.client);
    proposal.defaultContact = JSON.parse(proposal.defaultContact);

    console.log(proposal);
  }) 
  
  return proposals as Proposal[]
};

const NewProposal = async () => {
  const proposals = await getProposals();

  return (
    <div>
      <KanBanView proposalsInitialState={proposals}/>
    </div>
  );
};

export default NewProposal;
