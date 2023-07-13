"use client";
import { useState } from "react";
import Contact from "../models/Contact";
import DeleteIcon from "../icons/DeleteIcons";
import { removeContact } from "@core/app/actions";

const ContactsTable = ({ initialData }: { initialData: Contact[] }) => {
  const [data, setData] = useState(initialData);
  const [searchItem, setSearchItem] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    message: "",
    id: 0,
  });

  const tdClass = "border border-gray-200 py-1 px-2";

  const matchSearch = (contact: Contact) => {
    if (
      contact.email.toLowerCase().includes(searchItem) ||
      contact.name.toLowerCase().includes(searchItem) ||
      contact.phone.toLowerCase().includes(searchItem)
    ) {
      return true;
    }

    return false;
  };

  const handleDelete = async (contact: Contact) => {
    setModalState({
      open: true,
      message: `Are you sure you want to delete this contact: ${contact.name}?`,
      id: contact.id!,
    });
  };

  return (
    <div className="w-full flex items-center flex-col">
      {modalState.open ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded py-5 px-10 flex flex-col">
            {modalState.message}
            <div className="flex justify-center mt-4">
              <form
                action={() => {
                  const success = removeContact(modalState.id);
                  if (!success) {
                    return alert("Something went wrong");
                  }

                  setData((prevData) =>
                    prevData.filter((contact) => contact.id != modalState.id)
                  );
                  setModalState((prevState) => ({ ...prevState, open: false }));
                }}
              >
                <button
                  className="bg-blue-500 rounded py-2 px-4 mr-4"
                  type="submit"
                >
                  Confirm
                </button>
              </form>

              <button
                className="bg-red-500 rounded py-2 px-4"
                onClick={() =>
                  setModalState((prevState) => ({ ...prevState, open: false }))
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="mb-2">
        <input
          className="border border-gray-300 focus:border-blue-500 hover:border-gray-200 mr-4 outline-none rounded"
          placeholder="search"
          onChange={(e) => setSearchItem(e.target.value.toLowerCase())}
        />
        <button className="rounded bg-blue-500 py-2 px-4">Add new</button>
      </div>

      <table>
        <thead>
          <tr>
            <td className={tdClass + " w-full"}>Name</td>
            <td className={tdClass}>Email</td>
            <td className={tdClass}>Phone</td>
          </tr>
        </thead>
        <tbody>
          {data.map((contact) => (
            <tr
              key={contact.email}
              style={{ display: matchSearch(contact) ? "" : "none" }}
            >
              <td className={tdClass}>{contact.name}</td>
              <td className={tdClass}>{contact.email}</td>
              <td className={tdClass}>{contact.phone}</td>
              <td>
                <button onClick={() => handleDelete(contact)}>
                  <DeleteIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTable;
