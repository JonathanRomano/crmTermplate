"use server";
import executeQuery from "@core/lib/db";
import Client from "@core/models/Client";
import Proposal from "@core/models/Proposal";

export async function removeContact(id: number) {
  type Result = { error?: object };

  const result = (await executeQuery({
    query: `DELETE FROM contacts WHERE id=${id}`,
  })) as Result;

  if (result.error) {
    return false;
  }
  return true;
}

export async function saveProposal(proposal: {
  client: string;
  defaultContact: string;
  description: string;
  endDate: string;
  startDate: string;
  value: string;
}) {
  type Result = { success: boolean; message: string, insertedProposal?: Proposal };

  try {
    const queryResult = await executeQuery({
      query: `
        INSERT INTO proposals(client_id, defaultContact_id, description, endDate, startDate, value, status)
        VALUES (${proposal.client},${proposal.defaultContact},"${proposal.description}", "${proposal.endDate}", "${proposal.startDate}","${proposal.value}", "created")
      `,
    }) as { insertId: number };

    const [insertedProposal] = await executeQuery({
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
    WHERE
      proposals.id = ${queryResult.insertId}
    GROUP BY
      proposals.id;
        
      `
    }) as [any];

    insertedProposal.client = JSON.parse(insertedProposal.client);
    insertedProposal.defaultContact = JSON.parse(insertedProposal.defaultContact);

    const result: Result = { success: true, message: "Done!", insertedProposal: insertedProposal as Proposal };
    return result;
  } catch (error) {
    console.error(error);
    const result: Result = { success: false, message: "Something went wrong!" };
    return result;
  }
}

export async function changeProposalStatus(id: string, status: string) {
  type Result = { success: boolean; message: string };

  try {
    const x = await executeQuery({
      query: `
        UPDATE proposals
        SET status = "${status}"
        WHERE id = ${id}
      `,
    });

    const result: Result = { success: true, message: "Done!" };
    return result;
  } catch (error) {
    console.error(error);
    const result: Result = { success: false, message: "Something went wrong!" };
  }
}

export async function getClientList() {
  const [{ clients }]: any = await executeQuery({
    query: `
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', c.id,
                'entity', c.entity,
                'type', c.type,
                'contacts', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('id', co.id, 'name', co.name, 'email', co.email, 'phone', co.phone)
                    )
                    FROM clients_contacts cc
                    INNER JOIN contacts co ON cc.contact_id = co.id
                    WHERE cc.client_id = c.id
                )
            )
        ) as clients
        FROM clients c;`,
  });

  return JSON.parse(clients) as Client[];
};

export async function getProposals() {
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
  }) 
  
  return proposals as Proposal[]
};
