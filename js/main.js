document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');

    // Prevent navigation for disabled store buttons while still allowing hover/focus styles.
    document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    // Scroll reveal for sections (progressive enhancement).
    // Disabled on legal pages to avoid content appearing/disappearing.
    if (!document.body.classList.contains('no-scroll-reveal')) {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealTargets = document.querySelectorAll('.content-section');

        if (revealTargets.length) {
            revealTargets.forEach((el) => el.classList.add('reveal-on-scroll'));

            if (reduceMotion || !('IntersectionObserver' in window)) {
                revealTargets.forEach((el) => el.classList.add('is-visible'));
            } else {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    });
                }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

                revealTargets.forEach((el) => observer.observe(el));
            }
        }
    }

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', function () {
            const isExpanded = mobileDrawer.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isExpanded));
            if (isExpanded) {
                menuToggle.innerHTML = '&times;';
            } else {
                menuToggle.innerHTML = '☰';
            }
        });

        const drawerLinks = mobileDrawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileDrawer.classList.contains('active')) {
                    mobileDrawer.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '☰';
                }
            });
        });
    }
});
