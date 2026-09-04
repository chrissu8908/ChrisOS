function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(title = "") {
  return String(title)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchCurrents(category) {
  const key = process.env.CURRENTS_API_KEY;
  if (!key) throw new Error("CURRENTS_API_KEY is not configured on the server");

  const params = new URLSearchParams({
    language: "en",
    category: category || "general",
    page_size: "20",
  });
  const response = await fetch(`https://api.currentsapi.services/v1/latest-news?${params}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.status === "error") {
    throw new Error(data?.message || data?.msg || `Currents HTTP ${response.status}`);
  }

  return (data?.news || []).map((article) => ({
    id: article.id || `news-${normalizeKey(article.title || article.url || "")}`,
    title: cleanText(article.title || ""),
    desc: cleanText(article.description || "").slice(0, 500),
    link: article.url || "#",
    source: article.domain || article.source?.name || "News source",
    sourceUrl: article.domain ? `https://${article.domain}` : null,
    publishedAt: article.published || null,
    image: article.image || null,
    category: article.category || [],
    type: "news",
  })).filter((item) => item.title && item.link);
}

async function fetchReddit(subreddit) {
  // 5s timeout per subreddit — Reddit can be slow; don't let one sub stall the response
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=8&raw_json=1`,
      {
        headers: {
          "User-Agent": "ChrisOS/1.0 (personal dashboard)",
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );
    if (!response.ok) throw new Error(`Reddit HTTP ${response.status}`);
    const data = await response.json();

    return (data?.data?.children || [])
      .map((child) => child?.data)
      .filter((post) => post?.title && !post?.stickied && !post?.over_18)
      .slice(0, 6)
      .map((post) => ({
        id: `reddit-${post.id}`,
        title: cleanText(post.title),
        desc: cleanText(post.selftext || "").slice(0, 500),
        link: `https://www.reddit.com${post.permalink}`,
        source: `r/${subreddit}`,
        type: "reddit",
        score: Number(post.score) || 0,
        comments: Number(post.num_comments) || 0,
      }));
  } catch (error) {
    return { error: `${subreddit}: ${error?.message || "Reddit request failed"}`, items: [] };
  } finally {
    clearTimeout(timer);
  }
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeKey(item.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const category = String(req.query?.category || "general");
  const subreddits = String(req.query?.subreddits || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 6);

  const [newsResult, redditResults] = await Promise.all([
    fetchCurrents(category)
      .then((items) => ({ items, error: null }))
      .catch((error) => ({ items: [], error: error?.message || "Currents request failed" })),
    Promise.all(subreddits.map(fetchReddit)),
  ]);

  const redditItems = [];
  const errors = [];
  if (newsResult.error) errors.push(newsResult.error);

  for (const result of redditResults) {
    if (Array.isArray(result)) redditItems.push(...result);
    else {
      if (result?.error) errors.push(result.error);
      if (Array.isArray(result?.items)) redditItems.push(...result.items);
    }
  }

  const news = dedupe(newsResult.items).sort(
    (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
  );
  const reddit = dedupe(redditItems).sort(
    (a, b) => (b.score + b.comments * 2) - (a.score + a.comments * 2)
  );

  return res.status(200).json({ news, reddit, errors });
};
