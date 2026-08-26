(() => {
	'use strict';

	document.getElementById('year').textContent = new Date().getFullYear();

	/* Preloader */
	const preloader = document.getElementById('preloader');
	const PRELOADER_MIN_MS = 700;
	const preloaderStart = Date.now();
	const hidePreloader = () => {
		const wait = Math.max(0, PRELOADER_MIN_MS - (Date.now() - preloaderStart));
		setTimeout(() => {
			if (preloader) preloader.classList.add('is-hidden');
			document.body.classList.remove('is-loading');
			setTimeout(() => { if (preloader) preloader.hidden = true; }, 500);
		}, wait);
	};
	if (document.readyState === 'complete') {
		hidePreloader();
	} else {
		window.addEventListener('load', hidePreloader);
	}

	/* Sticky header (kept simple: border is always on in this theme) */

	/* Mobile nav toggle */
	const nav = document.getElementById('nav');
	const navToggle = document.getElementById('navToggle');
	navToggle.addEventListener('click', () => {
		const open = nav.classList.toggle('open');
		navToggle.setAttribute('aria-expanded', String(open));
	});
	nav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			nav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
		});
	});

	/* Active nav link on scroll */
	const navLinks = document.querySelectorAll('[data-nav]');
	const sections = [...navLinks].map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
	const setActive = (id) => {
		navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
	};
	if ('IntersectionObserver' in window && sections.length) {
		const sectionObserver = new IntersectionObserver(
			(entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }),
			{ rootMargin: '-45% 0px -50% 0px', threshold: 0 }
		);
		sections.forEach((section) => sectionObserver.observe(section));
	}

	/* Reveal on scroll */
	const revealEls = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		const revealObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);
		revealEls.forEach((el) => revealObserver.observe(el));
	} else {
		revealEls.forEach((el) => el.classList.add('is-visible'));
	}

	/* Animated stat counters */
	const counters = document.querySelectorAll('.stat-num');
	const animateCounter = (el) => {
		const target = Number(el.dataset.count || 0);
		const suffix = el.dataset.suffix || '';
		const duration = 1200;
		const start = performance.now();
		const tick = (now) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			el.textContent = Math.round(eased * target) + suffix;
			if (progress < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	};
	if ('IntersectionObserver' in window && counters.length) {
		const counterObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animateCounter(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.6 }
		);
		counters.forEach((el) => counterObserver.observe(el));
	}

	/* Skill "? blocks" toggle (accordion: only one panel open at a time) */
	const skillBlocks = document.querySelectorAll('.skill-block');
	skillBlocks.forEach((btn) => {
		btn.addEventListener('click', () => {
			const panel = document.getElementById(btn.dataset.target);
			if (!panel) return;
			const willOpen = !panel.classList.contains('open');
			skillBlocks.forEach((otherBtn) => {
				const otherPanel = document.getElementById(otherBtn.dataset.target);
				if (!otherPanel || otherPanel === panel) return;
				otherPanel.classList.remove('open');
				otherBtn.setAttribute('aria-expanded', 'false');
			});
			panel.classList.toggle('open', willOpen);
			btn.setAttribute('aria-expanded', String(willOpen));
		});
	});

	/* Experience modal */
	const modalOverlay = document.getElementById('modalOverlay');
	const modalBody = document.getElementById('modalBody');
	const modalClose = document.getElementById('modalClose');
	let lastFocused = null;

	const openModal = (id) => {
		const tpl = document.getElementById(id);
		if (!tpl || !modalOverlay || !modalBody) return;
		modalBody.innerHTML = '';
		modalBody.appendChild(tpl.content.cloneNode(true));
		lastFocused = document.activeElement;
		modalOverlay.classList.add('is-open');
		document.body.classList.add('modal-open');
		if (modalClose) modalClose.focus();

		modalBody.querySelectorAll('.stat-tile-num').forEach((el) => animateCounter(el));
		requestAnimationFrame(() => {
			modalBody.querySelectorAll('.stat-tile').forEach((el) => el.classList.add('is-visible'));
		});
	};

	const closeModal = () => {
		if (!modalOverlay) return;
		modalOverlay.classList.remove('is-open');
		document.body.classList.remove('modal-open');
		modalBody.innerHTML = '';
		if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
	};

	document.querySelectorAll('[data-modal-open]').forEach((btn) => {
		btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
	});
	if (modalClose) modalClose.addEventListener('click', closeModal);
	if (modalOverlay) {
		modalOverlay.addEventListener('click', (event) => {
			if (event.target === modalOverlay) closeModal();
		});
	}
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-open')) closeModal();
	});
})();
