import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, ExternalLink, Loader2, Play, Search } from 'lucide-react';
import './styles.css';

const supabaseUrl = normalizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL || 'https://vwiwgbvtkjyerqpjbkfc.supabase.co/rest/v1/',
);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'wezzsupabase';
const lootlabsLogo = 'https://i.imgur.com/chWRq9O.png';

const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
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

function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    async function loadPosts() {
      if (!supabase) {
        setError('Add VITE_SUPABASE_URL in your environment to connect Supabase.');
        setLoading(false);
        return;
      }

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

      <section className="detailLayout">
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

        <aside className="unlockPanel">
          <p className="eyebrow">script access</p>
          <h1>{post.metadata.title}</h1>
          <p className="unlockText">Get the script using the following:</p>
          <a className="lootButton" href={post.LootlabsLink} target="_blank" rel="noreferrer">
            <img src={lootlabsLogo} alt="" />
            Lootlabs
            <ExternalLink size={18} />
          </a>
        </aside>
      </section>
    </main>
  );
}

function App() {
  const { posts, loading, error } = usePosts();
  const isPostPage = window.location.pathname.startsWith('/post/');

  return isPostPage ? (
    <PostPage posts={posts} loading={loading} error={error} />
  ) : (
    <HomePage posts={posts} loading={loading} error={error} />
  );
}

createRoot(document.getElementById('root')).render(<App />);
