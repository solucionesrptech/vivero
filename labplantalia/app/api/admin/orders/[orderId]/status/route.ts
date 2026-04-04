import { NextRequest, NextResponse } from "next/server";
import { proxyAdminApi } from "@/lib/server/admin-api";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { orderId } = await context.params;
  const body = (await request.json()) as unknown;
  return proxyAdminApi(
    request,
    `/admin/orders/${encodeURIComponent(orderId)}/status`,
    {
      method: "PATCH",
      body,
    },
  );
}
