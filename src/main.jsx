import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, ExternalLink, Loader2, Play, Search } from 'lucide-react';
import './styles.css';

const defaultSupabaseUrl = 'https://vwiwgbvtkjyerqpjbkfc.supabase.co/rest/v1/';
const defaultSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aXdnYnZ0a2p5ZXJxcGpia2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTg5NjIsImV4cCI6MjA5NjE3NDk2Mn0.uqMgkZTVOm0NmU54HSlQe33BeAfYxFPj5xzA_IfsXB8';
const supabaseUrl = normalizeSupabaseUrl(getEnvValue(import.meta.env.VITE_SUPABASE_URL, defaultSupabaseUrl));
const supabaseAnonKey = getEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY, defaultSupabaseAnonKey);
const lootlabsLogo = 'https://i.imgur.com/chWRq9O.png';
const directAdLink = 'https://www.effectivecpmnetwork.com/zpgbszxrzc?key=d1ab8a6a326be7a2a730e58642a92eb3';

const globalAdScripts = [
  {
    id: 'adsterra-popunder-f91d0efc66ef091f9b1eeb1b998ad40f',
    src: 'https://pl29649394.effectivecpmnetwork.com/f9/1d/0e/f91d0efc66ef091f9b1eeb1b998ad40f.js',
  },
  {
    id: 'adsterra-popunder-142bfc32c774f5f87f5ea53d57e6c397',
    src: 'https://pl29649398.effectivecpmnetwork.com/14/2b/fc/142bfc32c774f5f87f5ea53d57e6c397.js',
  },
];

const iframeAds = {
  leaderboard: { key: '27cbf4ff895d33adda60467b0a6419ae', width: 728, height: 90 },
  banner: { key: 'c9c26ab9e39ba477671b272bce2494eb', width: 468, height: 60 },
  mobile: { key: '65d65154be3174f30f7b3b767e09d31b', width: 320, height: 50 },
  rectangle: { key: 'a0ec8512eb15caafae71c26a5a7aa1cb', width: 300, height: 250 },
  skyscraper: { key: '110512ebb009dc7a5a3cdb35e6da553a', width: 160, height: 300 },
  tallSkyscraper: { key: '75952d1ada641b0b480dfaf794dbe2cd', width: 160, height: 600 },
};

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getEnvValue(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

function loadScriptOnce({ id, src, async = true, cfasync }) {
  if (document.getElementById(id)) return;

  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = async;
  if (cfasync !== undefined) {
    script.dataset.cfasync = String(cfasync);
  }
  document.body.appendChild(script);
}

function useGlobalAdScripts() {
  useEffect(() => {
    globalAdScripts.forEach(loadScriptOnce);
  }, []);
}

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').split('?')[0];
    }
    if (parsed.searchParams.get('v')) {
      return parsed.searchParams.get('v');
    }
    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch) return shortsMatch[1];
    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {
    return '';
  }
  return '';
}

function getThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

async function getVideoMetadata(url) {
  const id = getYouTubeId(url);
  const fallback = {
    title: id ? `YouTube Video ${id}` : 'YouTube Video',
    thumbnail: getThumbnail(url),
  };

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    );
    if (!response.ok) return fallback;
    const data = await response.json();
    return {
      title: data.title || fallback.title,
      thumbnail: data.thumbnail_url || fallback.thumbnail,
    };
  } catch {
    return fallback;
  }
}

function Logo() {
  return (
    <a className="logoLockup" href="/" aria-label="KrayoSkriptz home">
      <img src="/logo.svg" alt="KrayoSkriptz logo" className="brandLogo" />
      <span>
        <strong>Krayo</strong>Skriptz
      </span>
    </a>
  );
}

function getAdFrameSource(ad) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
      body { display: flex; align-items: center; justify-content: center; }
    </style>
  </head>
  <body>
    <script>
      atOptions = ${JSON.stringify({
        key: ad.key,
        format: 'iframe',
        height: ad.height,
        width: ad.width,
        params: {},
      })};
    </script>
    <script src="https://www.highperformanceformat.com/${ad.key}/invoke.js"></script>
  </body>
