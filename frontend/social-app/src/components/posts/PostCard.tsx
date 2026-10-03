import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { deletePost, togglePostLike } from "../../services/postService";
import type { Post } from "../../types/post";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Comments from "./Comments";

import "./PostCard.css";

interface PostCardProps {
  post: Post;
  onDeleted?: (postId: string) => void;
  onOpen?: () => void;
}

export default function PostCard({ post, onDeleted, onOpen }: PostCardProps) {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);

  const [likeCount, setLikeCount] = useState(post.likeCount);

  const [commentCount, setCommentCount] = useState(post.commentCount);

  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState("");

  const isOwner = user?.userId === post.userId;

  const handleLike = async () => {
    if (isLiking) {
      return;
    }

    try {
      setIsLiking(true);
      setError("");

      const result = await togglePostLike(post.postId);

      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update like.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await deletePost(post.postId);

      onDeleted?.(post.postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  return (
    <Card className="post-card">
      <div className="post-card__header">
        <Link
          to={
            post.userId === user?.userId
              ? "/profile"
              : `/profile/${post.userId}`
          }
          className="post-card__author"
          onClick={(event) => event.stopPropagation()}
        >
          <Avatar src={post.profileImageUrl} alt={post.displayName} size="md" />

          <div className="post-card__author-info">
            <strong>{post.displayName}</strong>
            <span>@{post.username}</span>
          </div>
        </Link>

        <time className="post-card__time" dateTime={post.createdAt}>
          {formatPostDate(post.createdAt)}
        </time>
      </div>

      {onOpen ? (
        <button
          type="button"
          className="post-card__content-button"
          onClick={handleOpen}
          aria-label="Open post"
        >
          <p className="post-card__content">{post.content}</p>
        </button>
      ) : (
        <p className="post-card__content">{post.content}</p>
      )}

      {error && <p className="post-card__error">{error}</p>}

      <div className="post-card__actions">
        <button
          type="button"
          className={`post-card__action ${
            isLiked ? "post-card__action--liked" : ""
          }`}
          onClick={handleLike}
          disabled={isLiking}
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          <span aria-hidden="true">{isLiked ? "♥" : "♡"}</span>

          <span>{likeCount}</span>
        </button>

        <button
          type="button"
          className="post-card__action"
          onClick={() => setShowComments((current) => !current)}
          aria-expanded={showComments}
        >
          <span aria-hidden="true">💬</span>
          <span>{commentCount}</span>
        </button>

        {isOwner && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>

      {showComments && (
        <div className="post-card__comments">
          <Comments postId={post.postId} onCountChanged={setCommentCount} />
        </div>
      )}
    </Card>
  );
}

function formatPostDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
