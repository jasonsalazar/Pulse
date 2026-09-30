import { type SubmitEvent, useState } from "react";

import { Button, Card, ErrorMessage } from "../ui";

import { createPost } from "../../services/postService";

import type { Post } from "../../types/post";

import "./PostComposer.css";

interface PostComposerProps {
  onCreated?: (post: Post) => void;
}

const MAX_LENGTH = 500;

export default function PostComposer({ onCreated }: PostComposerProps) {
  const [content, setContent] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    setError("");

    if (!trimmedContent) {
      setError("Post content cannot be empty.");
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      setError(`Posts cannot exceed ${MAX_LENGTH} characters.`);
      return;
    }

    try {
      setIsSubmitting(true);

      const post = await createPost({
        content: trimmedContent,
      });

      setContent("");

      onCreated?.(post);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create the post.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingCharacters = MAX_LENGTH - content.length;

  return (
    <Card className="post-composer">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="post-composer-error">
            <ErrorMessage message={error} />
          </div>
        )}

        <textarea
          className="post-composer-input"
          placeholder="What's on your mind?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={MAX_LENGTH}
          rows={4}
          disabled={isSubmitting}
        />

        <div className="post-composer-footer">
          <span
            className={
              remainingCharacters < 50
                ? "post-character-count-warning"
                : "post-character-count"
            }
          >
            {remainingCharacters}
          </span>

          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
