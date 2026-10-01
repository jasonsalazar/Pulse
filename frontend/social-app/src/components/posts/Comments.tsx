import { type SubmitEvent, useEffect, useState } from "react";

import { Avatar, Button, Input, Spinner } from "../ui";

import { useAuth } from "../../context/AuthContext";

import {
  createComment,
  deleteComment,
  getPostComments,
} from "../../services/commentService";

import type { Comment } from "../../types/post";

import "./Comments.css";

interface CommentsProps {
  postId: string;
  onCountChanged?: (count: number) => void;
}

export default function Comments({ postId, onCountChanged }: CommentsProps) {
  const { user } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);

  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const result = await getPostComments(postId);

        setComments(result);

        onCountChanged?.(result.length);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load comments.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId, onCountChanged]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const comment = await createComment(postId, {
        content: trimmedContent,
      });

      setComments((current) => [...current, comment]);

      setContent("");

      onCountChanged?.(comments.length + 1);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create comment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);

      setComments((current) =>
        current.filter((comment) => comment.commentId !== commentId),
      );

      onCountChanged?.(Math.max(comments.length - 1, 0));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete comment.",
      );
    }
  };

  return (
    <div className="comments">
      {isLoading ? (
        <div className="comments-loading">
          <Spinner />
        </div>
      ) : (
        <>
          {comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.commentId} className="comment">
                  <Avatar
                    src={comment.profileImageUrl ?? undefined}
                    alt={comment.displayName}
                    size="sm"
                  />

                  <div className="comment-body">
                    <div className="comment-header">
                      <strong>{comment.displayName}</strong>

                      <span>@{comment.username}</span>
                    </div>

                    <p>{comment.content}</p>

                    {user?.userId === comment.userId && (
                      <button
                        type="button"
                        className="comment-delete"
                        onClick={() => handleDelete(comment.commentId)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="comments-error">{error}</p>}

          <form className="comment-form" onSubmit={handleSubmit}>
            <Input
              aria-label="Write a comment"
              placeholder="Write a comment..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={500}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
