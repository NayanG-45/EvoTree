import { NextResponse } from 'next/server';

/**
 * Helper to generate deterministic mock data based on a handle.
 * Ensures the demo feels "realistic" with stable numbers for the same username.
 */
function getDeterministicMock(handle: string, type: 'kaggle' | 'wakatime' | 'github_extra') {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    hash = (hash << 5) - hash + handle.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  if (type === 'kaggle') {
    return {
      totalNotebooks: (absHash % 20) + 2,
      totalCompetitions: (absHash % 10) + 1,
      topBadges: (absHash % 2 === 0) ? "Notebooks Expert" : "Discussion Contributor",
    };
  }
  
  if (type === 'github_extra') {
    return {
      commits: (absHash % 2000) + 500,
      prs: (absHash % 150) + 20,
      stars: (absHash % 300) + 10,
    };
  }

  return {};
}

export async function POST(req: Request) {
  // Default values used as baseline and fallback
  const stats = {
    github: {
      commits: 1284,
      repos: 42,
      prs: 87,
      stars: 156,
    },
    codeforces: {
      currentRating: 1650,
      maxRating: 1820,
      problemsSolved: 450,
      rank: "expert",
    },
    leetcode: {
      totalSolved: 342,
      easySolved: 120,
      mediumSolved: 180,
      hardSolved: 42,
      ranking: 85000,
    },
    kaggle: {
      totalNotebooks: 14,
      totalCompetitions: 6,
      topBadges: "Notebooks Expert",
    },
  };

  try {
    const body = await req.json();
    const { github, codeforces, leetcode, kaggle, wakatime } = body;

    // Seed mock data if handles are provided but API fails or is unavailable
    if (github) {
      const extra = getDeterministicMock(github, 'github_extra');
      stats.github.commits = extra.commits;
      stats.github.prs = extra.prs;
      stats.github.stars = extra.stars;
    }
    if (kaggle || wakatime) {
      const kMock = getDeterministicMock(kaggle || wakatime, 'kaggle');
      stats.kaggle.totalNotebooks = kMock.totalNotebooks;
      stats.kaggle.totalCompetitions = kMock.totalCompetitions;
      stats.kaggle.topBadges = kMock.topBadges;
    }

    // 1. GitHub Fetch (Multiple endpoints for better data)
    if (github) {
      try {
        // Main profile for repos
        const userRes = await fetch(`https://api.github.com/users/${github}`, {
          signal: AbortSignal.timeout(3000),
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          stats.github.repos = userData.public_repos ?? stats.github.repos;
        }

        // Commits (Search API - Unauthenticated is tight, so we try)
        const commitRes = await fetch(`https://api.github.com/search/commits?q=author:${github}`, {
          headers: { 'Accept': 'application/vnd.github.cloak-preview' },
          signal: AbortSignal.timeout(3000),
        });
        if (commitRes.ok) {
          const commitData = await commitRes.json();
          stats.github.commits = commitData.total_count ?? stats.github.commits;
        }

        // PRs
        const prRes = await fetch(`https://api.github.com/search/issues?q=author:${github}+type:pr`, {
          signal: AbortSignal.timeout(3000),
        });
        if (prRes.ok) {
          const prData = await prRes.json();
          stats.github.prs = prData.total_count ?? stats.github.prs;
        }

        // Stars aggregation (first page of repos)
        const repoRes = await fetch(`https://api.github.com/users/${github}/repos?per_page=100&sort=updated`, {
          signal: AbortSignal.timeout(3000),
        });
        if (repoRes.ok) {
          const repos = await repoRes.json();
          if (Array.isArray(repos)) {
            stats.github.stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count ?? 0), 0);
          }
        }
      } catch (e) {
        console.warn('GitHub partial fetch failure:', e.message);
      }
    }

    // 2. Codeforces Fetch
    if (codeforces) {
      try {
        const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${codeforces}`, {
          signal: AbortSignal.timeout(3000),
        });
        if (infoRes.ok) {
          const infoData = await infoRes.json();
          if (infoData.status === "OK" && infoData.result?.[0]) {
            const user = infoData.result[0];
            stats.codeforces.currentRating = user.rating ?? stats.codeforces.currentRating;
            stats.codeforces.maxRating = user.maxRating ?? stats.codeforces.maxRating;
            stats.codeforces.rank = user.rank ?? stats.codeforces.rank;
          }
        }

        const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${codeforces}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.status === "OK" && Array.isArray(statusData.result)) {
            const solved = new Set();
            statusData.result.forEach((submission: any) => {
              if (submission.verdict === "OK") {
                solved.add(`${submission.problem.contestId}-${submission.problem.index}`);
              }
            });
            stats.codeforces.problemsSolved = solved.size || stats.codeforces.problemsSolved;
          }
        }
      } catch (e) {
        console.warn('Codeforces partial fetch failure:', e.message);
      }
    }

    // 3. LeetCode Fetch
    if (leetcode) {
      try {
        const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcode}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (lcRes.ok) {
          const lcData = await lcRes.json();
          if (lcData.status === "success") {
            stats.leetcode.totalSolved = lcData.totalSolved ?? stats.leetcode.totalSolved;
            stats.leetcode.easySolved = lcData.easySolved ?? stats.leetcode.easySolved;
            stats.leetcode.mediumSolved = lcData.mediumSolved ?? stats.leetcode.mediumSolved;
            stats.leetcode.hardSolved = lcData.hardSolved ?? stats.leetcode.hardSolved;
            stats.leetcode.ranking = lcData.ranking ?? stats.leetcode.ranking;
          }
        }
      } catch (e) {
        console.warn('LeetCode fetch failure:', e.message);
      }
    }

    // Always 200 OK for the demo
    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('Unified stats API error:', error);
    return NextResponse.json(stats, { status: 200 });
  }
}
