'use server';

import logger from '@/lib/logging/server';
import prisma from '../prisma/db';

export const getUserComments = async (id: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        userId: id,
      },
      orderBy: [
        {
          likes: {
            _count: 'desc',
          },
        },
        {
          createdAt: 'desc',
        },
      ],
      select: {
        message: true,
        createdAt: true,
        parent: {
          select: {
            message: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                verified: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
        paste: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                verified: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            verified: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    const set = new Set(comments.map((comment) => comment.parent));
  } catch (err) {
    logger.error(err);
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);
  }

  return null;
};
