import executeQuery from "@core/lib/db";

import ContactsTable from "@core/components/ContactsTable";

import type Contact from "@core/models/Contact";

const getData = async () => {
  const data = (await executeQuery({
    query: `
      SELECT * FROM contacts;
    `,
  })) as Contact[];

  return data;
};

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <ContactsTable initialData={data} />

    </main>
  );
}
