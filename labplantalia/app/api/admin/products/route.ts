import { NextRequest, NextResponse } from "next/server";
import { proxyAdminApi } from "@/lib/server/admin-api";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxyAdminApi(request, "/admin/products");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as unknown;
  return proxyAdminApi(request, "/admin/products", {
    method: "POST",
    body,
  });
}
