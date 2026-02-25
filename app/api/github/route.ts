import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

const GITHUB_USERNAME = "hadenhiles";

async function fetchGitHub(url: string) {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${url}`);
  return res.json();
}

async function fetchCommitCount(query: string): Promise<number> {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/search/commits?q=${encodeURIComponent(query)}&per_page=1`;
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.total_count ?? 0;
}

export async function GET() {
  try {
    const now = new Date();

    const yearAgo = new Date(now);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    const yearAgoStr = yearAgo.toISOString().split("T")[0];

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split("T")[0];

    const [user, allTime, pastYear, thisMonth] = await Promise.all([
      fetchGitHub("https://api.github.com/user"),
      fetchCommitCount(`author:${GITHUB_USERNAME}`),
      fetchCommitCount(`author:${GITHUB_USERNAME} author-date:>=${yearAgoStr}`),
      fetchCommitCount(`author:${GITHUB_USERNAME} author-date:>=${monthStartStr}`),
    ]);

    const repos = (user.public_repos ?? 0) + (user.total_private_repos ?? 0);

    return NextResponse.json({
      repos,
      commitsAllTime: allTime,
      commitsThisYear: pastYear,
      commitsThisMonth: thisMonth,
    });
  } catch (err) {
    console.error("[/api/github]", err);
    return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
  }
}
