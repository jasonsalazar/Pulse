import { type SubmitEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyProfile, updateMyProfile } from "../../services/userService";

import type { UpdateProfileRequest, UserProfile } from "../../types/user";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

import "./EditProfilePage.css";

const MAX_BIO_LENGTH = 500;
const MAX_DISPLAY_NAME_LENGTH = 100;
const MAX_PROFILE_IMAGE_URL_LENGTH = 500;

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [displayName, setDisplayName] = useState("");

  const [bio, setBio] = useState("");

  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getMyProfile();

        setProfile(result);
        setDisplayName(result.displayName);
        setBio(result.bio);
        setProfileImageUrl(result.profileImageUrl ?? "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your profile.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccessMessage(null);

    const trimmedDisplayName = displayName.trim();

    const trimmedBio = bio.trim();

    const trimmedProfileImageUrl = profileImageUrl.trim();

    if (!trimmedDisplayName) {
      setError("Display name is required.");
      return;
    }

    if (trimmedDisplayName.length > MAX_DISPLAY_NAME_LENGTH) {
      setError(
        `Display name cannot exceed ${MAX_DISPLAY_NAME_LENGTH} characters.`,
      );
      return;
    }

    if (trimmedBio.length > MAX_BIO_LENGTH) {
      setError(`Bio cannot exceed ${MAX_BIO_LENGTH} characters.`);
      return;
    }

    if (trimmedProfileImageUrl.length > MAX_PROFILE_IMAGE_URL_LENGTH) {
      setError(
        `Profile image URL cannot exceed ${MAX_PROFILE_IMAGE_URL_LENGTH} characters.`,
      );
      return;
    }

    const request: UpdateProfileRequest = {
      displayName: trimmedDisplayName,
      bio: trimmedBio,
      profileImageUrl: trimmedProfileImageUrl || null,
    };

    try {
      setIsSaving(true);

      const updatedProfile = await updateMyProfile(request);

      setProfile(updatedProfile);
      setDisplayName(updatedProfile.displayName);
      setBio(updatedProfile.bio);
      setProfileImageUrl(updatedProfile.profileImageUrl ?? "");

      setSuccessMessage("Your profile has been updated.");

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="edit-profile-loading">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="edit-profile-page">
        <ErrorMessage message={error ?? "Unable to load your profile."} />
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <div>
          <h1>Edit Profile</h1>

          <p>Update your profile information.</p>
        </div>
      </div>

      <Card className="edit-profile-card">
        <form onSubmit={handleSubmit}>
          <div className="edit-profile-avatar-section">
            <Avatar
              src={profileImageUrl.trim() || profile.profileImageUrl}
              alt={displayName}
              size="xl"
            />

            <div>
              <h2>Profile Picture</h2>

              <p>Enter an image URL below to update your profile picture.</p>
            </div>
          </div>

          {error && (
            <div className="edit-profile-message">
              <ErrorMessage message={error} />
            </div>
          )}

          {successMessage && (
            <div className="edit-profile-success">{successMessage}</div>
          )}

          <div className="edit-profile-form">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={MAX_DISPLAY_NAME_LENGTH}
              placeholder="Your display name"
              required
            />

            <div className="edit-profile-readonly-field">
              <label>Username</label>

              <div className="readonly-value">@{profile.username}</div>

              <span>Username cannot be changed here.</span>
            </div>

            <div className="edit-profile-readonly-field">
              <label>Email</label>

              <div className="readonly-value">{profile.email}</div>

              <span>Email cannot be changed here.</span>
            </div>

            <TextArea
              label="Bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={MAX_BIO_LENGTH}
              rows={5}
              placeholder="Tell people a little about yourself..."
            />

            <div className="edit-profile-character-count">
              {bio.length} / {MAX_BIO_LENGTH}
            </div>

            <Input
              label="Profile Image URL"
              value={profileImageUrl}
              onChange={(event) => setProfileImageUrl(event.target.value)}
              maxLength={MAX_PROFILE_IMAGE_URL_LENGTH}
              placeholder="https://example.com/profile.jpg"
              type="url"
            />
          </div>

          <div className="edit-profile-actions">
            <Link to="/profile">
              <Button type="button" variant="secondary" disabled={isSaving}>
                Cancel
              </Button>
            </Link>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
