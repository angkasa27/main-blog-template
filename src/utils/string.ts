export function getInitials(name: string, maxWords: number = 2): string {
  if (!name || maxWords <= 0) return "";

  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, maxWords)
    .map((part) => part[0].toUpperCase())
    .join("");

  return initials;
}
