import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getHomeFeed } from "../../services/postService";

import type { Post } from "../../types/post";

import PostCard from "../../components/posts/PostCard";
import PostComposer from "../../components/posts/PostComposer";

import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";

import "./HomePage.css";

const PAGE_SIZE = 20;

export default function HomePage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);

  const [page, setPage] = useState(1);

  const [hasNextPage, setHasNextPage] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadInitialFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getHomeFeed(1, PAGE_SIZE);

      setPosts(result.items);
      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your feed.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialFeed();
  }, [loadInitialFeed]);

  async function handleLoadMore() {
    if (isLoadingMore || !hasNextPage) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);

      const nextPage = page + 1;

      const result = await getHomeFeed(nextPage, PAGE_SIZE);

      setPosts((currentPosts) => [...currentPosts, ...result.items]);

      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load more posts.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handlePostCreated(createdPost: Post) {
    setPosts((currentPosts) => [createdPost, ...currentPosts]);
  }

  function handlePostDeleted(postId: string) {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.postId !== postId),
    );
  }

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="home-page-loading">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-page-header">
        <div>
          <h1>Home</h1>

          <p>See what's happening with the people you follow.</p>
        </div>
      </header>

      <section className="home-page-composer">
        <PostComposer onCreated={handlePostCreated} />
      </section>

      {error && (
        <div className="home-page-error">
          <ErrorMessage message={error} />

          {posts.length === 0 && (
            <Button variant="secondary" size="sm" onClick={loadInitialFeed}>
              Try Again
            </Button>
          )}
        </div>
      )}

      {!error && posts.length === 0 && (
        <EmptyState
          title="Your feed is empty"
          description="Follow people to see their posts here, or create your first post."
        />
      )}

      {posts.length > 0 && (
        <section className="home-feed" aria-label="Home feed">
          {posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onOpen={() => navigate(`/posts/${post.postId}`)}
              onDeleted={handlePostDeleted}
            />
          ))}
        </section>
      )}

      {posts.length > 0 && hasNextPage && (
        <div className="home-feed-load-more">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className="home-feed-end">
          <span>You're all caught up.</span>
        </div>
      )}
    </div>
  );
}
