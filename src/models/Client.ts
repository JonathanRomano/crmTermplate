import Contact from "./Contact"

interface Client {
    id?: number | string,
    entity: string,
    type: 'Company' | 'City' | 'Shopping',
    contacts: Contact[]
}

export default Client
