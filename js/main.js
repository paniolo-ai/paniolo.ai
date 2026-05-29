"use strict";

// ── Nav scroll ──────────────────────────────────────────────────────
const nav = document.querySelector('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile hamburger ────────────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    const [b1, b2, b3] = toggle.querySelectorAll('span');
    if (isOpen) {
      if (b1) b1.style.cssText = 'transform:rotate(45deg) translate(4px,4px)';
      if (b2) b2.style.cssText = 'opacity:0;transform:scaleX(0)';
      if (b3) b3.style.cssText = 'transform:rotate(-45deg) translate(4px,-4px)';
    } else {
      toggle.querySelectorAll('span').forEach(b => b.removeAttribute('style'));
    }
  });

  // Close when a link is tapped
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelectorAll('span').forEach(b => b.removeAttribute('style'));
    });
  });

  // Close on outside tap
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelectorAll('span').forEach(b => b.removeAttribute('style'));
    }
  });
}

// ── Scroll reveal ────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = String(i * 60);
  revealObs.observe(el);
});

// ── Counter animation ────────────────────────────────────────────────
function animateCounter(el, target, suffix, prefix, decimals) {
  suffix = suffix || '';
  prefix = prefix || '';
  decimals = decimals || 0;
  const duration = 1600;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = prefix + (target * easeOut(p)).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(
        el,
        parseFloat(el.dataset.count || '0'),
        el.dataset.suffix || '',
        el.dataset.prefix || '',
        parseInt(el.dataset.decimals || '0', 10)
      );
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── Contact form ──────────────────────────────────────────────────────
const form = document.querySelector('#contact-form');
const formSuccess = document.querySelector('#form-success');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
    setTimeout(() => {
      form.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    }, 900);
  });
}

// ── Smooth scroll ─────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = (document.querySelector('nav')?.offsetHeight || 64) + 12;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});
