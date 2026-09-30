import { useCallback, useEffect, useState } from "react";

import { EmptyState, ErrorMessage, Spinner } from "../../components/ui";

import { PostCard, PostComposer } from "../../components/posts";

import { getRecentPosts } from "../../services/postService";

import type { Post } from "../../types/post";

import "./PostsPage.css";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await getRecentPosts(20);

      setPosts(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load posts.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePostCreated = (post: Post) => {
    setPosts((currentPosts) => [post, ...currentPosts]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.postId !== postId),
    );
  };

  return (
    <div className="posts-page">
      <header className="posts-page-header">
        <div>
          <h1>Home</h1>

          <p>See what's happening on Pulse.</p>
        </div>
      </header>

      <PostComposer onCreated={handlePostCreated} />

      <section className="posts-feed">
        {isLoading ? (
          <div className="posts-loading">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Be the first person to share something."
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onDeleted={handlePostDeleted}
            />
          ))
        )}
      </section>
    </div>
  );
}
