import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyProfile } from "../../services/userService";

import type { UserProfile } from "../../types/user";

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const result = await getMyProfile();

      setProfile(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to load profile.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div>
      <h1>{profile.displayName}</h1>

      <p>@{profile.username}</p>

      {profile.profileImageUrl && (
        <img
          src={profile.profileImageUrl}
          alt={profile.displayName}
          width={150}
          height={150}
        />
      )}

      <p>{profile.bio}</p>

      <p>Member since {new Date(profile.createdAt).toLocaleDateString()}</p>

      <p>Email: {user?.email}</p>
    </div>
  );
}
