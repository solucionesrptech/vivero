import { NextRequest, NextResponse } from "next/server";
import { proxyAdminApi } from "@/lib/server/admin-api";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxyAdminApi(request, "/analytics/top-products");
}
