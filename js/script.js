// /Users/mahekiphone/frontend-website/js/script.js
// Lightweight, defensive site scripts: nav toggle, smooth scroll, theme, form validation, gallery modal, back-to-top.

(() => {
    // Helpers
    const el = (s, ctx = document) => ctx.querySelector(s);
    const elAll = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
    const on = (target, ev, fn) => { if (target) target.addEventListener(ev, fn); };
    const debounce = (fn, wait = 100) => {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
    };

    // NAV TOGGLE (hamburger)
    const initNavToggle = () => {
        const btn = el('#navToggle') || el('.nav-toggle');
        const nav = el('#nav') || el('.nav') || el('.site-nav');
        if (!btn || !nav) return;
        on(btn, 'click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('open');
        });
    };

    // SMOOTH SCROLL for internal anchors
    const initSmoothScroll = () => {
        const links = elAll('a[href^="#"]:not([href="#"])');
        links.forEach(a => {
            on(a, 'click', e => {
                const href = a.getAttribute('href');
                const target = document.getElementById(href.slice(1));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // close nav if open (mobile)
                const nav = el('#nav') || el('.nav') || el('.site-nav');
                const btn = el('#navToggle') || el('.nav-toggle');
                if (nav && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    };

    // THEME TOGGLE with localStorage
    const initThemeToggle = () => {
        const btn = el('#themeToggle') || el('.theme-toggle');
        if (!btn) return;
        const key = 'site-theme';
        const setTheme = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem(key, t);
            btn.setAttribute('aria-pressed', String(t === 'dark'));
        };
        const saved = localStorage.getItem(key);
        if (saved) setTheme(saved);
        on(btn, 'click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    };

    // SIMPLE FORM VALIDATION (contact form)
    const initFormValidation = () => {
        const form = el('#contactForm') || el('.contact-form');
        if (!form) return;
        const showError = (input, msg) => {
            let err = input.parentElement.querySelector('.field-error');
            if (!err) {
                err = document.createElement('div');
                err.className = 'field-error';
                input.parentElement.appendChild(err);
            }
            err.textContent = msg;
            input.setAttribute('aria-invalid', 'true');
        };
        const clearError = (input) => {
            const err = input.parentElement.querySelector('.field-error');
            if (err) err.remove();
            input.removeAttribute('aria-invalid');
        };
        const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        on(form, 'submit', (e) => {
            let valid = true;
            e.preventDefault();
            const required = elAll('[required]', form);
            required.forEach(inp => {
                clearError(inp);
                if (!inp.value.trim()) {
                    showError(inp, 'This field is required');
                    valid = false;
                } else if (inp.type === 'email' && !isEmail(inp.value.trim())) {
                    showError(inp, 'Enter a valid email');
                    valid = false;
                }
            });
            if (!valid) return;
            // If you have a submit endpoint, replace below with fetch/XHR.
            form.submit();
        });
    };

    // GALLERY / IMAGE MODAL
    const initGalleryModal = () => {
        const items = elAll('.gallery-item img, .gallery img');
        const modal = el('#modal') || (() => {
            const m = document.createElement('div');
            m.id = 'modal';
            m.className = 'image-modal';
            m.innerHTML = '<div class="modal-backdrop" tabindex="-1"><div class="modal-content"><img alt=""><button class="modal-close" aria-label="Close">&times;</button></div></div>';
            document.body.appendChild(m);
            return m;
        })();
        const modalImg = el('img', modal);
        const closeBtn = el('.modal-close', modal);
        const backdrop = el('.modal-backdrop', modal);

        const open = (src, alt = '') => {
            modalImg.src = src;
            modalImg.alt = alt;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            backdrop.focus();
        };
        const close = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            modalImg.src = '';
        };

        items.forEach(img => {
            on(img, 'click', () => open(img.src, img.alt || ''));
            img.style.cursor = 'zoom-in';
        });
        on(closeBtn, 'click', close);
        on(backdrop, 'click', (e) => { if (e.target === backdrop) close(); });
        on(window, 'keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
    };

    // BACK TO TOP button
    const initBackToTop = () => {
        const btn = el('#backToTop') || (() => {
            const b = document.createElement('button');
            b.id = 'backToTop';
            b.className = 'back-to-top';
            b.type = 'button';
            b.setAttribute('aria-label', 'Back to top');
            b.innerHTML = '↑';
            document.body.appendChild(b);
            return b;
        })();
        btn.style.display = 'none';
        on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        const toggle = () => {
            btn.style.display = window.scrollY > 300 ? 'block' : 'none';
        };
        on(window, 'scroll', debounce(toggle, 50));
        toggle();
    };

    // INIT on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initNavToggle();
        initSmoothScroll();
        initThemeToggle();
        initFormValidation();
        initGalleryModal();
        initBackToTop();
    });
})();