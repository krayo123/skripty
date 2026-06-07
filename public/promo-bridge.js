(() => {
  const allowedPaths = new Set(['/', '/executors', '/executors/']);
  const offerUrl = 'https://www.effectivecpmnetwork.com/zpgbszxrzc?key=d1ab8a6a326be7a2a730e58642a92eb3';
  const promoId = 'krayo-promo-bridge';

  if (!allowedPaths.has(window.location.pathname)) {
    return;
  }

  function buildPromo() {
    const promo = document.createElement('a');
    promo.id = promoId;
    promo.className = 'promoBridge';
    promo.href = offerUrl;
    promo.target = '_blank';
    promo.rel = 'noopener noreferrer sponsored';
    promo.setAttribute('aria-label', 'Open sponsored scripts offer');
    promo.innerHTML = `
      <span class="promoBridgeCopy">
        <span class="promoBridgeLabel">Sponsored</span>
        <strong>Looking for more scripts?</strong>
        <span>Explore additional offers selected for your visit.</span>
      </span>
      <span class="promoBridgeAction">Get more scripts here</span>
    `;
    return promo;
  }

  function placePromo() {
    if (document.getElementById(promoId)) {
      return true;
    }

    const anchor = document.querySelector('.adStrip');

    if (!anchor) {
      return false;
    }

    anchor.insertAdjacentElement('afterend', buildPromo());
    return true;
  }

  if (placePromo()) {
    return;
  }

  const observer = new MutationObserver(() => {
    if (placePromo()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 8000);
})();
