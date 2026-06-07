(() => {
  const hiddenExecutors = new Set(['solara']);
  const executorPatches = {
    velocity: {
      title: 'velocity',
      badge: 'Velocity',
      tone: 'Velocity executor download',
      downloadUrl: 'https://velocity-executor.com/download/',
      previewUrl: 'https://img.youtube.com/vi/ubSyv_0p9e8/maxresdefault.jpg',
      fallbackUrl: 'https://img.youtube.com/vi/ubSyv_0p9e8/hqdefault.jpg',
      ariaLabel: 'Download Velocity executor',
    },
    madium: {
      title: 'madium',
      badge: 'Free',
      tone: 'Free executor client download',
      downloadUrl: 'https://filerift.com/file/w3Zpjdoc10',
      previewUrl: 'https://img.youtube.com/vi/Ds3tkKpDuiU/maxresdefault.jpg',
      fallbackUrl: 'https://img.youtube.com/vi/Ds3tkKpDuiU/hqdefault.jpg',
      ariaLabel: 'Download Madium executor',
    },
    xeno: {
      title: 'xeno',
      badge: 'Xeno',
      tone: 'Xeno executor download',
      downloadUrl: 'https://wearedevs.net/d/Xeno',
      previewUrl: 'https://img.youtube.com/vi/J-aI6tVNXXA/maxresdefault.jpg',
      fallbackUrl: 'https://img.youtube.com/vi/J-aI6tVNXXA/hqdefault.jpg',
      ariaLabel: 'Download Xeno executor',
    },
  };

  let observer;
  let observerTimer;

  function injectExecutorStyles() {
    if (document.getElementById('executor-card-patch-styles')) return;

    const style = document.createElement('style');
    style.id = 'executor-card-patch-styles';
    style.textContent = `
      .executorCard.hasExecutorPreview {
        cursor: pointer;
      }

      .executorCard.hasExecutorPreview .executorPoster {
        background: #050814;
      }

      .executorCard.hasExecutorPreview .executorPoster::before {
        z-index: 1;
        inset: 0;
        background: linear-gradient(180deg, transparent 45%, rgba(4, 7, 13, 0.88));
        transform: none;
      }

      .executorCard.hasExecutorPreview .executorPoster img {
        position: absolute;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .executorCard.hasExecutorPreview .executorPoster svg {
        display: none;
      }

      .executorCard.hasExecutorPreview .executorPoster span {
        z-index: 2;
      }
    `;
    document.head.appendChild(style);
  }

  function getCardTitle(card) {
    return card?.querySelector('.executorBody h2')?.textContent?.trim().toLowerCase() || '';
  }

  function getPatchForCard(card) {
    const title = getCardTitle(card);
    return Object.values(executorPatches).find((patch) => patch.title === title);
  }

  function getPatchedCard(target) {
    const card = target?.closest?.('.executorCard');
    const patch = getPatchForCard(card);
    return patch ? { card, patch } : null;
  }

  function openExecutor(patch) {
    window.open(patch.downloadUrl, '_blank', 'noopener,noreferrer');
  }

  function bindCardClick(card, patch) {
    if (card.dataset.executorClickBound === patch.title) return;

    card.dataset.executorClickBound = patch.title;
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', patch.ariaLabel);

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openExecutor(patch);
    });
  }

  function patchExecutorCard(card, patch) {
    card.classList.add('hasExecutorPreview', `has-${patch.title}-preview`);
    bindCardClick(card, patch);

    const poster = card.querySelector('.executorPoster');
    if (poster) {
      let image = poster.querySelector(`[data-executor-preview="${patch.title}"]`);
      if (!image) {
        image = document.createElement('img');
        image.alt = '';
        image.loading = 'eager';
        image.dataset.executorPreview = patch.title;
        image.addEventListener('error', () => {
          if (!image.src.includes('/hqdefault.jpg')) image.src = patch.fallbackUrl;
        });
        poster.prepend(image);
      }
      if (image.src !== patch.previewUrl) image.src = patch.previewUrl;
    }

    const badge = poster?.querySelector('span');
    if (badge && badge.textContent.trim() !== patch.badge) badge.textContent = patch.badge;

    const tone = card.querySelector('.executorBody p');
    if (tone && tone.textContent !== patch.tone) tone.textContent = patch.tone;

    const link = card.querySelector('.executorBody a');
    if (link) {
      link.href = patch.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  function patchExecutorCards() {
    injectExecutorStyles();
    const patchedTitles = new Set();

    document.querySelectorAll('.executorCard').forEach((card) => {
      const title = getCardTitle(card);
      if (hiddenExecutors.has(title)) {
        card.remove();
        return;
      }

      const patch = getPatchForCard(card);
      if (!patch) return;
      patchExecutorCard(card, patch);
      patchedTitles.add(patch.title);
    });

    return patchedTitles.size === Object.keys(executorPatches).length;
  }

  function stopWatching() {
    observer?.disconnect();
    observer = undefined;
    if (observerTimer) window.clearTimeout(observerTimer);
    observerTimer = undefined;
  }

  function watchForExecutorCards() {
    stopWatching();
    if (!window.location.pathname.includes('executors')) return;
    if (patchExecutorCards()) return;

    observer = new MutationObserver(() => {
      if (patchExecutorCards()) stopWatching();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    observerTimer = window.setTimeout(stopWatching, 15000);
  }

  function start() {
    document.addEventListener(
      'click',
      (event) => {
        const result = getPatchedCard(event.target);
        if (!result) return;

        event.preventDefault();
        event.stopPropagation();
        patchExecutorCard(result.card, result.patch);
        openExecutor(result.patch);
      },
      true,
    );

    watchForExecutorCards();
    window.setTimeout(watchForExecutorCards, 600);
    window.addEventListener('popstate', () => window.setTimeout(watchForExecutorCards, 80));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
