/**
 * Utility to fetch live GitHub repository stargazer count dynamically
 */

export async function fetchGitHubStars(repo: string = "jaymore4501/KARA"): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
    });
    if (!res.ok) return 2;
    const data = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : 2;
  } catch (err) {
    console.error("Error fetching live GitHub star count:", err);
    return 2;
  }
}

export function formatStarCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return `${count}`;
}
