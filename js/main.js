/**
 * 凜空（link） Official Website - Main JavaScript
 * Features: Scroll reveal animations, sticky header effects, mobile menu toggle,
 * smooth anchor scrolling, contact form validation & feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sticky Header & Scroll Effects ---
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header styling on scroll
    if (header) {
      if (scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --- 2. Mobile Menu (Drawer) Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileMenuOverlay.classList.contains('is-open');
    if (isOpen) {
      menuToggle.classList.add('is-active');
      mobileMenuOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      menuToggle.classList.remove('is-active');
      mobileMenuOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (menuToggle && mobileMenuOverlay) {
    menuToggle.addEventListener('click', () => toggleMenu());

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // --- 3. Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --- 4. Active Navigation Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --- 5. Back to Top Smooth Scroll ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 6. Contact Form Interactive Submission & Validation ---
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast-notification');

  const showToast = (message, duration = 4000) => {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;
    toast.classList.add('is-show');

    setTimeout(() => {
      toast.classList.remove('is-show');
    }, duration);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const messageInput = document.getElementById('user-message');
      const privacyCheck = document.getElementById('user-privacy');
      const submitBtn = contactForm.querySelector('.btn-submit');

      // Validation
      if (!nameInput.value.trim()) {
        showToast('お名前を入力してください。');
        nameInput.focus();
        return;
      }

      if (!emailInput.value.trim() || !emailInput.checkValidity()) {
        showToast('有効なメールアドレスを入力してください。');
        emailInput.focus();
        return;
      }

      if (!messageInput.value.trim()) {
        showToast('お問い合わせ内容を入力してください。');
        messageInput.focus();
        return;
      }

      if (privacyCheck && !privacyCheck.checked) {
        showToast('個人情報保護方針への同意が必要です。');
        privacyCheck.focus();
        return;
      }

      // Simulate loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; display: inline-block;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
        </svg>
        <span>送信中...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('お問い合わせありがとうございます。担当者より折り返しご連絡いたします。', 5000);
      }, 1200);
    });
  }
});

// CSS Keyframes injection for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
