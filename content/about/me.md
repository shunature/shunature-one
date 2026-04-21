---
title: Me
description: 利根川 駿（shunature）について。
---

<!-- Profile -->
<div class="info-section">
<p class="section-label">Profile</p>
<div class="about-grid">
  <div class="about-left">
    <div class="profile-items">
      <div class="profile-row"><span class="profile-key">Name</span><span class="profile-val">利根川 駿 / Shun Tonegawa</span></div>
      <div class="profile-row"><span class="profile-key">Handle</span><span class="profile-val">shunature</span></div>
      <div class="profile-row"><span class="profile-key">生年月日</span><span class="profile-val">2007年11月03日</span></div>
      <div class="profile-row"><span class="profile-key">出身地</span><span class="profile-val">埼玉県</span></div>
      <div class="profile-row"><span class="profile-key">職業</span><span class="profile-val">学生</span></div>
      <div class="profile-row"><span class="profile-key">利き手</span><span class="profile-val">左</span></div>
    </div>
    <p class="about-desc">ちょびっと画像編集とベース演奏ができる人間です。</p>
  </div>
</div>
</div>

<hr class="divider">

<!-- Names -->
<div class="info-section">
<p class="section-label">Names</p>
<div class="names-list">

  <div class="name-row">
    <span class="name-category">本名</span>
    <div class="name-values">
      <div class="name-item">
        <span class="name-value">利根川 駿</span>
        <span class="name-en">Shun Tonegawa</span>
      </div>
    </div>
  </div>

  <div class="name-row">
    <span class="name-category">ラジオネーム</span>
    <div class="name-values">
      <div class="name-item"><span class="name-value">薄味のキャルピス</span><span class="name-note">FM</span></div>
      <div class="name-item"><span class="name-value">真紅の衝撃</span><span class="name-note">AM</span></div>
    </div>
  </div>

  <div class="name-row">
    <span class="name-category">ゲームネーム</span>
    <div class="name-values">
      <div class="name-item"><span class="name-value">クレスデュー</span></div>
      <div class="name-item"><span class="name-value">クレス</span></div>
      <div class="name-item"><span class="name-value">cresdew</span><span class="name-note">crescent（三日月）+ dew（夜露）</span></div>
      <div class="name-item"><span class="name-value">skywordscanbass</span><span class="name-note">GPG</span></div>
    </div>
  </div>

  <div class="name-row">
    <span class="name-category">ID</span>
    <div class="name-values">
      <div class="name-item"><span class="name-value">shunature</span></div>
      <div class="name-item">
        <a href="https://x.com/Aminor_DDN" target="_blank" rel="noopener">
          <span class="name-value">Aminor_DDN</span><span class="name-note">X</span>
        </a>
      </div>
    </div>
  </div>

  <div class="name-row">
    <span class="name-category">ペンネーム</span>
    <div class="name-values">
      <div class="name-item">
        <a href="https://pixelfed.tokyo/shunature" target="_blank" rel="noopener">
          <span class="name-value">利根川</span><span class="name-note">三十五格子日記</span>
        </a>
      </div>
      <div class="name-item">
        <a href="https://www.reddit.com/user/Jealous_Local_550/" target="_blank" rel="noopener">
          <span class="name-value">ドトールのミルクティ</span><span class="name-note">Reddit</span>
        </a>
      </div>
    </div>
  </div>

</div>
<p class="names-footnote">ゲームネームは文字数やプラットフォームによって使い分けています。</p>
</div>

<hr class="divider">

<!-- Contact -->
<div class="info-section">
<p class="section-label">Contact</p>
<ul class="contact-list" id="contact-list"></ul>
</div>

<script>
// Contact
(function() {
  var contacts = [
    { u: 'contact', d: 'ffnet.work', label: '運営へのご連絡（サイト・その他）' },
    { u: 'bassnc',  d: 'ffnet.work', label: '私個人へのご連絡（質問・交流）' },
  ];
  document.getElementById('contact-list').innerHTML = contacts.map(function(c, i) {
    var addr = c.u + '@' + c.d;
    return '<li class="contact-item">'
      + '<span class="contact-item-label">' + c.label + '</span>'
      + '<button class="contact-reveal-btn" onclick="revealContact(' + i + ')" id="reveal-btn-' + i + '">'
      + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
      + 'メールアドレスを表示</button>'
      + '<div class="contact-revealed" id="revealed-' + i + '">'
      + '<a class="contact-address" href="mailto:' + addr + '">' + addr + '</a>'
      + '<button class="contact-copy-btn" onclick="copyContact(\'' + addr + '\',' + i + ')">'
      + '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
      + 'コピー</button></div></li>';
  }).join('');
})();

function revealContact(i) {
  document.getElementById('reveal-btn-' + i).style.display = 'none';
  document.getElementById('revealed-' + i).classList.add('open');
}

async function copyContact(addr, i) {
  try { await navigator.clipboard.writeText(addr); }
  catch(e) {
    var ta = document.createElement('textarea');
    ta.value = addr; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  }
  var btn = document.querySelector('#revealed-' + i + ' .contact-copy-btn');
  btn.classList.add('copied');
  btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> コピーしました';
  setTimeout(function() {
    btn.classList.remove('copied');
    btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> コピー';
  }, 2000);
}

</script>