</html>`;
}

function IframeAdSlot({ ad, className = '' }) {
  return (
    <iframe
      className={`adSlot ${className}`}
      srcDoc={getAdFrameSource(ad)}
      title={`Advertisement ${ad.width} by ${ad.height}`}
      width={ad.width}
      height={ad.height}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      style={{ '--ad-width': `${ad.width}px`, '--ad-height': `${ad.height}px` }}
    />
  );
}

function NativeAdSlot() {
  useEffect(() => {
    loadScriptOnce({
      id: 'adsterra-native-62357ec70029d873daedb66eb2cfbba5',
      src: 'https://pl29649395.effectivecpmnetwork.com/62357ec70029d873daedb66eb2cfbba5/invoke.js',
      async: true,
      cfasync: false,
    });
  }, []);

  return (
    <div className="nativeAdSlot">
      <div id="container-62357ec70029d873daedb66eb2cfbba5" />
    </div>
  );
}

function DirectAdLink() {
  return (
    <a className="directAdLink" href={directAdLink} target="_blank" rel="noreferrer">
      Sponsored link
    </a>
  );
}

function HomeAdBlock() {
  return (
    <div className="adBlock" aria-label="Sponsored">
      <IframeAdSlot ad={iframeAds.leaderboard} className="wideAd" />
      <IframeAdSlot ad={iframeAds.mobile} className="mobileAd" />
      <NativeAdSlot />
      <div className="adGrid">
        <IframeAdSlot ad={iframeAds.rectangle} />
        <IframeAdSlot ad={iframeAds.banner} />
        <DirectAdLink />
      </div>
    </div>
  );
}

function DetailAdBlock() {
  return (
    <div className="adBlock detailAds" aria-label="Sponsored">
      <IframeAdSlot ad={iframeAds.leaderboard} className="wideAd" />
      <IframeAdSlot ad={iframeAds.mobile} className="mobileAd" />
      <div className="adGrid compactAds">
        <IframeAdSlot ad={iframeAds.skyscraper} />
        <IframeAdSlot ad={iframeAds.tallSkyscraper} />
      </div>
    </div>
  );
}

function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadPosts() {
      const { data, error: dbError } = await supabase
        .from('posts')
        .select('id, YoutubeLink, LootlabsLink, created_at')
        .order('created_at', { ascending: false });

      if (!alive) return;

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      const enriched = await Promise.all(
        (data || []).map(async (post) => ({
          ...post,
          metadata: await getVideoMetadata(post.YoutubeLink),
        })),
      );

      if (alive) {
        setPosts(enriched);
        setLoading(false);
      }
    }

    loadPosts();
    return () => {
      alive = false;
    };
  }, []);

  return { posts, loading, error };
}

function HomePage({ posts, loading, error }) {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;

    return posts.filter((post) => {
      const title = post.metadata?.title?.toLowerCase() || '';
      return title.includes(needle) || post.YoutubeLink.toLowerCase().includes(needle);
    });
  }, [posts, query]);

  return (
    <main>
      <section className="hero">
        <div className="heroInner">
          <Logo />
          <div className="heroCopy">
            <p className="eyebrow">premium roblox scripts</p>
            <h1>KrayoSkriptz</h1>
            <p className="intro">
              Browse the latest releases, preview each video, and unlock the script through Lootlabs.
            </p>
          </div>
          <div className="searchShell">
            <Search size={20} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search scripts"
              aria-label="Search scripts"
            />
          </div>
        </div>
      </section>

      <section className="contentBand" aria-label="Script posts">
        <HomeAdBlock />

        <div className="sectionHeader">
          <p>{filteredPosts.length} posts</p>
          <h2>Latest Scripts</h2>
        </div>

        {error ? <div className="statusPanel">{error}</div> : null}

        {loading ? (
          <div className="statusPanel loading">
            <Loader2 size={20} />
            Loading scripts
          </div>
        ) : null}

        {!loading && !error && filteredPosts.length === 0 ? (
          <div className="statusPanel">No scripts matched your search.</div>
        ) : null}

        <div className="postGrid">
          {filteredPosts.map((post) => (
            <a className="postCard" href={`/post/${post.id}`} key={post.id}>
              <span className="thumbWrap">
                <img
                  src={post.metadata.thumbnail}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                <span className="playBadge">
                  <Play size={18} fill="currentColor" />
                </span>
              </span>
              <span className="postText">
                <strong>{post.metadata.title}</strong>
                <span>Open script</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function PostPage({ posts, loading, error }) {
  const postId = window.location.pathname.split('/').filter(Boolean)[1];
  const post = posts.find((item) => item.id === postId);
  const videoId = post ? getYouTubeId(post.YoutubeLink) : '';

  if (loading) {
    return (
      <main className="detailShell">
        <Logo />
        <div className="statusPanel loading">
          <Loader2 size={20} />
          Loading preview
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="detailShell">
        <Logo />
        <a className="backLink" href="/">
          <ArrowLeft size={18} />
          Back
        </a>
        <div className="statusPanel">{error || 'This post could not be found.'}</div>
      </main>
    );
  }

  return (
    <main className="detailShell">
      <Logo />
      <a className="backLink" href="/">
        <ArrowLeft size={18} />
        Back
      </a>

      <section className="detailLayout" aria-label="Script preview and unlock link">
        <div className="videoPanel">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={post.metadata.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="statusPanel">Video preview is unavailable.</div>
          )}
        </div>

        <DetailAdBlock />

        <div className="unlockPanel">
          <p className="eyebrow">script access</p>
          <h1>{post.metadata.title}</h1>
          <p className="unlockText">Get the script using the following:</p>
          <a className="lootButton" href={post.LootlabsLink} target="_blank" rel="noreferrer">
            <img src={lootlabsLogo} alt="" />
            Lootlabs
            <ExternalLink size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

function App() {
  useGlobalAdScripts();

  const { posts, loading, error } = usePosts();
  const isPostPage = window.location.pathname.startsWith('/post/');

  return isPostPage ? (
    <PostPage posts={posts} loading={loading} error={error} />
  ) : (
    <HomePage posts={posts} loading={loading} error={error} />
  );
}

createRoot(document.getElementById('root')).render(<App />);
