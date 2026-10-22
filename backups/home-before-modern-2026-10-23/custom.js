(function () {
    var header = document.getElementById('siteHeader');
    var toggle = document.getElementById('headerToggle');
    var nav = document.getElementById('primaryNav');
    var placeholder = null;
    var overlay = null;
    var navHome = null;
    var mobileMq = window.matchMedia('(max-width: 991px)');

    if (header) {
        placeholder = document.createElement('div');
        placeholder.className = 'site-header-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        header.parentNode.insertBefore(placeholder, header);

        var ticking = false;

        // Reserve the full (unscrolled) header height so the page never jumps
        // when the top bar collapses on scroll.
        function measureHeader() {
            var scrolled = header.classList.contains('is-scrolled');
            header.classList.add('is-measuring');
            if (scrolled) header.classList.remove('is-scrolled');
            placeholder.style.height = header.offsetHeight + 'px';
            if (scrolled) header.classList.add('is-scrolled');
            void header.offsetHeight;
            header.classList.remove('is-measuring');
        }

        // Full-size header at the very top; compact floating bar once scrolled.
        function syncHeader() {
            ticking = false;
            var y = window.scrollY;
            var scrolled = header.classList.contains('is-scrolled');
            if (!scrolled && y > 40) {
                header.classList.add('is-scrolled');
            } else if (scrolled && y < 8) {
                header.classList.remove('is-scrolled');
            }
        }

        measureHeader();
        syncHeader();
        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(syncHeader);
            }
        }, { passive: true });
        window.addEventListener('resize', measureHeader);
        window.addEventListener('load', measureHeader);
    }

    if (nav) {
        navHome = { parent: nav.parentNode, next: nav.nextSibling };
        overlay = document.createElement('div');
        overlay.className = 'header-nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }

    function placeNavForViewport() {
        if (!nav || !navHome) return;
        if (mobileMq.matches) {
            if (nav.parentNode !== document.body) {
                document.body.appendChild(nav);
            }
        } else if (nav.parentNode === document.body) {
            if (navHome.next && navHome.next.parentNode === navHome.parent) {
                navHome.parent.insertBefore(nav, navHome.next);
            } else {
                navHome.parent.appendChild(nav);
            }
        }
    }

    placeNavForViewport();

    function closeNav() {
        if (!nav || !toggle) return;
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        document.documentElement.classList.remove('nav-open');
        if (overlay) overlay.classList.remove('is-open');
        var dropdown = nav.querySelector('.header-nav__dropdown');
        var dropdownToggle = nav.querySelector('.header-nav__toggle');
        if (dropdown) dropdown.classList.remove('is-open');
        if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
    }

    function openNav() {
        if (!nav || !toggle) return;
        placeNavForViewport();
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
        document.documentElement.classList.add('nav-open');
        if (overlay) overlay.classList.add('is-open');
    }

    if (toggle && nav) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (nav.classList.contains('is-open')) {
                closeNav();
            } else {
                openNav();
            }
        });
    }

    var dropdown = nav ? nav.querySelector('.header-nav__dropdown') : null;
    if (dropdown) {
        var dropdownToggle = dropdown.querySelector('.header-nav__toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function (e) {
                if (mobileMq.matches) {
                    e.preventDefault();
                    e.stopPropagation();
                    var open = dropdown.classList.toggle('is-open');
                    dropdownToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                }
            });
        }
    }

    if (nav) {
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (mobileMq.matches) {
                    closeNav();
                }
            });
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }

    function onViewportChange() {
        placeNavForViewport();
        if (!mobileMq.matches) {
            closeNav();
        }
    }

    if (typeof mobileMq.addEventListener === 'function') {
        mobileMq.addEventListener('change', onViewportChange);
    } else if (typeof mobileMq.addListener === 'function') {
        mobileMq.addListener(onViewportChange);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });
})();

(function () {
    if (typeof Swiper === 'undefined') return;

    var portfolioEl = document.querySelector('.index-sec6__swiper');
    if (portfolioEl) {
        new Swiper(portfolioEl, {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            speed: 500,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            coverflowEffect: {
                rotate: 0,
                stretch: -40,
                depth: 180,
                modifier: 1.4,
                slideShadows: false
            },
            navigation: {
                nextEl: '.index-sec6__nav--next',
                prevEl: '.index-sec6__nav--prev'
            }
        });
    }

    var testiEl = document.querySelector('.index-sec7__swiper');
    if (testiEl) {
        new Swiper(testiEl, {
            effect: 'fade',
            fadeEffect: { crossFade: true },
            loop: true,
            speed: 450,
            pagination: {
                el: '.index-sec7__dots',
                clickable: true
            },
            navigation: {
                nextEl: '.index-sec7__btn--down',
                prevEl: '.index-sec7__btn--up'
            }
        });
    }
})();

