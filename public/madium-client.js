(() => {
  const madiumDownloadUrl = 'https://filerift.com/file/w3Zpjdoc10';
  const madiumPreviewUrl = 'https://madium.net/assets/images/ss-home.png';
  let observer;
  let observerTimer;

  function injectMadiumStyles() {
    if (document.getElementById('madium-client-styles')) return;

    const style = document.createElement('style');
    style.id = 'madium-client-styles';
    style.textContent = `
      .executorCard.hasMadiumPreview {
        cursor: pointer;
      }

      .executorCard.hasMadiumPreview .executorPoster {
        background: #050814;
      }

      .executorCard.hasMadiumPreview .executorPoster::before {
        z-index: 1;
        inset: 0;
        background: linear-gradient(180deg, transparent 45%, rgba(4, 7, 13, 0.88));
        transform: none;
      }

      .executorCard.hasMadiumPreview .executorPoster img {
        position: absolute;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .executorCard.hasMadiumPreview .executorPoster svg {
        display: none;
      }

      .executorCard.hasMadiumPreview .executorPoster span {
        z-index: 2;
      }
    `;
    document.head.appendChild(style);
  }

  function getMadiumCard(target) {
    const card = target?.closest?.('.executorCard');
    const title = card?.querySelector('.executorBody h2')?.textContent?.trim().toLowerCase();
    return title === 'madium' ? card : null;
  }

  function openMadium() {
    window.open(madiumDownloadUrl, '_blank', 'noopener,noreferrer');
  }

  function bindMadiumCardClick(card) {
    if (card.dataset.madiumClickBound === 'true') return;

    card.dataset.madiumClickBound = 'true';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.setAttribute('aria-label', 'Download Madium executor');

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openMadium();
    });
  }

  function patchMadiumCard() {
    injectMadiumStyles();
    let patched = false;

    document.querySelectorAll('.executorCard').forEach((card) => {
      const title = card.querySelector('.executorBody h2')?.textContent?.trim().toLowerCase();
      if (title !== 'madium') return;

      patched = true;
      card.classList.add('hasMadiumPreview');
      bindMadiumCardClick(card);

      const poster = card.querySelector('.executorPoster');
      if (poster && !poster.querySelector('[data-madium-preview]')) {
        const image = document.createElement('img');
        image.src = madiumPreviewUrl;
        image.alt = '';
        image.loading = 'eager';
        image.dataset.madiumPreview = 'true';
        poster.prepend(image);
      }

      const badge = poster?.querySelector('span');
      if (badge && badge.textContent.trim() !== 'Free') badge.textContent = 'Free';

      const tone = card.querySelector('.executorBody p');
      if (tone && tone.textContent !== 'Free executor client download') {
        tone.textContent = 'Free executor client download';
      }

      const link = card.querySelector('.executorBody a');
      if (link) {
        link.href = madiumDownloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });

    return patched;
  }

  function stopWatching() {
    observer?.disconnect();
    observer = undefined;
    if (observerTimer) window.clearTimeout(observerTimer);
    observerTimer = undefined;
  }

  function watchForMadiumCard() {
    stopWatching();
    if (!window.location.pathname.includes('executors')) return;
    if (patchMadiumCard()) return;

    observer = new MutationObserver(() => {
      if (patchMadiumCard()) stopWatching();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    observerTimer = window.setTimeout(stopWatching, 15000);
  }

  function start() {
    document.addEventListener(
      'click',
      (event) => {
        const card = getMadiumCard(event.target);
        if (!card) return;

        event.preventDefault();
        event.stopPropagation();
        patchMadiumCard();
        openMadium();
      },
      true,
    );

    watchForMadiumCard();
    window.setTimeout(watchForMadiumCard, 600);
    window.addEventListener('popstate', () => window.setTimeout(watchForMadiumCard, 80));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
