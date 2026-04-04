import { NextRequest, NextResponse } from "next/server";
import { proxyAdminApi } from "@/lib/server/admin-api";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { orderId } = await context.params;
  return proxyAdminApi(
    request,
    `/admin/orders/${encodeURIComponent(orderId)}`,
  );
}
