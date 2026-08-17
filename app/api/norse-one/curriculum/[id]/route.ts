import {
  archiveCurriculum,
  getCurriculumById,
  updateCurriculum,
} from "@/lib/services/norse-one/curriculum/curriculum-service";

import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const curriculum =
      await getCurriculumById(id);

    if (!curriculum) {
      return NextResponse.json(
        {
          error:
            "Curriculum record was not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(curriculum);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve curriculum.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 403,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const curriculum =
      await updateCurriculum({
        curriculumId: id,
        title: body.title,
        description: body.description,
        courseId: body.courseId,
        gradeLevelId: body.gradeLevelId,
        semesterId: body.semesterId,
        changeNote: body.changeNote,
      });

    return NextResponse.json(curriculum);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update curriculum.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 403,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    await archiveCurriculum(id);

    return NextResponse.json({
      success: true,
      message: "Curriculum archived.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to archive curriculum.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 403,
      }
    );
  }
}