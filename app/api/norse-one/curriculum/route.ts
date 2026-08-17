import { NextRequest, NextResponse } from "next/server";

import {
  createCurriculum,
  searchCurriculum,
} from "@/lib/services/norse-one/curriculum/curriculum-service";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } =
      request.nextUrl;

    const result =
      await searchCurriculum({
        q: searchParams.get("q") ?? undefined,
        gradeLevelId:
          searchParams.get("gradeLevelId") ??
          undefined,
        courseId:
          searchParams.get("courseId") ??
          undefined,
        semesterId:
          searchParams.get("semesterId") ??
          undefined,
        page: searchParams.get("page"),
        pageSize:
          searchParams.get("pageSize"),
      });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to search curriculum.";

    const status =
      message.includes(
        "Authentication is required"
      )
        ? 401
        : 403;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const curriculum =
      await createCurriculum(body);

    return NextResponse.json(
      curriculum,
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create curriculum.";

    const status =
      message.includes(
        "Authentication is required"
      )
        ? 401
        : 403;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}