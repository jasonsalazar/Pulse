import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getMyProfile, getUserProfile } from "../../services/userService";
import { followUser, unfollowUser } from "../../services/followService";

import type { UserProfile } from "../../types/user";

import {
  Avatar,
  Button,
  Card,
  ErrorMessage,
  Spinner,
} from "../../components/ui";

import "./ProfilePage.css";
import { FollowListModal } from "../../components/follows";
import { useMessaging } from "../../context/MessagingContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { startConversation } = useMessaging();
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [followListType, setFollowListType] = useState<
    "followers" | "following" | null
  >(null);

  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const isOwnProfile = !userId || userId === user?.userId;

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const result = isOwnProfile
          ? await getMyProfile()
          : await getUserProfile(userId!);

        setProfile(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load profile.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [userId, isOwnProfile]);

  async function handleFollowToggle() {
    if (!profile || isFollowLoading) {
      return;
    }

    try {
      setIsFollowLoading(true);

      const result = profile.isFollowing
        ? await unfollowUser(profile.userId)
        : await followUser(profile.userId);

      setProfile((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          isFollowing: result.isFollowing,
          followerCount: result.followerCount,
          followingCount: result.followingCount,
        };
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update follow status.",
      );
    } finally {
      setIsFollowLoading(false);
    }
  }

  async function handleMessage() {
    if (!profile || isMessageLoading) {
      return;
    }

    try {
      setIsMessageLoading(true);
      setError(null);

      const conversation = await startConversation(profile.userId);

      navigate(`/messages?conversation=${conversation.conversationId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start conversation.",
      );
    } finally {
      setIsMessageLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="profile-page-loading">
        <Spinner />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <Card>
          <p>Profile not found.</p>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar
            src={profile.profileImageUrl}
            alt={profile.displayName}
            size="xl"
          />

          <div className="profile-header-content">
            <div className="profile-title-row">
              <div>
                <h1>{profile.displayName}</h1>

                <p className="profile-username">@{profile.username}</p>
              </div>

              {isOwnProfile ? (
                <div className="profile-actions">
                  <Link to="/profile/edit">
                    <Button variant="secondary">Edit Profile</Button>
                  </Link>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="profile-actions">
                  <Button
                    variant={profile.isFollowing ? "secondary" : "primary"}
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                  >
                    {isFollowLoading
                      ? "Loading..."
                      : profile.isFollowing
                        ? "Following"
                        : "Follow"}
                  </Button>
                  <Button onClick={handleMessage} disabled={isMessageLoading}>
                    {isMessageLoading ? "Opening..." : "Message"}
                  </Button>
                </div>
              )}
            </div>

            {profile.bio && <p className="profile-bio">{profile.bio}</p>}

            <div className="profile-stats">
              <button
                type="button"
                className="profile-stat"
                onClick={() => setFollowListType("followers")}
              >
                <strong>{profile.followerCount}</strong>

                <span>Followers</span>
              </button>

              <button
                type="button"
                className="profile-stat"
                onClick={() => setFollowListType("following")}
              >
                <strong>{profile.followingCount}</strong>

                <span>Following</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {followListType && (
        <FollowListModal
          userId={profile.userId}
          type={followListType}
          onClose={() => setFollowListType(null)}
        />
      )}
    </div>
  );
}
