"use client";

import { useEffect, useState } from "react";
import Client from "../models/Client";
import { v4 as uuid } from "uuid";
import { saveProposal, getClientList } from "@core/app/actions";
import Proposal from "@core/models/Proposal";

const NewProposalModal = ({
  callback,
}: {
  callback?: (proposal: Proposal) => void;
}) => {
  const initialFormData = {
    client: "0",
    defaultContact: "0",
    value: "€: 0.00",
    startDate: "",
    endDate: "",
    description: "",
  };

  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    getClientList().then((result) => {
      setClients(result);
    });
  }, []);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name == "value") {
      var sanitizedValue = value.replace(/\D/g, "");

      const decimal = Number(sanitizedValue) / 100;

      const formattedValue = "€: " + decimal.toFixed(2);

      return setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    }

    return setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    setDisabled(true);

    const formattedProposal = {
      ...formData,
      value: (parseFloat(formData.value.replace(/\D/g, "")) / 100).toFixed(2),
    };

    if (formattedProposal.client == "0") {
      return alert("you need to select a client");
    } else if (formattedProposal.defaultContact == "0") {
      return alert("you need to provide a default contact for this proposal");
    } else if (formattedProposal.value == "0") {
      return alert("you need to provide a value for this proposal");
    }

    saveProposal(formattedProposal).then((result) => {
      if (result?.success) {
        setOpen(false);
        setFormData(initialFormData);

        if (callback) {
          callback(result.insertedProposal!);
        }

        return;
      }

      return alert("Something when wrong");
    });

    setDisabled(false);
  };

  if (open) {
    return (
      <div>
        <div
          onClick={() => setOpen(false)}
          className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
        >
          <form
            onClick={(e) => {
              e.stopPropagation();
            }}
            action={handleSave}
            className="flex justify-between flex-col gap-1 bg-white p-4 rounded relative w-1/2"
          >
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="absolute -top-2 -right-2 bg-red-600 rounded-full px-2 font-bold text-white"
            >
              x
            </button>
            <p>NEW PROPOSAL</p>
            <select
              name="client"
              onChange={handleInputChange}
              value={formData.client}
              className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500"
            >
              <option value={0} className="hidden">
                Select a Client
              </option>
              {clients.map((client) => (
                <option key={uuid()} value={client.id}>
                  {client.entity}
                </option>
              ))}
            </select>
            <select
              name="defaultContact"
              onChange={handleInputChange}
              value={formData.defaultContact}
              className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500"
            >
              <option value={0} className="hidden">
                Select a default contact
              </option>
              {clients
                .find((client) => client.id == formData.client)
                ?.contacts?.map((contact) => (
                  <option key={uuid()} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                required
                name="value"
                placeholder="Value"
                value={formData.value}
                onChange={handleInputChange}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 w-full"
              />
            </div>
            <div className="flex justify-between px-2 gap-10">
              <div className="flex w-full gap-3 whitespace-nowrap items-center">
                Start date:{" "}
                <input
                  required
                  name="startDate"
                  type="date"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 w-full"
                />
              </div>
              <div className="flex w-full gap-3 whitespace-nowrap items-center">
                Closing date:{" "}
                <input
                  required
                  name="endDate"
                  type="date"
                  placeholder="Closing Date"
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={handleInputChange}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 w-full"
                />
              </div>
            </div>
            <textarea
              name="description"
              placeholder="Description"
              className="appearance-none bg-gray-50 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 w-full resize-none"
              value={formData.description}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="appearance-none rounded-md bg-blue-400 hover:bg-blue-500 py-2 px-4 disabled:bg-blue-300 text-white font-bold"
              disabled={disabled}
            >
              Save
            </button>
          </form>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 rounded py-2 px-4 text-white"
        >
          New Proposal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="bg-blue-500 rounded py-2 px-4 text-white"
    >
      New Proposal
    </button>
  );
};

export default NewProposalModal;
