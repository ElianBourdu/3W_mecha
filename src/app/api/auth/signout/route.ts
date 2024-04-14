import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function GET() {
  cookies().delete('mechaToken')
  return NextResponse.json({data: null}, {status: 200})
}
