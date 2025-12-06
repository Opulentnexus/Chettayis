/* ============================
   MOBILE NAVIGATION TOGGLE


/* ============================
   SCROLL ANIMATIONS
============================ */
const animatedElements = document.querySelectorAll("[data-animate]");

function animateOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < triggerBottom) {
            let animation = el.getAttribute("data-animate");
            el.classList.add(animation);
        }
    });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

/* ============================
   SMOOTH SCROLL BEHAVIOR
============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: "smooth"
            });
        }
    });
});

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close menu when clicking a link inside it
document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn'); // your hamburger button

    // if menu is open AND clicked outside menu & button
    if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        navLinks.classList.remove('active');
    }
});





document.addEventListener("DOMContentLoaded", () => {

    // Select ONLY elements inside #services with data-animate
    const serviceAnimations = document.querySelectorAll("#services [data-animate]");

    if (serviceAnimations.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        { threshold: 0.25 } // slightly smoother triggering
    );

    serviceAnimations.forEach((el) => observer.observe(el));
});











document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.gallery-track');
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  const dotsWrap = document.querySelector('.gallery-dots');

  if (!track) return;

  // create slides array (only for horizontal mode)
  const slides = Array.from(track.querySelectorAll('img'));

  // build dots if container exists
  if (dotsWrap) {
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.dataset.index = i;
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        scrollToIndex(i);
      });
      dotsWrap.appendChild(btn);
    });
  }

  function scrollToIndex(i) {
    const slide = slides[i];
    if (!slide) return;
    // center the slide in the track
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const offset = (slideRect.left + slideRect.width/2) - (trackRect.left + trackRect.width/2);
    track.scrollBy({ left: offset, behavior: 'smooth' });
    updateDots(i);
  }

  function updateDots(activeIndex) {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('button').forEach((b, idx) => {
      b.classList.toggle('active', idx === activeIndex);
    });
  }

  // prev/next handlers (move one slide at a time)
  if (prev && next) {
    prev.addEventListener('click', () => {
      // find center-most visible slide
      const centerIndex = findCenteredSlide();
      scrollToIndex(Math.max(0, centerIndex - 1));
    });
    next.addEventListener('click', () => {
      const centerIndex = findCenteredSlide();
      scrollToIndex(Math.min(slides.length - 1, centerIndex + 1));
    });
  }

  function findCenteredSlide() {
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;
    let bestIdx = 0, bestDist = Infinity;
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const dist = Math.abs(slideCenter - centerX);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    return bestIdx;
  }

  // update dots on user scroll (debounced)
  let scrollTimer = null;
  track.addEventListener('scroll', () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = findCenteredSlide();
      updateDots(idx);
    }, 120);
  });

  // optional: keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next?.click();
    if (e.key === 'ArrowLeft') prev?.click();
  });
});












// ===== Gallery scroll-trigger animation (works for horizontal & vertical scroll) =====
document.addEventListener('DOMContentLoaded', function () {
  const imgs = document.querySelectorAll('.gallery-track img');

  if (!imgs.length) return;

  // If IntersectionObserver not supported, reveal all
  if (!('IntersectionObserver' in window)) {
    imgs.forEach((img, i) => {
      img.classList.add('in-view');
      img.style.setProperty('--delay', `${i * 35}ms`);
    });
    return;
  }

  // Observer options: trigger when ~30% of the image is visible
  const ioOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.30
  };

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // compute a small stagger based on index to make feel organic
        const slides = Array.from(img.closest('.gallery-track').querySelectorAll('img'));
        const index = slides.indexOf(img);
        const delayMs = Math.min(200, index * 35); // clamp to 200ms max

        img.style.setProperty('--delay', `${delayMs}ms`);
        img.classList.add('in-view');

        // stop observing once revealed (one-time animation)
        observer.unobserve(img);
      }
    });
  }, ioOptions);

  imgs.forEach(img => {
    // For images in a horizontal track, we still observe normally.
    // If the image is already visible (fast load), reveal immediately
    const r = img.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0) {
      // compute index for delay
      const slides = Array.from(img.closest('.gallery-track').querySelectorAll('img'));
      const index = slides.indexOf(img);
      img.style.setProperty('--delay', `${Math.min(200, index * 35)}ms`);
      img.classList.add('in-view');
    } else {
      io.observe(img);
    }
  });

  // Optional: when track is scrolled quickly, update visibility (small debounce)
  const track = document.querySelector('.gallery-track');
  if (track) {
    let t;
    track.addEventListener('scroll', () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        imgs.forEach(img => {
          if (!img.classList.contains('in-view')) {
            // trigger IntersectionObserver check by forcing layout read (no-op)
            img.getBoundingClientRect();
          }
        });
      }, 150);
    }, { passive: true });
  }
});



// ===== Animate gallery heading =====
const galleryTitle = document.querySelector('.gallery-title');

if (galleryTitle) {
  const titleObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        galleryTitle.classList.add('in-view');
        obs.unobserve(galleryTitle);
      }
    });
  }, {
    threshold: 0.2
  });

  titleObserver.observe(galleryTitle);
}




/* reviews-animate.js — reveal heading first, then stagger cards */
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heading = document.querySelector('.reveal-heading');
  const cards = Array.from(document.querySelectorAll('.review-card'));

  // apply per-card delay variable (keeps your CSS transition var(--delay) working)
  cards.forEach((card, i) => {
    const delay = Math.min(250, i * 70);
    card.style.setProperty('--delay', `${delay}ms`);
  });

  // If IO not supported or user prefers reduced motion — reveal everything immediately
  if (!('IntersectionObserver' in window) || prefersReduced) {
    if (heading) heading.classList.add('is-visible');
    cards.forEach((c) => c.classList.add('is-visible'));
    return;
  }

  // function to start observing cards (called after heading visible)
  function startCardsObserver() {
    if (!cards.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12,
    };

    const cardObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = Number(el.getAttribute('data-i') || 0);
          const timeout = Math.min(400, idx * 70 + 80); // small extra offset
          setTimeout(() => el.classList.add('is-visible'), timeout);
          obs.unobserve(el);
        }
      });
    }, observerOptions);

    cards.forEach((c) => cardObserver.observe(c));
  }

  // If heading exists, observe it first; when visible, reveal and then start cards
  if (heading) {
    const headingObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          heading.classList.add('is-visible');
          obs.unobserve(entry.target);
          startCardsObserver();
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 });

    headingObserver.observe(heading);
  } else {
    // no heading found — just start cards observer
    startCardsObserver();
  }
})();
