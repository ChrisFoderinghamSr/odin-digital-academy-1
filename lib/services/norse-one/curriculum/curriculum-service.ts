import { prisma } from "@/lib/database/prisma";
import { requirePermission } from "@/lib/auth/authorization";
import { normalizePagination } from "@/lib/database/query-types";

export interface CurriculumSearchInput {
  q?: string;
  gradeLevelId?: string;
  courseId?: string;
  semesterId?: string;
  page?: string | null;
  pageSize?: string | null;
}

export interface CreateCurriculumInput {
  title: string;
  description?: string;
  courseId: string;
  gradeLevelId: string;
  semesterId: string;
}

export interface UpdateCurriculumInput {
  curriculumId: string;
  title: string;
  description?: string;
  courseId: string;
  gradeLevelId: string;
  semesterId: string;
  changeNote?: string;
}

export async function searchCurriculum(
  input: CurriculumSearchInput
) {
  await requirePermission("SEARCH_CURRICULUM");

  const { page, pageSize } = normalizePagination(
    input.page,
    input.pageSize
  );

  const skip = (page - 1) * pageSize;

  const where = {
    ...(input.q
      ? {
          OR: [
            {
              title: {
                contains: input.q,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: input.q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(input.gradeLevelId
      ? {
          gradeLevelId: input.gradeLevelId,
        }
      : {}),
    ...(input.courseId
      ? {
          courseId: input.courseId,
        }
      : {}),
    ...(input.semesterId
      ? {
          semesterId: input.semesterId,
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.curriculum.findMany({
      where,
      include: {
        gradeLevel: true,
        course: {
          include: {
            subject: true,
          },
        },
        semester: {
          include: {
            academicYear: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
      skip,
      take: pageSize,
    }),

    prisma.curriculum.count({
      where,
    }),
  ]);

  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getCurriculumById(
  curriculumId: string
) {
  await requirePermission("VIEW_CURRICULUM");

  return prisma.curriculum.findUnique({
    where: {
      id: curriculumId,
    },
    include: {
      gradeLevel: true,
      course: {
        include: {
          subject: true,
        },
      },
      semester: {
        include: {
          academicYear: true,
        },
      },
      units: {
        orderBy: {
          sequence: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              sequence: "asc",
            },
          },
        },
      },
    },
  });
}

export async function createCurriculum(
  input: CreateCurriculumInput
) {
  const session =
    await requirePermission("CREATE_CURRICULUM");

  const title = input.title.trim();

  if (!title) {
    throw new Error("Curriculum title is required.");
  }

  return prisma.curriculum.create({
    data: {
      title,
      description:
        input.description?.trim() || null,
      courseId: input.courseId,
      gradeLevelId: input.gradeLevelId,
      semesterId: input.semesterId,
      published: false,

      revisions: {
        create: {
          version: 1,
          snapshot: {
            title,
            description:
              input.description?.trim() || null,
            courseId: input.courseId,
            gradeLevelId: input.gradeLevelId,
            semesterId: input.semesterId,
          },
          changeNote:
            "Initial curriculum creation",
          createdById: session.user.id,
        },
      },
    },
  });
}

export async function updateCurriculum(
  input: UpdateCurriculumInput
) {
  const session =
    await requirePermission("EDIT_CURRICULUM");

  const existing =
    await prisma.curriculum.findUnique({
      where: {
        id: input.curriculumId,
      },
      include: {
        revisions: {
          orderBy: {
            version: "desc",
          },
          take: 1,
        },
      },
    });

  if (!existing) {
    throw new Error(
      "Curriculum record was not found."
    );
  }

  const nextVersion =
    (existing.revisions[0]?.version ?? 0) + 1;

  const title = input.title.trim();

  if (!title) {
    throw new Error(
      "Curriculum title is required."
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.curriculum.update({
      where: {
        id: input.curriculumId,
      },
      data: {
        title,
        description:
          input.description?.trim() || null,
        courseId: input.courseId,
        gradeLevelId: input.gradeLevelId,
        semesterId: input.semesterId,
      },
    });

    await tx.curriculumRevision.create({
      data: {
        version: nextVersion,
        snapshot: {
          title,
          description:
            input.description?.trim() || null,
          courseId: input.courseId,
          gradeLevelId: input.gradeLevelId,
          semesterId: input.semesterId,
        },
        changeNote:
          input.changeNote?.trim() ||
          `Curriculum updated to version ${nextVersion}`,
        createdById: session.user.id,
        curriculumId: updated.id,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        resource: "CURRICULUM",
        resourceId: updated.id,
        metadata: {
          version: nextVersion,
        },
      },
    });

    return updated;
  });
}

export async function publishCurriculum(
  curriculumId: string
) {
  const session =
    await requirePermission("PUBLISH_CURRICULUM");

  const existing =
    await prisma.curriculum.findUnique({
      where: {
        id: curriculumId,
      },
    });

  if (!existing) {
    throw new Error(
      "Curriculum record was not found."
    );
  }

  const updated =
    await prisma.curriculum.update({
      where: {
        id: curriculumId,
      },
      data: {
        published: true,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "PUBLISH",
      resource: "CURRICULUM",
      resourceId: curriculumId,
    },
  });

  return updated;
}

export async function archiveCurriculum(
  curriculumId: string
) {
  const session =
    await requirePermission("ARCHIVE_CURRICULUM");

  const existing =
    await prisma.curriculum.findUnique({
      where: {
        id: curriculumId,
      },
    });

  if (!existing) {
    throw new Error(
      "Curriculum record was not found."
    );
  }

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "ARCHIVE",
      resource: "CURRICULUM",
      resourceId: curriculumId,
    },
  });

  return prisma.curriculum.update({
    where: {
      id: curriculumId,
    },
    data: {
      published: false,
    },
  });
}