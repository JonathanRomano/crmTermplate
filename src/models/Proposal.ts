import Client from './Client'
import Contact from './Contact'

interface Proposal {
    id?: number,
    client: Client,
    defaultContact: Contact,
    value: number,
    startDate: Date,
    endDate: Date,
    status: string
}

export default Proposal