(() => {
  const madiumDownloadUrl = 'https://filerift.com/file/w3Zpjdoc10';
  const madiumPreviewUrl = 'https://madium.net/assets/images/ss-home.png';

  function injectMadiumStyles() {
    if (document.getElementById('madium-client-styles')) return;

    const style = document.createElement('style');
    style.id = 'madium-client-styles';
    style.textContent = `
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

  function patchMadiumCard() {
    injectMadiumStyles();

    document.querySelectorAll('.executorCard').forEach((card) => {
      const title = card.querySelector('.executorBody h2')?.textContent?.trim().toLowerCase();
      if (title !== 'madium') return;

      card.classList.add('hasMadiumPreview');

      const poster = card.querySelector('.executorPoster');
      if (poster && !poster.querySelector('[data-madium-preview]')) {
        const image = document.createElement('img');
        image.src = madiumPreviewUrl;
        image.alt = '';
        image.loading = 'lazy';
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
        if (link.href !== madiumDownloadUrl) link.href = madiumDownloadUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  }

  function schedulePatch() {
    requestAnimationFrame(patchMadiumCard);
    window.setTimeout(patchMadiumCard, 250);
    window.setTimeout(patchMadiumCard, 900);
  }

  function patchExecutorsPage() {
    if (window.location.pathname.includes('executors')) schedulePatch();
  }

  function start() {
    patchExecutorsPage();
    document.addEventListener('click', () => window.setTimeout(patchExecutorsPage, 80));
    window.addEventListener('popstate', () => window.setTimeout(patchExecutorsPage, 80));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
