document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById('menuToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');

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
