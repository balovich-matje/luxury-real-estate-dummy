gsap.registerPlugin(ScrollTrigger);

/* ── Video scroll-scrub ── */
const videoBg = document.querySelector('.video-bg');

function initVideoScrub() {
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    scrub: 1,
    onUpdate: (self) => {
      const t = self.progress * videoBg.duration;
      // fastSeek snaps to nearest keyframe — much cheaper than precise seeking
      if (videoBg.fastSeek) {
        videoBg.fastSeek(t);
      } else {
        videoBg.currentTime = t;
      }
    }
  });
}

if (videoBg.readyState >= 1) {
  initVideoScrub();
} else {
  videoBg.addEventListener('loadedmetadata', initVideoScrub, { once: true });
}

/* ── Hero entrance ── */
gsap.set(['.hero__eyebrow', '.hero__headline', '.hero__sub'], { opacity: 0, y: 32 });
gsap.set('.hero__scroll', { opacity: 0 });

const heroTl = gsap.timeline({ delay: 0.4 });
heroTl
  .to('.hero__eyebrow',  { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' })
  .to('.hero__headline', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.65')
  .to('.hero__sub',      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, '-=0.75')
  .to('.hero__scroll',   { opacity: 1,        duration: 0.8, ease: 'power2.out' }, '-=0.4');

/* ── Feature scroll-reveals (asymmetric, directional) ── */
document.querySelectorAll('[data-reveal]').forEach((el) => {
  const dir   = el.dataset.reveal;
  const xFrom = dir === 'left' ? -70 : 70;

  gsap.fromTo(el,
    { opacity: 0, x: xFrom },
    {
      opacity: 1,
      x: 0,
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger:       el,
        start:         'top 82%',
        end:           'top 40%',
        toggleActions: 'play none none none',
      }
    }
  );
});

/* ── Contact section entrance ── */
gsap.fromTo('.contact__grid > *',
  { opacity: 0, y: 48 },
  {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.18,
    scrollTrigger: {
      trigger:       '.contact',
      start:         'top 78%',
      toggleActions: 'play none none none',
    }
  }
);

/* ── Form logic ── */
const form     = document.getElementById('contactForm');
const nameInp  = document.getElementById('inp-name');
const phoneInp = document.getElementById('inp-phone');
const success  = document.getElementById('formSuccess');

function mark(fieldId, invalid) {
  const field = document.getElementById(fieldId);
  const input = field.querySelector('input');
  field.classList.toggle('has-error', invalid);
  input.classList.toggle('is-error', invalid);
}

function validate() {
  let ok = true;
  if (!nameInp.value.trim()) {
    mark('fieldName', true); ok = false;
  }
  const digits = phoneInp.value.replace(/\D/g, '');
  if (digits.length < 10) {
    mark('fieldPhone', true); ok = false;
  }
  return ok;
}

nameInp.addEventListener('input',  () => mark('fieldName',  false));
phoneInp.addEventListener('input', () => mark('fieldPhone', false));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;
  Array.from(form.children).forEach(child => {
    if (child !== success) child.style.display = 'none';
  });
  success.style.display = 'block';
});
