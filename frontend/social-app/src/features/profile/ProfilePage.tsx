import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getMyProfile, getUserProfile } from "../../services/userService";
import { followUser, unfollowUser } from "../../services/followService";

import type { UserProfile } from "../../types/user";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

import "./ProfilePage.css";
import { FollowListModal } from "../../components/follows";

export default function ProfilePage() {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [followListType, setFollowListType] = useState<
    "followers" | "following" | null
  >(null);

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

  if (isLoading) {
    return (
      <div className="profile-page-loading">
        <Spinner />
      </div>
    );
  }

  if (error) {
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
                <Link to="/profile/edit">
                  <Button variant="secondary">Edit Profile</Button>
                </Link>
              ) : (
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
