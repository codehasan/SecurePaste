import { Comment as PrismaComment } from '@prisma/client';
import Comment from './Comment';

interface CommentListProps {
  parent: string | null;
  pasteId: string;
  comments: PrismaComment[];
  className?: string;
}

const CommentList = ({
  parent,
  comments,
  className,
  pasteId,
}: CommentListProps) => {
  const rootComments = comments.filter(
    (comment) => comment.parentId === parent
  );

  return (
    <div className={className}>
      {rootComments.map((comment, index) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            comments={comments}
            pasteId={pasteId}
          />
        );
      })}
    </div>
  );
};

export default CommentList;
