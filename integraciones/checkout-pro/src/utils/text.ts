export function capitalizeFirstLetter(text: string | undefined | null): string {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string | undefined | null): string {
  if (!text) return "";

  return text
    .split(" ")
    .map((word) => (word.length > 0 ? capitalizeFirstLetter(word) : word))
    .join(" ");
}
