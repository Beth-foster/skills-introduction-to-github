import { NextResponse } from "next/server"

// GET /api/report/[reportId]
// Stub: In future, retrieve report from database
// Currently reports are stored in localStorage on the client
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params

  return NextResponse.json(
    {
      message: "Report retrieval not yet implemented. Reports are currently stored client-side.",
      reportId,
      status: "stub",
    },
    { status: 501 }
  )
}
