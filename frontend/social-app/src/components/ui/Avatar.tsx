import "./Avatar.css";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Avatar({
  src,
  alt = "User avatar",
  size = "md",
}: AvatarProps) {
  return (
    <div className={`ui-avatar ui-avatar-${size}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span>{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}
