import {getPool} from "@/server/db";

export async function GET() {
  const answer = await getPool().query('SELECT NOW()')
  return Response.json({
    response: answer.rows[0].now
  })
}