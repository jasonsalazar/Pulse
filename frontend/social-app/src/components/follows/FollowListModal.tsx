import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFollowers, getFollowing } from "../../services/followService";

import type { UserFollow } from "../../types/user";

import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";

import "./FollowListModal.css";

interface FollowListModalProps {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

export default function FollowListModal({
  userId,
  type,
  onClose,
}: FollowListModalProps) {
  const [users, setUsers] = useState<UserFollow[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const title = type === "followers" ? "Followers" : "Following";

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result =
        type === "followers"
          ? await getFollowers(userId)
          : await getFollowing(userId);

      setUsers(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to load ${title.toLowerCase()}.`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, type, title]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="follow-modal-backdrop"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className="follow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-modal-title"
      >
        <div className="follow-modal-header">
          <h2 id="follow-modal-title">{title}</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </Button>
        </div>

        <div className="follow-modal-content">
          {isLoading && (
            <div className="follow-modal-loading">
              <Spinner />
            </div>
          )}

          {!isLoading && error && (
            <div className="follow-modal-error">
              <p>{error}</p>

              <Button variant="secondary" size="sm" onClick={loadUsers}>
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && users.length === 0 && (
            <div className="follow-modal-empty">
              <p>
                {type === "followers"
                  ? "No followers yet."
                  : "Not following anyone yet."}
              </p>
            </div>
          )}

          {!isLoading && !error && users.length > 0 && (
            <div className="follow-user-list">
              {users.map((followUser) => (
                <Link
                  key={followUser.userId}
                  to={`/profile/${followUser.userId}`}
                  className="follow-user-item"
                  onClick={onClose}
                >
                  <Avatar
                    src={followUser.profileImageUrl}
                    alt={followUser.displayName}
                    size="md"
                  />

                  <div className="follow-user-info">
                    <strong>{followUser.displayName}</strong>

                    <span>@{followUser.username}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
