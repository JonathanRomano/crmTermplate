interface Contact {
    name: string,
    email: string,
    phone: string
}

interface Client {
    entity: string,
    type: 'Company' | 'City' | 'Shopping',
    contacts: Contact[]
}

export default Client