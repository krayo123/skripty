import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BadgeCheck,
  Bolt,
  Download,
  Eye,
  ExternalLink,
  Flame,
  Lock,
  Loader2,
  LogIn,
  LogOut,
  Play,
  Plus,
  Search,
  Sparkles,
  User,
} from 'lucide-react';
import './styles.css';

const defaultSupabaseUrl = 'https://vwiwgbvtkjyerqpjbkfc.supabase.co/rest/v1/';
const defaultSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6InZ3aXdnYnZ0a2p5ZXJxcGpia2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTg5NjIsImV4cCI6MjA5NjE3NDk2Mn0.uqMgkZTVOm0NmU54HSlQe33BeAfYxFPj5xzA_IfsXB8';
const supabaseUrl = normalizeSupabaseUrl(getEnvValue(import.meta.env.VITE_SUPABASE_URL, defaultSupabaseUrl));
const supabaseAnonKey = getEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY, defaultSupabaseAnonKey);
const logoUrl = getEnvValue(import.meta.env.VITE_LOGO_URL, '/logo.svg');
const lootlabsLogo = 'https://i.imgur.com/chWRq9O.png';
const directAdLink = getEnvValue(
  import.meta.env.VITE_DIRECT_AD_LINK,
  'https://www.effectivecpmnetwork.com/zpgbszxrzc?key=d1ab8a6a326be7a2a730e58642a92eb3',
);

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

const adBlockProbeUrls = [
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
  'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
  'https://www.highperformanceformat.com/27cbf4ff895d33adda60467b0a6419ae/invoke.js',
  'https://pl29649395.effectivecpmnetwork.com/62357ec70029d873daedb66eb2cfbba5/invoke.js',
];

const iframeAds = {
  leaderboard: { key: '27cbf4ff895d33adda60467b0a6419ae', width: 728, height: 90 },
  banner: { key: 'c9c26ab9e39ba477671b272bce2494eb', width: 468, height: 60 },
  mobile: { key: '65d65154be3174f30f7b3b767e09d31b', width: 320, height: 50 },
  rectangle: { key: 'a0ec8512eb15caafae71c26a5a7aa1cb', width: 300, height: 250 },
  skyscraper: { key: '110512ebb009dc7a5a3cdb35e6da553a', width: 160, height: 300 },
  tallSkyscraper: { key: '75952d1ada641b0b480dfaf794dbe2cd', width: 160, height: 600 },
};

const executors = [
  {
    name: 'Velocity',
    tone: 'Velocity executor download',
    href: 'https://velocity-executor.com/download/',
    badge: 'Velocity',
    icon: Bolt,
    palette: 'velocity',
    preview: 'https://img.youtube.com/vi/ubSyv_0p9e8/maxresdefault.jpg',
    fallbackPreview: 'https://img.youtube.com/vi/ubSyv_0p9e8/hqdefault.jpg',
  },
  {
    name: 'Madium',
    tone: 'Free executor client download',
    href: 'https://filerift.com/file/w3Zpjdoc10',
    badge: 'Free',
    icon: Flame,
    palette: 'madium',
    preview: 'https://img.youtube.com/vi/Ds3tkKpDuiU/maxresdefault.jpg',
    fallbackPreview: 'https://img.youtube.com/vi/Ds3tkKpDuiU/hqdefault.jpg',
  },
  {
    name: 'Xeno',
    tone: 'Xeno executor download',
    href: 'https://wearedevs.net/d/Xeno',
    badge: 'Xeno',
    icon: Sparkles,
    palette: 'xeno',
    preview: 'https://img.youtube.com/vi/J-aI6tVNXXA/maxresdefault.jpg',
    fallbackPreview: 'https://img.youtube.com/vi/J-aI6tVNXXA/hqdefault.jpg',
  },
];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getEnvValue(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeSupabaseUrl(url) {
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

function loadScriptOnce({ id, src, async = true, cfasync, onLoad, onError }) {
  const existingScript = document.getElementById(id);
  if (existingScript) return;

  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = async;
  if (cfasync !== undefined) {
    script.dataset.cfasync = String(cfasync);
  }
  if (onLoad) script.addEventListener('load', onLoad, { once: true });
  if (onError) script.addEventListener('error', onError, { once: true });
  document.body.appendChild(script);
}

function useGlobalAdScripts(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    globalAdScripts.forEach((adScript) => {
      loadScriptOnce({
        ...adScript,
        onError: () => window.dispatchEvent(new Event('krayo-ad-block-detected')),
      });
    });
  }, [enabled]);
}

