(function () {
    const EMBED_URL = 'https://embed.liveavatar.com/v1/fec43ee2-b17b-4b8a-8166-18856531e877?orientation=horizontal';

    function byId(id) {
        return document.getElementById(id);
    }

    function showMockInterview() {
        document.querySelectorAll('.dashboard-section').forEach((section) => {
            section.classList.remove('active');
        });

        const section = byId('section-mock-interview');
        const view = byId('view-mock-interview');
        if (section) section.classList.add('active');
        if (view) view.classList.remove('hidden');

        document.querySelectorAll('[id^="nav-"], #savedJobsMenu, #top-nav-mock-interview').forEach((nav) => {
            nav.classList.remove('bg-blue-50', 'text-blue-700', 'font-medium');
            nav.classList.add('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
        });

        ['nav-mock-interview', 'top-nav-mock-interview'].forEach((id) => {
            const nav = byId(id);
            if (nav) {
                nav.classList.remove('text-slate-600', 'hover:bg-slate-50', 'hover:text-slate-900');
                nav.classList.add('bg-blue-50', 'text-blue-700', 'font-medium');
            }
        });

        if (window.location.hash !== '#view-mock-interview') {
            window.location.hash = 'view-mock-interview';
        }

        const frame = byId('mockInterviewFrame');
        if (frame && !frame.src) {
            frame.src = EMBED_URL;
        }

        if (section) {
            const navOffset = 124;
            const targetTop = section.getBoundingClientRect().top + window.scrollY - navOffset;
            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: 'smooth'
            });
        }
    }

    function reloadInterview() {
        const frame = byId('mockInterviewFrame');
        if (!frame) return;
        frame.src = 'about:blank';
        window.setTimeout(() => {
            frame.src = EMBED_URL;
        }, 120);
    }

    function initMockInterview() {
        const frame = byId('mockInterviewFrame');
        if (frame && !frame.src) {
            frame.src = EMBED_URL;
        }

        ['nav-mock-interview', 'top-nav-mock-interview'].forEach((id) => {
            const link = byId(id);
            if (link) {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    showMockInterview();
                });
            }
        });

        const reloadBtn = byId('mockInterviewReload');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', reloadInterview);
        }

        document.querySelectorAll('[data-open-mock-interview]').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                showMockInterview();
            });
        });

        if (window.location.hash === '#view-mock-interview') {
            setTimeout(showMockInterview, 160);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMockInterview);
    } else {
        initMockInterview();
    }

    window.CareerOSMockInterview = {
        show: showMockInterview,
        reload: reloadInterview
    };
})();