(function () {
    // Buttons whose icon slides to the opposite side on hover.
    var buttons = [
        ['.header-cta', '.header-cta__arrow'],
        ['.banner-chat-btn', '.banner-chat-btn__icon'],
        ['.home-index2__chat', '.home-index2__chat-icon'],
        ['.home-index3__chat', '.home-index3__chat-icon'],
        ['.home-index4__chat', '.home-index4__chat-icon'],
        ['.index-sec9__submit', '.index-sec9__submit-icon'],
        ['.get-started-modal__submit', '.get-started-modal__submit-icon'],
        ['.why-item__link', ':scope > span']
    ];

    function measure(btn) {
        var text = btn._swapText;
        var icon = btn._swapIcon;
        var width = btn.clientWidth;
        if (!width) return;
        btn.style.setProperty('--swap-icon', (width - 2 * icon.offsetLeft - icon.offsetWidth) + 'px');
        btn.style.setProperty('--swap-text', (width - 2 * text.offsetLeft - text.offsetWidth) + 'px');
    }

    function setup(btn, iconSelector) {
        var icon = btn.querySelector(iconSelector);
        if (!icon || btn._swapIcon) return;

        // Wrap the label in one element so it moves as a block.
        var text = document.createElement('span');
        Array.prototype.slice.call(btn.childNodes).forEach(function (node) {
            if (node !== icon) text.appendChild(node);
        });
        btn.insertBefore(text, btn.firstChild);

        text.classList.add('btn-swap__text');
        icon.classList.add('btn-swap__icon');
        btn.classList.add('btn-swap');
        if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';

        btn._swapText = text;
        btn._swapIcon = icon;
        btn.addEventListener('mouseenter', function () { measure(btn); });
        btn.addEventListener('focus', function () { measure(btn); });
        measure(btn);
    }

    buttons.forEach(function (pair) {
        document.querySelectorAll(pair[0]).forEach(function (btn) {
            setup(btn, pair[1]);
        });
    });

    window.addEventListener('resize', function () {
        document.querySelectorAll('.btn-swap').forEach(measure);
    });
})();

(function () {
    // Service cards start straight and tilt into place as they scroll into view.
    var cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach(function (card) { card.style.setProperty('--tilt-p', '1'); });
        return;
    }

    var ticking = false;

    function update() {
        ticking = false;
        var vh = window.innerHeight;
        var start = vh * 0.95;  // card centre near the bottom of the screen: straight
        var end = vh * 0.5;     // card centre at mid-screen: fully tilted
        cards.forEach(function (card) {
            var r = card.getBoundingClientRect();
            var centre = r.top + r.height / 2;
            var p = Math.min(1, Math.max(0, (start - centre) / (start - end)));
            p = p * p * (3 - 2 * p);
            card.style.setProperty('--tilt-p', p.toFixed(3));
        });
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    // Place the cards before enabling the transition so nothing animates on load.
    update();
    void document.body.offsetHeight;
    cards.forEach(function (card) { card.classList.add('tilt-ready'); });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
})();

(function () {
    // Scroll reveal: [selector, direction, stagger between siblings (s)]
    var groups = [
        ['.home-index3__head, .home-index4__head, .index-sec5__header, .index-sec6__head, .index-sec7__head, .index-sec8__head, .index-sec9__head, .about-team__head', 'up', 0],
        ['.home-index2__media', 'left', 0],
        ['.home-index2__content', 'right', 0],
        ['.service-card', 'up', 0.12],
        ['.home-index3__actions, .home-index4__actions', 'up', 0],
        ['.why-item--left', 'left', 0.15],
        ['.why-item--right', 'right', 0.15],
        ['.home-index4__center', 'zoom', 0],
        ['.index-sec5__card', 'up', 0.15],
        ['.index-sec6__wrap', 'zoom', 0],
        ['.index-sec7__body', 'up', 0],
        ['.index-sec8__accordion .accordion-item', 'up', 0.1],
        ['.index-sec8__card', 'right', 0],
        ['.index-sec9__form', 'up', 0],
        ['.team-card', 'up', 0.12],
        ['.bes-footer__panel', 'up', 0]
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var pending = [];
    var ticking = false;
    var vh = window.innerHeight;

    // Reveal once an element's top passes 92% of the viewport height
    // (anything scrolled past above is revealed too).
    function check() {
        ticking = false;
        var line = window.innerHeight * 0.92;
        pending = pending.filter(function (el) {
            if (el.getBoundingClientRect().top < line) {
                el.classList.add('is-revealed');
                return false;
            }
            return true;
        });
        if (!pending.length) {
            window.removeEventListener('scroll', requestCheck);
            window.removeEventListener('resize', requestCheck);
        }
    }

    function requestCheck() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(check);
        }
    }

    groups.forEach(function (group) {
        var siblingIndex = new Map();
        document.querySelectorAll(group[0]).forEach(function (el) {
            // Leave anything already on screen alone so nothing blinks out.
            if (el.getBoundingClientRect().top < vh) return;

            var index = siblingIndex.get(el.parentNode) || 0;
            siblingIndex.set(el.parentNode, index + 1);

            el.classList.add('reveal');
            if (group[1] !== 'up') el.classList.add('reveal--' + group[1]);
            if (group[2]) el.style.setProperty('--reveal-delay', Math.min(index * group[2], 0.6) + 's');
            pending.push(el);
        });
    });

    if (pending.length) {
        window.addEventListener('scroll', requestCheck, { passive: true });
        window.addEventListener('resize', requestCheck);
    }
})();

