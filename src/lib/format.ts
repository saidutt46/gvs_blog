// Frontmatter dates are parsed as UTC midnight. Format in UTC so a post
// dated 2026-05-02 never shows as May 1 in a timezone west of UTC.
export function formatDate(date: Date, style: 'long' | 'short' | 'shortNoYear' = 'long'): string {
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: style === 'shortNoYear' ? undefined : 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
