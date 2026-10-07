export function formatLastSeen(date: string | null): string {
  if (!date) {
    return "Offline";
  }

  const value = new Date(date);
  const now = new Date();

  const differenceInSeconds = Math.floor(
    (now.getTime() - value.getTime()) / 1000,
  );

  if (differenceInSeconds < 60) {
    return "Last seen just now";
  }

  const differenceInMinutes = Math.floor(differenceInSeconds / 60);

  if (differenceInMinutes < 60) {
    return `Last seen ${differenceInMinutes} ${
      differenceInMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const differenceInHours = Math.floor(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `Last seen ${differenceInHours} ${
      differenceInHours === 1 ? "hour" : "hours"
    } ago`;
  }

  const isYesterday = differenceInHours < 48;

  if (isYesterday) {
    return `Last seen yesterday at ${value.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  return `Last seen ${value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: value.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })}`;
}
