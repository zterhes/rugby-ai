import { NextResponse } from "next/server";
import { generateOpenApiDocument } from "@/lib/api/openapi";

export async function GET() {
  return NextResponse.json(generateOpenApiDocument());
}
