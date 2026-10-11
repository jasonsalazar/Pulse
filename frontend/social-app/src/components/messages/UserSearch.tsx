import { useEffect, useState } from "react";

import { searchUsers } from "../../services/userService";
import type { UserSearchResult } from "../../types/user";

import { Avatar, Input, Spinner } from "../ui";

import "./UserSearch.css";

interface UserSearchProps {
  onSelectUser: (user: UserSearchResult) => Promise<void>;
}

export default function UserSearch({ onSelectUser }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [results, setResults] = useState<UserSearchResult[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const [isSelectingUser, setIsSelectingUser] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const value = searchTerm.trim();

    if (value.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setError(null);

        const users = await searchUsers(value);

        if (!cancelled) {
          setResults(users);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to search users.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  async function handleSelectUser(user: UserSearchResult) {
    if (isSelectingUser) {
      return;
    }

    try {
      setIsSelectingUser(true);
      setError(null);

      await onSelectUser(user);

      setSearchTerm("");
      setResults([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start conversation.",
      );
    } finally {
      setIsSelectingUser(false);
    }
  }

  const showResults = searchTerm.trim().length >= 2;

  return (
    <div className="user-search">
      <div className="user-search__input">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search people..."
          aria-label="Search people"
        />

        {isSearching && (
          <div className="user-search__spinner">
            <Spinner />
          </div>
        )}
      </div>

      {error && <div className="user-search__error">{error}</div>}

      {showResults && !isSearching && (
        <div className="user-search__results">
          {results.length === 0 ? (
            <div className="user-search__empty">No users found.</div>
          ) : (
            results.map((user) => (
              <button
                key={user.userId}
                type="button"
                className="user-search__result"
                onClick={() => handleSelectUser(user)}
                disabled={isSelectingUser}
              >
                <Avatar
                  src={user.profileImageUrl}
                  alt={user.displayName || user.username}
                  size="md"
                />

                <span className="user-search__user-info">
                  <strong>{user.displayName}</strong>

                  <span>@{user.username}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
