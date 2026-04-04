import { NextRequest, NextResponse } from "next/server";
import { proxyAdminApi } from "@/lib/server/admin-api";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { productId } = await context.params;
  const body = (await request.json()) as unknown;
  return proxyAdminApi(
    request,
    `/admin/products/${encodeURIComponent(productId)}/stock`,
    {
      method: "PATCH",
      body,
    },
  );
}
