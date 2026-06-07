(() => {
  const darkSurface = '#070b12';
  const frameSelector = 'iframe.adSlot';
  const safeSandbox = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms';

  function darkenSrcDoc(srcDoc) {
    if (!srcDoc) return srcDoc;

    let nextSrcDoc = srcDoc.replace(
      'html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }',
      `html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: ${darkSurface}; color-scheme: dark; }`,
    );

    if (nextSrcDoc === srcDoc && !srcDoc.includes('color-scheme: dark')) {
      nextSrcDoc = srcDoc.replace(
        '</style>',
        `\n      html, body, iframe { background: ${darkSurface} !important; color-scheme: dark; }\n    </style>`,
      );
    }

    return nextSrcDoc;
  }

  function repairAdFrame(frame) {
    if (frame.dataset.krayoAdFrameFixed === 'true') return;

    frame.dataset.krayoAdFrameFixed = 'true';
    frame.style.backgroundColor = darkSurface;
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('sandbox', safeSandbox);

    const srcDoc = frame.getAttribute('srcdoc');
    if (srcDoc) {
      frame.setAttribute('srcdoc', darkenSrcDoc(srcDoc));
    }
  }

  function scanAdFrames() {
    document.querySelectorAll(frameSelector).forEach(repairAdFrame);
  }

  function start() {
    scanAdFrames();
    window.setTimeout(scanAdFrames, 500);
    window.setTimeout(scanAdFrames, 1500);

    const observer = new MutationObserver(scanAdFrames);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();
