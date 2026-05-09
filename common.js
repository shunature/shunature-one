// ── テーマ ──
function updateIcon(theme) {
    const moon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    const sun  = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    const svg  = theme === 'dark' ? moon : sun;
    ['theme-icon', 'theme-icon-mobile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = svg;
    });
}

function toggleTheme() {
    const cur  = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
}

// 初期テーマ適用（フラッシュ防止のため即時実行）
(function () {
    const saved = localStorage.getItem('theme');
    const dark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const next = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            updateIcon(next);
        }
    });
})();

// ── モバイルメニュー ──
function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu      = document.getElementById('fullscreen-menu');
    if (!hamburger || !menu) return;
    const isOpen = menu.classList.contains('open');
    hamburger.classList.toggle('open', !isOpen);
    menu.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

// ── Header Web Component ──
class HeaderModule extends HTMLElement {
    async connectedCallback() {
        const res  = await fetch('/components/header.html');
        const html = await res.text();
        this.outerHTML = html;

        const path = window.location.pathname;

        // サイドバー active
        document.querySelectorAll('.sidebar-nav a').forEach(a => {
            const href = a.getAttribute('href');
            const match = href === '/' ? path === '/' : path.startsWith(href);
            if (match) a.classList.add('active');
        });

        // フルスクリーンメニュー active
        document.querySelectorAll('.fullscreen-menu-nav a').forEach(a => {
            const href = a.getAttribute('href');
            const match = href === '/' ? path === '/' : path.startsWith(href);
            if (match) a.classList.add('active');
        });

        // テーマアイコン初期化
        const saved = localStorage.getItem('theme');
        const dark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (dark ? 'dark' : 'light');
        updateIcon(theme);
    }
}
customElements.define('header-module', HeaderModule);

// ── 特別な日 ──
(function () {
    const now  = new Date();
    const md   = `${now.getMonth() + 1}/${now.getDate()}`;
    const year = now.getFullYear();

    const DISASTER_YEARS = {
        '1/1':   2024,
        '1/17':  1995,
        '3/11':  2011,
        '4/14':  2016,
        '4/16':  2016,
        '9/1':   1923,
        '9/6':   2018,
        '10/23': 2004,
    };

    const disasterMsg = md => {
        const elapsed = year - DISASTER_YEARS[md];
        return `あの日から、${elapsed} 年。 これまでも、これからも。`;
    };

    const MODES = {
        '11/3':  { cls: 'birthday-mode', msg: 'Happy Birthday, shunature。' },
        '8/12':  { cls: 'birthday-mode', msg: 'Happy Birthday, to Yuu。' },
        '1/1':   { cls: 'newyear-mode',  msg: disasterMsg('1/1') },
        '1/17':  { cls: 'memorial-mode', msg: disasterMsg('1/17') },
        '3/11':  { cls: 'memorial-mode', msg: disasterMsg('3/11') },
        '4/14':  { cls: 'memorial-mode', msg: disasterMsg('4/14') },
        '4/16':  { cls: 'memorial-mode', msg: disasterMsg('4/16') },
        '9/1':   { cls: 'memorial-mode', msg: disasterMsg('9/1') },
        '9/6':   { cls: 'memorial-mode', msg: disasterMsg('9/6') },
        '10/23': { cls: 'memorial-mode', msg: disasterMsg('10/23') },
    };

    const special = MODES[md];
    if (!special) return;

    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add(special.cls);

        const toast = document.createElement('div');
        toast.id = 'special-toast';
        toast.style.cssText = [
            'position:fixed', 'bottom:2rem', 'left:50%',
            'transform:translateX(-50%) translateY(20px)',
            'background:var(--bg)', 'border:1px solid var(--border)',
            'border-radius:999px', 'padding:.55rem 1.3rem',
            'font-size:.78rem', 'color:var(--text-muted)',
            'display:flex', 'align-items:center', 'gap:.45rem',
            'opacity:0', 'transition:opacity .5s,transform .5s',
            'box-shadow:0 4px 20px rgba(0,0,0,.08)',
            'white-space:nowrap', 'z-index:9999', 'pointer-events:none',
        ].join(';');
        toast.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0"></span><span>${special.msg}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 1200);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 9000);
    });
})();