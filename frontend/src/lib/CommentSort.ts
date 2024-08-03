import { CommentData } from '@/utils/services/paste';

/**
 * Sort the given comments array based on the following rules.
 * 1. Most liked comments will be on top.
 * 2. Comments with same likes will be sorted based on creation date.
 *
 * Verified comments will get highest priority. So, they will always come before non-verified comments and be sorted same way like non-verified comments.
 */
export const sort = (array: CommentData[], config?: { userId: string }) => {
  const own = [];
  const verified = [];
  const others = [];

  for (let comment of array) {
    if (config && comment.user.id === config.userId) {
      own.push(comment);
    } else if (comment.user.verified) {
      verified.push(comment);
    } else {
      others.push(comment);
    }
  }

  own.sort(compareFunction);
  verified.sort(compareFunction);
  others.sort(compareFunction);

  return [...own, ...verified, ...others];
};

const compareFunction = (a: CommentData, b: CommentData) => {
  // Sort by date if likes are same
  if (a._count.likes === b._count.likes) {
    return b.createdAt.getTime() - a.createdAt.getTime();
  }
  return b._count.likes - a._count.likes;
};