function useAdBlockDetection(enabled = true) {
  const [status, setStatus] = useState(enabled ? 'checking' : 'clear');

  useEffect(() => {
    if (!enabled) {
      setStatus('clear');
      return undefined;
    }

    setStatus('checking');
    let alive = true;
    const markBlocked = () => {
      if (alive) setStatus('blocked');
    };
    const markClear = () => {
      if (alive) setStatus((currentStatus) => (currentStatus === 'blocked' ? currentStatus : 'clear'));
    };

    window.addEventListener('krayo-ad-block-detected', markBlocked);

    const baitNodes = createAdBlockBaits();

    const timerId = window.setTimeout(async () => {
      const baitWasBlocked = baitNodes.some(isAdBaitBlocked);
      if (baitWasBlocked) {
        cleanupAdBaits(baitNodes);
        markBlocked();
        return;
      }

      const probeResults = await Promise.all(adBlockProbeUrls.map((url) => probeAdNetwork(url)));
      cleanupAdBaits(baitNodes);

      if (!alive) return;

      const failedProbes = probeResults.filter((result) => !result).length;
      if (failedProbes >= 2) {
        markBlocked();
        return;
      }

      markClear();
    }, 800);

    return () => {
      alive = false;
      window.clearTimeout(timerId);
      window.removeEventListener('krayo-ad-block-detected', markBlocked);
      cleanupAdBaits(baitNodes);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || status === 'clear') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [enabled, status]);

  return status;
}

function createAdBlockBaits() {
  const baitConfigs = [
    { className: 'adsbox adsbygoogle ad-banner ad-unit text-ad pub_300x250' },
    { id: 'google_ads_iframe_/21735456368/krayo_skriptz_0', className: 'ad-container ad-placeholder' },
    { className: 'banner-ads advertisement sponsored-links' },
  ];

  return baitConfigs.map((config) => {
    const bait = document.createElement('div');
    if (config.id) bait.id = config.id;
    bait.className = config.className;
    bait.setAttribute('aria-hidden', 'true');
    bait.style.cssText =
      'position:absolute;left:-10000px;top:-10000px;width:300px;height:250px;pointer-events:none;';
    document.body.appendChild(bait);
    return bait;
  });
}

function isAdBaitBlocked(bait) {
  if (!document.body.contains(bait)) return true;

  const style = window.getComputedStyle(bait);
  return (
    bait.offsetHeight < 20 ||
    bait.offsetWidth < 20 ||
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  );
}

function cleanupAdBaits(baitNodes) {
  baitNodes.forEach((bait) => bait.remove());
}

async function probeAdNetwork(url) {
  const controller = new AbortController();
  const timerId = window.setTimeout(() => controller.abort(), 2400);

  try {
    await fetch(`${url}${url.includes('?') ? '&' : '?'}krayo_probe=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'omit',
      mode: 'no-cors',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timerId);
  }
}

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const isYouTubeHost = hostname === 'youtube.com' || hostname.endsWith('.youtube.com');

    if (hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '').split('?')[0];
    }
    if (!isYouTubeHost) return '';
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

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

async function getVideoMetadata(url) {
  const id = getYouTubeId(url);
  const fallback = {
    title: id ? `Roblox Script ${id}` : 'Roblox Script',
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
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <a className="logoLockup" href="/" aria-label="KrayoSkriptz home">
      {logoFailed ? (
        <span className="brandMark">KS</span>
      ) : (
        <img
          src={logoUrl}
          alt=""
          className="brandLogo"
          onError={() => setLogoFailed(true)}
        />
      )}
      <span>
        <strong>Krayo</strong>Skriptz
      </span>
    </a>
  );
}

function SiteHeader() {
  const path = window.location.pathname;

  return (
    <header className="siteHeader">
      <Logo />
      <nav className="navPills" aria-label="Main navigation">
        <a className={path === '/' ? 'active' : ''} href="/">
          Scripts
        </a>
        <a className={path.startsWith('/executors') ? 'active' : ''} href="/executors">
          Executors
        </a>
        <a className={path.startsWith('/admin') ? 'active' : ''} href="/admin">
          Admin
        </a>
      </nav>
    </header>
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
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
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
    <a className="directAdLink" href={directAdLink} target="_blank" rel="noopener noreferrer">
      Sponsored boost
      <ExternalLink size={16} />
    </a>
  );
}

function AdStrip() {
  return (
    <div className="adStrip" aria-label="Sponsored">
      <IframeAdSlot ad={iframeAds.leaderboard} className="wideAd" />
      <IframeAdSlot ad={iframeAds.banner} className="bannerAd" />
      <IframeAdSlot ad={iframeAds.mobile} className="mobileAd" />
      <DirectAdLink />
      <NativeAdSlot />
    </div>
  );
}

function SideAdRails() {
  return (
    <>
      <aside className="sideAdRail leftRail" aria-label="Sponsored left">
        <IframeAdSlot ad={iframeAds.tallSkyscraper} className="railAd" />
      </aside>
      <aside className="sideAdRail rightRail" aria-label="Sponsored right">
        <IframeAdSlot ad={iframeAds.skyscraper} className="railAd" />
      </aside>
    </>
  );
}

const adBlockGateStyles = {
  gate: {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    display: 'grid',
    placeItems: 'center',
    padding: 24,
    background:
      'linear-gradient(115deg, rgba(3, 5, 10, 0.96), rgba(7, 9, 15, 0.92)), repeating-linear-gradient(90deg, rgba(159, 252, 255, 0.08) 0 1px, transparent 1px 42px)',
    backdropFilter: 'blur(18px)',
  },
  panel: {
    display: 'grid',
    gap: 16,
    width: 'min(100%, 500px)',
    padding: 28,
    border: '1px solid rgba(255, 42, 141, 0.36)',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(17, 23, 39, 0.96), rgba(8, 11, 19, 0.98)), #080b13',
    boxShadow: '0 26px 90px rgba(0, 0, 0, 0.58), 0 0 42px rgba(255, 42, 141, 0.12)',
  },
  heading: {
    margin: 0,
    color: '#ffffff',
    fontSize: 'clamp(2rem, 6vw, 3.2rem)',
    lineHeight: 0.98,
    letterSpacing: 0,
  },
  copy: {
    margin: 0,
    color: '#cbd5e2',
    lineHeight: 1.55,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    padding: '0 18px',
    border: '1px solid rgba(0, 224, 255, 0.42)',
    borderRadius: 8,
    color: '#061019',
    fontWeight: 1000,
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #9ffcff, #9dff57)',
    boxShadow: '0 18px 46px rgba(0, 224, 255, 0.14)',
  },
};

function AdBlockGate({ status }) {
  if (status === 'clear') return null;

  const isChecking = status === 'checking';

  return (
    <div style={adBlockGateStyles.gate} role="dialog" aria-modal="true" aria-labelledby="adblock-title">
      <div style={adBlockGateStyles.panel}>
        <Logo />
        <p className="eyebrow">{isChecking ? 'checking ad access' : 'ad blocker detected'}</p>
        <h2 id="adblock-title" style={adBlockGateStyles.heading}>
          {isChecking ? 'Checking access...' : 'Disable AdBlock to enter.'}
        </h2>
        <p style={adBlockGateStyles.copy}>
          {isChecking
            ? 'One quick ad check before the site opens.'
            : 'KrayoSkriptz uses ads to keep scripts free. Turn off your ad blocker for this site, then reload.'}
        </p>
        {isChecking ? null : (
          <button type="button" style={adBlockGateStyles.button} onClick={() => window.location.reload()}>
            Reload page
          </button>
        )}
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

function HeroPanel({ postsCount, query, setQuery }) {
  return (
    <section className="hero">
      <div className="heroCopy">
        <p className="eyebrow">Roblox scripts hub</p>
        <h1>Fresh scripts without the chaos.</h1>
        <p className="intro">
          Browse new releases, preview gameplay videos, and jump straight to the script unlock.
        </p>
      </div>

      <div className="heroConsole">
        <div className="consoleTop">
          <span />
          <span />
          <span />
        </div>
        <div className="consoleBody">
          <p>scripts loaded</p>
          <strong>{postsCount}</strong>
          <span>updated from latest posts</span>
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
  );
}

function ScriptCard({ post, index }) {
  return (
    <a className="postCard" href={`/post/${post.id}`}>
      <span className="thumbWrap">
        {post.metadata.thumbnail ? (
          <img
            src={post.metadata.thumbnail}
            alt=""
            loading={index < 6 ? 'eager' : 'lazy'}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        <span className="playBadge">
          <Play size={18} fill="currentColor" />
        </span>
        <span className="hotBadge">New</span>
      </span>
      <span className="postText">
        <strong>{post.metadata.title}</strong>
        <span>
          Open script
          <ExternalLink size={16} />
        </span>
      </span>
    </a>
  );
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
    <main className="pageShell">
      <SiteHeader />
      <HeroPanel postsCount={posts.length} query={query} setQuery={setQuery} />
      <AdStrip />

      <section className="contentBand" aria-label="Script posts">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">latest drops</p>
            <h2>Scripts that players are looking for</h2>
          </div>
          <span>{filteredPosts.length} posts</span>
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
          {filteredPosts.map((post, index) => (
            <ScriptCard post={post} index={index} key={post.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ExecutorsPage() {
  return (
    <main className="pageShell">
      <SiteHeader />

      <section className="executorsHero">
        <div>
          <p className="eyebrow">executor downloads</p>
          <h1>Pick a setup and get moving.</h1>
          <p className="intro">
            A focused download page for the tools players search for most, with bold previews and simple actions.
          </p>
        </div>
      </section>

      <AdStrip />

      <section className="contentBand">
        <div className="executorGrid">
          {executors.map((executor) => {
            const Icon = executor.icon;
            return (
              <article className={`executorCard ${executor.palette}`} key={executor.name}>
                <div className="executorPoster">
                  <img
                    src={executor.preview}
                    alt=""
                    loading="eager"
                    onError={(event) => {
                      if (event.currentTarget.src !== executor.fallbackPreview) {
                        event.currentTarget.src = executor.fallbackPreview;
                      }
                    }}
                  />
                  <Icon size={76} strokeWidth={1.7} />
                  <span>{executor.badge}</span>
                </div>
                <div className="executorBody">
                  <div>
                    <h2>{executor.name}</h2>
                    <p>{executor.tone}</p>
                  </div>
                  <a href={executor.href} target="_blank" rel="noopener noreferrer">
                    <Download size={18} />
                    Download
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function useAdminSession() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setChecking(false);
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, checking };
}

function AdminPage() {
  const { session, checking } = useAdminSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [lootlabsLink, setLootlabsLink] = useState('');
  const [preview, setPreview] = useState(null);
  const [previewStatus, setPreviewStatus] = useState('idle');
  const [authError, setAuthError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const nextLink = youtubeLink.trim();
    if (!nextLink || !getYouTubeId(nextLink)) {
      setPreview(null);
      setPreviewStatus('idle');
      return undefined;
    }

    let alive = true;
    setPreviewStatus('loading');

    const timerId = window.setTimeout(async () => {
      const metadata = await getVideoMetadata(nextLink);
      if (!alive) return;
      setPreview(metadata);
      setPreviewStatus('ready');
    }, 350);

    return () => {
      alive = false;
      window.clearTimeout(timerId);
    };
  }, [youtubeLink]);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError('');
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setPassword('');
    }

    setBusy(false);
  }

  async function handleLogout() {
    setAuthError('');
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
  }

  async function handleAddPost(event) {
    event.preventDefault();
    const nextYoutubeLink = youtubeLink.trim();
    const nextLootlabsLink = lootlabsLink.trim();

    setFormError('');
    setSuccess('');

    if (!getYouTubeId(nextYoutubeLink)) {
      setFormError('Paste a valid YouTube video, shorts, embed, or youtu.be link.');
      return;
    }

    if (!isHttpUrl(nextLootlabsLink)) {
      setFormError('Paste a valid Lootlabs or unlock link that starts with http or https.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.from('posts').insert({
      YoutubeLink: nextYoutubeLink,
      LootlabsLink: nextLootlabsLink,
    });

    if (error) {
      setFormError(error.message);
    } else {
      setSuccess('Post added. It will appear on the home page after refresh.');
      setYoutubeLink('');
      setLootlabsLink('');
      setPreview(null);
      setPreviewStatus('idle');
    }

    setBusy(false);
  }

  return (
    <main className="pageShell adminShell">
      <SiteHeader />

      <section className="adminHero">
        <div>
          <p className="eyebrow">private publishing</p>
          <h1>Admin panel</h1>
          <p className="intro">Add a YouTube preview and Lootlabs unlock link without opening the SQL editor.</p>
        </div>
        {session ? (
          <button className="adminGhostButton" type="button" onClick={handleLogout} disabled={busy}>
            <LogOut size={18} />
            Sign out
          </button>
        ) : null}
      </section>

      {checking ? (
        <div className="statusPanel loading">
          <Loader2 size={20} />
          Checking admin session
        </div>
      ) : null}

      {!checking && !session ? (
        <form className="adminPanel" onSubmit={handleLogin}>
          <div>
            <p className="eyebrow">supabase auth</p>
            <h2>Sign in</h2>
          </div>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {authError ? <div className="adminError">{authError}</div> : null}
          <button className="adminButton" type="submit" disabled={busy}>
            {busy ? <Loader2 size={18} /> : <LogIn size={18} />}
            Sign in
          </button>
          <p className="adminNote">
            Use a Supabase Auth user from your project. Keep public sign-ups disabled unless you add stricter admin
            policies.
          </p>
        </form>
      ) : null}

      {!checking && session ? (
        <section className="adminGrid">
          <form className="adminPanel" onSubmit={handleAddPost}>
            <div>
              <p className="eyebrow">new script post</p>
              <h2>Add post</h2>
            </div>
            <label>
              <span>YouTube link</span>
              <input
                type="url"
                value={youtubeLink}
                onChange={(event) => setYoutubeLink(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </label>
            <label>
              <span>Lootlabs link</span>
              <input
                type="url"
                value={lootlabsLink}
                onChange={(event) => setLootlabsLink(event.target.value)}
                placeholder="https://lootlabs.gg/..."
                required
              />
            </label>
            {formError ? <div className="adminError">{formError}</div> : null}
            {success ? <div className="adminSuccess">{success}</div> : null}
            <button className="adminButton" type="submit" disabled={busy}>
              {busy ? <Loader2 size={18} /> : <Plus size={18} />}
              Add post
            </button>
          </form>

          <aside className="adminPreview">
            <div className="adminPreviewHeader">
              <Eye size={18} />
              Preview
            </div>
            {preview ? (
              <>
                <div className="adminPreviewThumb">
                  <img src={preview.thumbnail} alt="" />
                </div>
                <strong>{preview.title}</strong>
                <span>{previewStatus === 'loading' ? 'Refreshing YouTube metadata' : 'Ready to publish'}</span>
              </>
            ) : (
              <div className="adminEmptyPreview">
                <Lock size={22} />
                Paste a YouTube link to preview the card before publishing.
              </div>
            )}
            <div className="adminAccount">
              <User size={16} />
              {session.user.email}
            </div>
          </aside>
        </section>
      ) : null}
    </main>
  );
}

function PostPage({ posts, loading, error }) {
  const postId = window.location.pathname.split('/').filter(Boolean)[1];
  const post = posts.find((item) => item.id === postId);
  const videoId = post ? getYouTubeId(post.YoutubeLink) : '';

  if (loading) {
    return (
      <main className="pageShell">
        <SiteHeader />
        <div className="statusPanel loading">
          <Loader2 size={20} />
          Loading preview
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="pageShell">
        <SiteHeader />
        <a className="backLink" href="/">
          <ArrowLeft size={18} />
          Back
        </a>
        <div className="statusPanel">{error || 'This post could not be found.'}</div>
      </main>
    );
  }

  return (
    <main className="pageShell">
      <SiteHeader />
      <a className="backLink" href="/">
        <ArrowLeft size={18} />
        Back to scripts
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

        <aside className="unlockPanel">
          <p className="eyebrow">script access</p>
          <h1>{post.metadata.title}</h1>
          <p className="unlockText">Get the script using the following:</p>
          <p className="unlockHint">Click Lootlabs below to unlock the script.</p>
          <a className="lootButton" href={post.LootlabsLink} target="_blank" rel="noopener noreferrer">
            <img src={lootlabsLogo} alt="" />
            Lootlabs
            <ExternalLink size={18} />
          </a>
          <div className="trustRow">
            <BadgeCheck size={18} />
            Fresh post source
          </div>
        </aside>

        <div className="detailAds">
          <IframeAdSlot ad={iframeAds.rectangle} className="rectangleAd" />
          <IframeAdSlot ad={iframeAds.skyscraper} className="skyscraperAd" />
          <IframeAdSlot ad={iframeAds.tallSkyscraper} className="tallSkyscraperAd" />
          <NativeAdSlot />
        </div>
      </section>
    </main>
  );
}

function App() {
  const currentPath = window.location.pathname;
  const isAdminPage = currentPath.startsWith('/admin');

  useGlobalAdScripts(!isAdminPage);
  const adBlockStatus = useAdBlockDetection(!isAdminPage);

  const { posts, loading, error } = usePosts();
  const isPostPage = currentPath.startsWith('/post/');
  const isExecutorsPage = currentPath.startsWith('/executors');
  let page;

  if (isAdminPage) {
    page = <AdminPage />;
  } else if (isPostPage) {
    page = <PostPage posts={posts} loading={loading} error={error} />;
  } else if (isExecutorsPage) {
    page = <ExecutorsPage />;
  } else {
    page = <HomePage posts={posts} loading={loading} error={error} />;
  }

  return (
    <>
      {adBlockStatus === 'clear' ? (
        <>
          <SideAdRails />
          {page}
        </>
      ) : null}
      <AdBlockGate status={adBlockStatus} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