(function () {
    // "How we work" connectors: the dashed arrows draw themselves as you scroll,
    // with the arrowhead riding the tip of the line.
    var images = document.querySelectorAll('img.index-sec5__line');
    if (!images.length) return;

    var NS = 'http://www.w3.org/2000/svg';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var arrows = [];

    function el(name, attrs, parent) {
        var node = document.createElementNS(NS, name);
        Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (parent) parent.appendChild(node);
        return node;
    }

    images.forEach(function (img, i) {
        var w = parseFloat(img.getAttribute('width')) || 476;
        var h = parseFloat(img.getAttribute('height')) || 111;
        // border-arrow1 drops on the left and runs right; border-arrow2 is mirrored.
        var flip = /arrow2/.test(img.getAttribute('src'));
        var x0 = flip ? w - 6 : 6;
        var dir = flip ? -1 : 1;
        var bottom = h - 6;
        var d = 'M' + x0 + ' 13 V' + (bottom - 25) +
            ' Q' + x0 + ' ' + bottom + ' ' + (x0 + 25 * dir) + ' ' + bottom +
            ' H' + (flip ? 8 : w - 8);

        var svg = el('svg', {
            'class': img.className + ' index-sec5__arrow',
            viewBox: '0 0 ' + w + ' ' + h,
            width: w,
            height: h,
            'aria-hidden': 'true',
            focusable: 'false'
        });
        var maskId = 'sec5-arrow-mask-' + i;
        var mask = el('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: w, height: h }, el('defs', {}, svg));
        var reveal = el('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 8 }, mask);

        el('polygon', { points: (x0 - 6) + ',0 ' + (x0 + 6) + ',0 ' + x0 + ',11', 'class': 'index-sec5__arrow-start' }, svg);
        var line = el('path', { d: d, 'class': 'index-sec5__arrow-line', mask: 'url(#' + maskId + ')' }, svg);
        var head = el('polygon', { points: '-11,-6 3,0 -11,6', 'class': 'index-sec5__arrow-head' }, svg);

        img.parentNode.replaceChild(svg, img);

        var length;
        try {
            length = line.getTotalLength();
        } catch (e) {
            length = (bottom - 38) + 36 + (w - 47);
        }
        reveal.setAttribute('stroke-dasharray', length + ' ' + length);
        arrows.push({ svg: svg, reveal: reveal, line: line, head: head, length: length, p: -1 });
    });

    function draw(arrow, p) {
        if (Math.abs(arrow.p - p) < 0.001) return;
        arrow.p = p;
        arrow.reveal.setAttribute('stroke-dashoffset', arrow.length * (1 - p));
        var at = Math.max(0.5, arrow.length * p);
        var tip = arrow.line.getPointAtLength(at);
        var back = arrow.line.getPointAtLength(Math.max(0, at - 2));
        var angle = Math.atan2(tip.y - back.y, tip.x - back.x) * 180 / Math.PI;
        arrow.head.setAttribute('transform', 'translate(' + tip.x + ' ' + tip.y + ') rotate(' + angle + ')');
        arrow.head.style.opacity = p > 0.02 ? 1 : 0;
        arrow.svg.classList.toggle('is-drawn', p >= 1);
    }

    var ticking = false;

    function update() {
        ticking = false;
        var vh = window.innerHeight;
        arrows.forEach(function (arrow) {
            if (reduceMotion) { draw(arrow, 1); return; }
            var r = arrow.svg.getBoundingClientRect();
            if (!r.height) return;
            // Starts drawing as the arrow enters the lower part of the screen,
            // finishes by the time it reaches the middle.
            var p = (vh * 0.85 - r.top) / (vh * 0.4);
            p = Math.min(1, Math.max(0, p));
            draw(arrow, p * p * (3 - 2 * p));
        });
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
})();

(function () {
    // Home hero background video: desktop only, fades in once it can play,
    // pauses while the hero is off screen.
    var media = document.querySelector('.home-banner__media');
    var video = media && media.querySelector('video[data-src]');
    if (!video) return;

    var desktop = window.matchMedia('(min-width: 992px)');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) return;

    var started = false;
    var ticking = false;

    function inView() {
        var r = media.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
    }

    function start() {
        if (started || !desktop.matches) return;
        started = true;
        // Normally already started by the inline script in index.html.
        if (!video.getAttribute('src')) {
            video.addEventListener('playing', function () {
                media.classList.add('is-playing');
            }, { once: true });
            video.src = video.getAttribute('data-src');
            video.load();
        }
        sync();
    }

    function sync() {
        ticking = false;
        if (!started) return;
        if (inView() && desktop.matches) {
            var p = video.play();
            if (p && p.catch) p.catch(function () {});
        } else {
            video.pause();
        }
    }

    function requestSync() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(sync);
        }
    }

    start();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', function () { start(); requestSync(); });
})();
