// Landing page (index.html) only.
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.site-header');

    // Sticky header: glass background once the page is scrolled.
    if (header) {
        const updateHeader = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    // "App laden" goes to /download/ (store redirect + tracking) on phones.
    // On desktop that page can only show a note, so scroll to the store
    // badges with their QR codes instead.
    const headerCta = document.querySelector('.site-header .btn-cta');
    const badges = document.getElementById('download');
    const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');

    if (headerCta && badges && finePointer) {
        headerCta.addEventListener('click', (e) => {
            if (!finePointer.matches) return;
            e.preventDefault();
            badges.scrollIntoView({ block: 'center' });
        });
    }
});
