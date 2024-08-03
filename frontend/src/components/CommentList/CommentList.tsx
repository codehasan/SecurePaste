import { CommentData } from '@/utils/services/paste';
import Comment from './Comment';

interface CommentListProps {
  comments: CommentData[];
  className?: string;
}

const CommentList = ({ comments, className }: CommentListProps) => {
  return (
    <div className={className}>
      {comments.map((comment) => {
        return <Comment key={comment.id} {...comment} />;
      })}
    </div>
  );
};

export default CommentList;
