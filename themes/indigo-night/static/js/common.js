// ── テーマ機能 ──
function updateIcon(theme) {
    const moonPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    const sunPath = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    const svg = theme === 'dark' ? moonPath : sunPath;

    ['theme-icon', 'theme-icon-mobile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = svg;
    });
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
}


function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('fullscreen-menu');
    const isOpen = menu.classList.contains('open');

    hamburger.classList.toggle('open', !isOpen);
    menu.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';

    // activeクラスを付与
    if (!isOpen) {
        const path = window.location.pathname;
        menu.querySelectorAll('.fullscreen-menu-nav a, .fullscreen-menu-sub a').forEach(a => {
            const href = a.getAttribute('href');
            a.classList.toggle('active', href === '/' ? path === '/' : path.startsWith(href));
        });
    }
}

(function() {
    const saved = localStorage.getItem('theme');
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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

// ── 特別な日 ──
(function() {
    const now = new Date();
    const md = `${now.getMonth() + 1}/${now.getDate()}`;
    const year = now.getFullYear();

    // 災害発生年（トースト年数計算用）
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

    function disasterMsg(md) {
        const base = DISASTER_YEARS[md];
        const elapsed = year - base;
        return `あの日から、${elapsed} 年。 これまでも、これからも。`;
    }

    const MODES = {
        '11/3':  { cls: 'birthday-mode',  msg: 'Happy Birthday, shunature。' },
        '8/12':  { cls: 'birthday-mode',  msg: 'Happy Birthday, to Yuu。' },
        '1/1':   { cls: 'newyear-mode',   msg: disasterMsg('1/1') },
        '1/17':  { cls: 'memorial-mode',  msg: disasterMsg('1/17') },
        '3/11':  { cls: 'memorial-mode',  msg: disasterMsg('3/11') },
        '4/14':  { cls: 'memorial-mode',  msg: disasterMsg('4/14') },
        '4/16':  { cls: 'memorial-mode',  msg: disasterMsg('4/16') },
        '9/1':   { cls: 'memorial-mode',  msg: disasterMsg('9/1') },
        '9/6':   { cls: 'memorial-mode',  msg: disasterMsg('9/6') },
        '10/23': { cls: 'memorial-mode',  msg: disasterMsg('10/23') },
    };

    const special = MODES[md];
    if (!special) return;

    // CSS注入
    const style = document.createElement('style');
    style.textContent = `
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            opacity: 0;
            transition: opacity 1.2s ease;
        }
        body.birthday-mode::before {
            background: radial-gradient(ellipse at 80% 20%, rgba(255, 170, 100, 0.30) 0%, transparent 55%),
                        radial-gradient(ellipse at 20% 80%, rgba(130, 150, 240, 0.22) 0%, transparent 55%);
            opacity: 1;
        }
        body.memorial-mode::before {
            background: radial-gradient(ellipse at 50% 0%, rgba(100, 140, 190, 0.32) 0%, transparent 65%),
                        radial-gradient(ellipse at 50% 100%, rgba(120, 150, 200, 0.18) 0%, transparent 55%);
            opacity: 1;
        }
        body.newyear-mode::before {
            background: radial-gradient(ellipse at 70% 10%, rgba(255, 200, 80, 0.28) 0%, transparent 55%),
                        radial-gradient(ellipse at 30% 90%, rgba(220, 100, 80, 0.18) 0%, transparent 55%);
            opacity: 1;
        }
        [data-theme="dark"] body.birthday-mode::before {
            background: radial-gradient(ellipse at 80% 20%, rgba(255, 170, 100, 0.22) 0%, transparent 55%),
                        radial-gradient(ellipse at 20% 80%, rgba(110, 140, 230, 0.18) 0%, transparent 55%);
        }
        [data-theme="dark"] body.memorial-mode::before {
            background: radial-gradient(ellipse at 50% 0%, rgba(130, 160, 200, 0.22) 0%, transparent 65%),
                        radial-gradient(ellipse at 50% 100%, rgba(100, 120, 160, 0.12) 0%, transparent 50%);
        }
        [data-theme="dark"] body.newyear-mode::before {
            background: radial-gradient(ellipse at 70% 10%, rgba(220, 170, 60, 0.20) 0%, transparent 55%),
                        radial-gradient(ellipse at 30% 90%, rgba(190, 80, 60, 0.14) 0%, transparent 55%);
        }
        #special-toast {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--bg, #f5f4f1);
            border: 1px solid var(--border, rgba(0,0,0,0.07));
            border-radius: 999px;
            padding: 0.6rem 1.4rem;
            font-size: 0.82rem;
            color: var(--text-muted, #666660);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            opacity: 0;
            transition: opacity 0.6s ease, transform 0.6s ease;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
            white-space: nowrap;
            z-index: 9999;
            pointer-events: none;
        }
        #special-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .special-toast-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent, #5b7fa6);
            animation: specialPulse 2s ease-in-out infinite;
        }
        @keyframes specialPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.7); }
        }
    `;
    document.head.appendChild(style);

    // body classを付与
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add(special.cls);

        // トースト生成
        const toast = document.createElement('div');
        toast.id = 'special-toast';
        toast.innerHTML = `<span class="special-toast-dot"></span><span>${special.msg}</span>`;
        document.body.appendChild(toast);

        // 1.2秒後に表示、8秒後に消える
        setTimeout(() => toast.classList.add('show'), 1200);
        setTimeout(() => toast.classList.remove('show'), 9200);
    });
})();