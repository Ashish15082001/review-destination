import Image from "next/image";

interface UserAvatarProps {
  imageSrc?: string | null;
  userName: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({
  imageSrc,
  userName,
  size = 40,
  className,
}: UserAvatarProps) {
  const initials = getInitials(userName);

  if (imageSrc) {
    return (
      <div
        className="rounded-full overflow-hidden shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src={imageSrc}
          alt={userName}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full bg-teal-800 flex items-center justify-center text-white font-semibold shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-label={userName}
    >
      {initials}
    </div>
  );
}
