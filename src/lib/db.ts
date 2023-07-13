import mysql from 'serverless-mysql'

interface ExecuteQueryArgs {
    query: string;
  }

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: 'utc'
  }
})

export default async function executeQuery({ query } : ExecuteQueryArgs){
  try {
    const results = await db.query(query)
    await db.end()

    return results
  } catch (error) {
    return { error }
  }
}
