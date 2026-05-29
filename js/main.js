"use strict";

/**
 * ── Helper: Get Nav Height ──────────────────────────────────────────
 * Centralizes the offset logic for both scroll reveal and anchor links.
 */
function getNavOffset() {
  var nav = document.querySelector('nav');
  return nav ? nav.offsetHeight : 64;
}

// ── Nav scroll background ──────────────────────────────────────────
var nav = document.querySelector('nav');
if (nav) {
  var onScroll = function() {
    // Adds 'scrolled' class after 20px of movement
    window.scrollY > 20 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile Menu Logic ─────────────────────────────────────────────
var toggle = document.querySelector('.nav-toggle');
var navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  var closeMenu = function() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    var bars = toggle.querySelectorAll('span');
    for (var i = 0; i < bars.length; i++) bars[i].removeAttribute('style');
  };

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    var bars = toggle.querySelectorAll('span');
    
    if (isOpen && bars.length >= 3) {
      bars[0].style.cssText = 'transform:rotate(45deg) translate(4px,4px)';
      bars[1].style.opacity = '0';
      bars[2].style.cssText = 'transform:rotate(-45deg) translate(4px,-4px)';
    } else {
      closeMenu();
    }
  });

  // Close menu when clicking links or anywhere outside
  document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  var links = navLinks.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', closeMenu);
  }
}

// ── Scroll Reveal (Fade-in animations) ─────────────────────────────
if ('IntersectionObserver' in window) {
  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  var revealEls = document.querySelectorAll('.reveal');
  for (var i = 0; i < revealEls.length; i++) {
    revealEls[i].setAttribute('data-delay', String(i * 60));
    revealObs.observe(revealEls[i]);
  }
}

// ── Counter Animation ──────────────────────────────────────────────
function animateCounter(el, target, suffix, prefix, decimals) {
  var duration = 1600;
  var start = performance.now();
  var easeOut = function(t) { return 1 - Math.pow(1 - t, 3); };
  
  function tick(now) {
    var p = Math.min((now - start) / duration, 1);
    var val = (target * easeOut(p)).toFixed(decimals || 0);
    el.textContent = (prefix || '') + val + (suffix || '');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window) {
  var counterObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        animateCounter(
          el,
          parseFloat(el.getAttribute('data-count') || '0'),
          el.getAttribute('data-suffix'),
          el.getAttribute('data-prefix'),
          parseInt(el.getAttribute('data-decimals'), 10)
        );
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  var countEls = document.querySelectorAll('[data-count]');
  for (var i = 0; i < countEls.length; i++) counterObs.observe(countEls[i]);
}

// ── Contact Form Mockup ────────────────────────────────────────────
var form = document.querySelector('#contact-form');
var formSuccess = document.querySelector('#form-success');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
    setTimeout(function() {
      form.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    }, 900);
  });
}

// ── ROBUST ANCHOR SCROLL ───────────────────────────────────────────
var anchors = document.querySelectorAll('a[href^="#"]');
for (var i = 0; i < anchors.length; i++) {
  anchors[i].addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;

    // Use try/catch because querySelector fails on IDs starting with numbers
    try {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        var offset = getNavOffset() + 20;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - offset;

        // Check if browser supports smooth scroll object
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // Legacy fallback
          window.scrollTo(0, offsetPosition);
        }
      }
    } catch (err) {
      console.error("Link target not found or invalid ID selector:", href);
    }
  });
}
