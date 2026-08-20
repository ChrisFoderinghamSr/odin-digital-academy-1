import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { prisma } from "@/lib/database/prisma";

import {
  getStudentSubmission,
  saveStudentSubmission,
} from "@/lib/services/norse-one/submission/submission-service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface SubmissionRequest {
  responseText?: unknown;
  action?: unknown;
}

async function getAuthenticatedStudentId() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const student =
    await prisma.studentProfile.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        id: true,
      },
    });

  return student?.id ?? null;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const studentId =
      await getAuthenticatedStudentId();

    if (!studentId) {
      return NextResponse.json(
        {
          error:
            "Authenticated student record could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const { id: assignmentId } =
      await context.params;

    const result =
      await getStudentSubmission(
        studentId,
        assignmentId
      );

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Assignment was not found or is not assigned to this student.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to retrieve submission.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const studentId =
      await getAuthenticatedStudentId();

    if (!studentId) {
      return NextResponse.json(
        {
          error:
            "Authenticated student record could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const { id: assignmentId } =
      await context.params;

    let body: SubmissionRequest;

    try {
      body =
        (await request.json()) as SubmissionRequest;
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.responseText !==
      "string"
    ) {
      return NextResponse.json(
        {
          error:
            "responseText must be a string.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      body.action !== "SAVE_DRAFT" &&
      body.action !== "SUBMIT"
    ) {
      return NextResponse.json(
        {
          error:
            "action must be SAVE_DRAFT or SUBMIT.",
        },
        {
          status: 400,
        }
      );
    }

    const submission =
      await saveStudentSubmission({
        studentId,
        assignmentId,
        responseText:
          body.responseText,
        action: body.action,
      });

    return NextResponse.json(
      {
        success: true,
        submission,
      },
      {
        status:
          body.action === "SUBMIT"
            ? 201
            : 200,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save submission.";

    const status =
      message.includes(
        "not assigned"
      ) ||
      message.includes(
        "not available"
      )
        ? 404
        : message.includes(
            "already been submitted"
          ) ||
          message.includes(
            "cannot be modified"
          )
        ? 409
        : message.includes(
            "required before submitting"
          )
        ? 400
        : 500;

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