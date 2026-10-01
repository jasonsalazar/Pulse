import { useState } from "react";

import { Avatar, Button, Card } from "../ui";

import Comments from "./Comments";

import { useAuth } from "../../context/AuthContext";

import { togglePostLike, deletePost } from "../../services/postService";

import type { Post } from "../../types/post";

import "./PostCard.css";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  onDeleted?: (postId: string) => void;
}

export default function PostCard({ post, onDeleted }: PostCardProps) {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);

  const [likeCount, setLikeCount] = useState(post.likeCount);

  const [commentCount, setCommentCount] = useState(post.commentCount);

  const [showComments, setShowComments] = useState(false);

  const [isLiking, setIsLiking] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.userId === post.userId;

  const handleLike = async () => {
    if (isLiking) {
      return;
    }

    try {
      setIsLiking(true);

      const result = await togglePostLike(post.postId);

      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Unable to update like.",
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deletePost(post.postId);

      onDeleted?.(post.postId);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Unable to delete the post.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleString();

  const id = post.userId === user?.userId ? "" : `/${post.userId}`;

  return (
    <Card className="post-card">
      <div className="post-header">
        <Link to={`/profile${id}`}>
          <Avatar
            src={post.profileImageUrl ?? undefined}
            alt={post.displayName}
            size="md"
          />
        </Link>

        <div className="post-author">
          <Link to={`/profile${id}`}>
            <strong>{post.displayName}</strong>
          </Link>

          <span>@{post.username}</span>

          <time dateTime={post.createdAt}>{formattedDate}</time>
        </div>

        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-actions">
        <button
          type="button"
          className={`post-action ${isLiked ? "post-action-liked" : ""}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          {isLiked ? "♥" : "♡"} {likeCount}
        </button>

        <button
          type="button"
          className="post-action"
          onClick={() => setShowComments((current) => !current)}
        >
          ○ {commentCount}
        </button>
      </div>

      {showComments && (
        <Comments postId={post.postId} onCountChanged={setCommentCount} />
      )}
    </Card>
  );
}
