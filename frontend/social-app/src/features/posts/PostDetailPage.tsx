import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getPost } from "../../services/postService";
import type { Post } from "../../types/post";

import PostCard from "../../components/posts/PostCard";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Button from "../../components/ui/Button";

import "./PostDetailPage.css";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) {
      setError("Post not found.");
      setIsLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getPost(postId);

        setPost(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load this post.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handleDeleted = () => {
    navigate("/home");
  };

  if (isLoading) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-page__loading">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-page__header">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
        </div>

        <ErrorMessage message={error || "Post not found."} />

        <div className="post-detail-page__home-link">
          <Link to="/home">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-page__header">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <h1>Post</h1>
      </div>

      <section className="post-detail-page__content">
        <PostCard post={post} onDeleted={handleDeleted} />
      </section>
    </div>
  );
}
