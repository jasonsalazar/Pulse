import { useState } from "react";

import { Avatar, Button, Card } from "../ui";
import { useAuth } from "../../context/AuthContext";

import { deletePost } from "../../services/postService";

import type { Post } from "../../types/post";

import "./PostCard.css";

interface PostCardProps {
  post: Post;
  onDeleted?: (postId: string) => void;
}

export default function PostCard({ post, onDeleted }: PostCardProps) {
  const { user } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.userId === post.userId;

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

  return (
    <Card className="post-card">
      <div className="post-header">
        <Avatar
          src={post.profileImageUrl ?? undefined}
          alt={post.displayName}
          size="md"
        />

        <div className="post-author">
          <strong>{post.displayName}</strong>

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
        <button type="button" disabled className="post-action">
          ♡ Like
        </button>

        <button type="button" disabled className="post-action">
          ○ Comment
        </button>
      </div>
    </Card>
  );
}
