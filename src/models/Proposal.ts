import Client from './Client'

interface Proposal {
    client: Client,
    value: number,
    startDate: Date,
    closingDate: Date,
    state: string
}

export default Proposal