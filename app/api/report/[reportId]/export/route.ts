import { NextResponse } from "next/server"

// GET /api/report/[reportId]/export
// Stub: In future, generate server-side PDF export
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params

  return NextResponse.json(
    {
      message: "PDF export is currently handled via browser print. Server-side generation coming soon.",
      reportId,
      status: "stub",
    },
    { status: 501 }
  )
}
