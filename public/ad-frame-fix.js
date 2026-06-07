(() => {
  const darkSurface = '#070b12';
  const frameSelector = 'iframe.adSlot';
  const frameCss = `
    html, body {
      margin: 0 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      background: ${darkSurface} !important;
      color-scheme: dark !important;
    }
    body {
      display: grid !important;
      place-items: center !important;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background:
        linear-gradient(135deg, rgba(0, 224, 255, 0.12), transparent 36%),
        linear-gradient(315deg, rgba(255, 42, 141, 0.1), transparent 40%),
        repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 22px);
    }
    iframe, a, img {
      position: relative;
      z-index: 1;
    }
    iframe {
      display: block !important;
      border: 0 !important;
      background: ${darkSurface} !important;
      color-scheme: dark !important;
    }
  `;

  function paintFrame(frame) {
    frame.style.backgroundColor = darkSurface;
    frame.setAttribute('scrolling', 'no');

    try {
      const doc = frame.contentDocument;
      if (!doc) return;

      doc.documentElement.style.backgroundColor = darkSurface;
      if (doc.body) doc.body.style.backgroundColor = darkSurface;

      let style = doc.getElementById('krayo-dark-ad-frame-style');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'krayo-dark-ad-frame-style';
        style.textContent = frameCss;
        (doc.head || doc.documentElement).appendChild(style);
      }
    } catch {
      // The outer frame still keeps the dark fallback after a cross-origin ad loads.
    }
  }

  function watchFrame(frame) {
    if (frame.dataset.krayoDarkened === 'true') return;
    frame.dataset.krayoDarkened = 'true';
    paintFrame(frame);
    frame.addEventListener('load', () => {
      paintFrame(frame);
      window.setTimeout(() => paintFrame(frame), 700);
      window.setTimeout(() => paintFrame(frame), 1800);
    });
  }

  function scanFrames() {
    document.querySelectorAll(frameSelector).forEach(watchFrame);
  }

  function start() {
    scanFrames();
    const observer = new MutationObserver(scanFrames);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();
