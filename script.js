document.documentElement.classList.add('js-ready');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const navigationLinks = document.querySelectorAll('.nav-links a');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isExpanded));
  menuButton.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
  navigation?.classList.toggle('is-open', !isExpanded);
  document.body.classList.toggle('menu-open', !isExpanded);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 680) closeMenu();
});

const heroSlides = [...document.querySelectorAll('.hero__slide')];
const currentSlideLabel = document.querySelector('.slide-current');
let heroIndex = 0;
let parallaxFrame = 0;

function showHeroSlide(index) {
  if (!heroSlides.length) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === heroIndex);
  });
  if (currentSlideLabel) currentSlideLabel.textContent = String(heroIndex + 1).padStart(2, '0');
}

document.querySelector('.hero-prev')?.addEventListener('click', () => showHeroSlide(heroIndex - 1));
document.querySelector('.hero-next')?.addEventListener('click', () => showHeroSlide(heroIndex + 1));
if (!reducedMotion && heroSlides.length > 1) {
  window.setInterval(() => showHeroSlide(heroIndex + 1), 6500);
}

if (!reducedMotion) {
  window.addEventListener('scroll', () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.06, 36);
      heroSlides.forEach((slide) => {
        slide.style.backgroundPosition = `center calc(53% + ${offset}px)`;
      });
      parallaxFrame = 0;
    });
  }, { passive: true });
}

const reviewSlides = [...document.querySelectorAll('.review-slide')];
const reviewDots = [...document.querySelectorAll('.review-dots button')];
let reviewIndex = 0;

function showReview(index) {
  if (!reviewSlides.length) return;
  reviewIndex = (index + reviewSlides.length) % reviewSlides.length;
  reviewSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === reviewIndex;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  reviewDots.forEach((dot, dotIndex) => {
    const active = dotIndex === reviewIndex;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-pressed', String(active));
  });
}

document.querySelector('.review-prev')?.addEventListener('click', () => showReview(reviewIndex - 1));
document.querySelector('.review-next')?.addEventListener('click', () => showReview(reviewIndex + 1));
reviewDots.forEach((dot, index) => dot.addEventListener('click', () => showReview(index)));
showReview(0);
if (!reducedMotion && reviewSlides.length > 1) {
  window.setInterval(() => showReview(reviewIndex + 1), 8000);
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && !reducedMotion) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      const suffix = target.dataset.suffix || '';
      const start = performance.now();
      const duration = 1100;

      function updateCount(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        target.textContent = `${Math.round(finalValue * eased)}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(updateCount);
      }

      window.requestAnimationFrame(updateCount);
      observer.unobserve(target);
    });
  }, { threshold: 0.65 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    counter.textContent = `${counter.dataset.count}${counter.dataset.suffix || ''}`;
  });
}

const serviceSelect = document.querySelector('#appointment-form select[name="service"]');
document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('click', () => {
    const requestedService = card.dataset.service;
    if (!serviceSelect || !requestedService) return;
    const option = [...serviceSelect.options].find((item) => item.text === requestedService);
    if (option) serviceSelect.value = option.value;
  });
});

function configureDemoForm(form, successMessage) {
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !successMessage) return;
    successMessage.hidden = false;
    successMessage.focus();
    form.reset();
  });
}

configureDemoForm(
  document.querySelector('#appointment-form'),
  document.querySelector('#form-success')
);
configureDemoForm(
  document.querySelector('#contact-form'),
  document.querySelector('#contact-success')
);

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const loader = document.querySelector('.loader');
window.addEventListener('load', () => {
  window.setTimeout(() => loader?.classList.add('is-hidden'), 250);
});
window.setTimeout(() => loader?.classList.add('is-hidden'), 1800);
