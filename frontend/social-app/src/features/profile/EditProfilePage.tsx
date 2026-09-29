import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMyProfile, updateMyProfile } from "../../services/userService";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");

  const [bio, setBio] = useState("");

  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const profile = await getMyProfile();

      setDisplayName(profile.displayName);

      setBio(profile.bio);

      setProfileImageUrl(profile.profileImageUrl ?? "");
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      await updateMyProfile({
        displayName,
        bio,
        profileImageUrl: profileImageUrl.trim() || null,
      });

      navigate("/profile");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to update profile.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName">Display Name</label>

          <input
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>

          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={500}
            rows={5}
          />
        </div>

        <div>
          <label htmlFor="profileImageUrl">Profile Image URL</label>

          <input
            id="profileImageUrl"
            type="url"
            value={profileImageUrl}
            onChange={(event) => setProfileImageUrl(event.target.value)}
          />
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
