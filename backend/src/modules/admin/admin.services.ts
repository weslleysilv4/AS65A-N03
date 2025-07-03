import { Prisma } from "@prisma/client";
import prisma from "../../shared/lib/prisma";
import { InternalServerError } from "../../shared/errors/InternalServerError";
import { NotFoundError } from "../../shared/errors/NotFoundError";

/**
 * Retrieves all pending changes in the system for admin review.
 *
 * @returns {Promise<Object[]>} Returns the list of pending changes
 * @throws {NotFoundError} Throws an error if no pending changes are found
 *
 * @example
 * ```typescript
 * const pendingChanges = await getPendingChanges();
 * ```
 */
export const getPendingChanges = async () => {
  const pendingChanges = await prisma.pendingChange.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      news: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!pendingChanges || pendingChanges.length === 0) {
    throw new NotFoundError('pendingChanges');
  }

  return pendingChanges;
};
