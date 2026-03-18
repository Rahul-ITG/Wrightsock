/* ============================================================
   WRIGHTSOCK — MAIN INTERACTIONS
   Sticky nav · Mobile drawer · Variant selectors ·
   Gallery · Sticky ATC · PDP tabs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Navigation ─────────────────────────────────── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── Mobile Nav Drawer ─────────────────────────────────── */
  const hamburger = document.querySelector('.site-nav__hamburger');
  const drawer    = document.querySelector('.site-nav__drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer on link click
    drawer.querySelectorAll('.site-nav__drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Colour Swatch Selectors ───────────────────────────── */
  document.querySelectorAll('.color-swatches').forEach(group => {
    const swatches    = group.querySelectorAll('.color-swatch');
    const labelSpan   = group.closest('.variant-group')?.querySelector('.variant-group__label span');
    const mainImg     = document.getElementById('gallery-main-img') ||
                        document.querySelector('.product-spotlight__img[data-gallery]');

    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');

        // Update label text
        if (labelSpan) {
          labelSpan.textContent = swatch.dataset.color || '';
        }

        // Swap gallery image if data-img is set
        const nextImg = swatch.dataset.img;
        if (mainImg && nextImg) {
          mainImg.classList.add('fade');
          setTimeout(() => {
            mainImg.src = nextImg;
            mainImg.classList.remove('fade');
          }, 180);
        }

        // Update sticky ATC variant text
        const stickyVariant = document.querySelector('.sticky-atc__variant');
        if (stickyVariant) {
          const sizeSelected = document.querySelector('.size-btn.selected');
          const colorText    = swatch.dataset.color || '';
          const sizeText     = sizeSelected ? ` · ${sizeSelected.dataset.size || sizeSelected.textContent.trim()}` : '';
          stickyVariant.textContent = colorText + sizeText;
        }
      });
    });
  });

  /* ── Size Button Selectors ─────────────────────────────── */
  document.querySelectorAll('.size-grid').forEach(group => {
    const btns = group.querySelectorAll('.size-btn:not(.unavailable)');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Update sticky ATC variant text
        const stickyVariant = document.querySelector('.sticky-atc__variant');
        if (stickyVariant) {
          const colorSelected = document.querySelector('.color-swatch.selected');
          const colorText     = colorSelected ? colorSelected.dataset.color || '' : '';
          const sizeText      = btn.dataset.size || btn.textContent.trim();
          stickyVariant.textContent = colorText ? `${colorText} · ${sizeText}` : sizeText;
        }
      });
    });
  });

  /* ── PDP Gallery Thumbnails ────────────────────────────── */
  const galleryMainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery__thumb');

  if (galleryMainImg && thumbs.length) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        const newSrc = thumb.dataset.src;
        if (newSrc) {
          galleryMainImg.classList.add('fade');
          setTimeout(() => {
            galleryMainImg.src = newSrc;
            galleryMainImg.classList.remove('fade');
          }, 180);
        }
      });
    });
  }

  /* ── Sticky ATC Bar (PDP) ──────────────────────────────── */
  const buyArea  = document.getElementById('pdp-buy-area');
  const stickyAtc = document.querySelector('.sticky-atc');

  if (buyArea && stickyAtc) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyAtc.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(buyArea);
  }

  /* ── PDP Tabs ──────────────────────────────────────────── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        }
      });
    });
  }


  /* ── Double Layer Diagram Animation ────────────────────── */
  const dlDiagram = document.getElementById('dl-diagram');
  if (dlDiagram) {
    const dlObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dlDiagram.classList.add('animate');
          dlObserver.unobserve(dlDiagram);
        }
      },
      { threshold: 0.4 }
    );
    dlObserver.observe(dlDiagram);
  }


  /* ── Sock Anatomy Explorer ─────────────────────────────── */
  const hotspots     = document.querySelectorAll('.hotspot[data-anatomy]');
  const anatomyCards = document.querySelectorAll('.anatomy-card[data-anatomy]');

  if (hotspots.length && anatomyCards.length) {
    const activateAnatomy = (index) => {
      hotspots.forEach(h => h.classList.remove('active'));
      anatomyCards.forEach(c => c.classList.remove('active'));

      const hotspot = document.querySelector(`.hotspot[data-anatomy="${index}"]`);
      const card    = document.querySelector(`.anatomy-card[data-anatomy="${index}"]`);

      if (hotspot) hotspot.classList.add('active');
      if (card)    card.classList.add('active');
    };

    hotspots.forEach(spot => {
      spot.addEventListener('click', () => activateAnatomy(spot.dataset.anatomy));
    });

    anatomyCards.forEach(card => {
      card.addEventListener('click', () => activateAnatomy(card.dataset.anatomy));
    });
  }


  /* ── Community Mile Counter (count-up animation) ───────── */
  const counters = document.querySelectorAll('#mile-count, .counter');

  if (counters.length) {
    const animateCounter = (el) => {
      const target   = parseInt(el.dataset.target, 10);
      const duration = 2000; // ms
      const start    = performance.now();

      const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out curve
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.floor(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(c => counterObserver.observe(c));
  }


  /* ── Email Discount Popup ──────────────────────────────── */
  const popup        = document.getElementById('email-popup');
  const popupClose   = document.getElementById('popup-close');
  const popupDismiss = document.getElementById('popup-dismiss');
  const popupForm    = document.getElementById('popup-form');

  if (popup) {
    const POPUP_STORAGE_KEY = 'ws_popup_dismissed';
    const wasDismissed      = sessionStorage.getItem(POPUP_STORAGE_KEY);

    // Show popup after 4 seconds (only once per session)
    if (!wasDismissed) {
      setTimeout(() => {
        popup.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }, 4000);
    }

    const closePopup = () => {
      popup.classList.remove('visible');
      document.body.style.overflow = '';
      sessionStorage.setItem(POPUP_STORAGE_KEY, '1');
    };

    if (popupClose)   popupClose.addEventListener('click', closePopup);
    if (popupDismiss)  popupDismiss.addEventListener('click', closePopup);

    // Close on overlay click (not on popup itself)
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('visible')) {
        closePopup();
      }
    });

    // Simple form submit handler (mockup)
    if (popupForm) {
      popupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const body = popup.querySelector('.popup__body');
        if (body) {
          body.innerHTML = `
            <div style="padding:var(--space-2xl) 0;text-align:center;">
              <p style="font-size:2.5rem;margin-bottom:var(--space-md);">&#10003;</p>
              <p class="popup__title">You're in!</p>
              <p class="popup__subtitle" style="margin-bottom:0;">
                Check your inbox for your <strong style="color:var(--accent)">15% off</strong> code.
              </p>
            </div>
          `;
        }
        setTimeout(closePopup, 2500);
      });
    }
  }

});
