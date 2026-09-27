<?php
$page_title = 'Profile | 鯨とネガ';
$page_description = '利根川 駿 (Shun Tonegawa) のプロフィール、拠点情報、関心領域（イヤホン、インディーゲーム、ガジェット環境等）';
$current_page = 'profile';
$base_path = './';
require __DIR__ . '/../includes/head.php';
?>

<div class="layout-wrapper">
  <?php require __DIR__ . '/../includes/sidebar.php'; ?>

  <main class="main-content animate-fade-in">
    <h1 class="page-title">プロフィール</h1>
    <p class="page-subtitle">Whale and Negafilms — Profile & Interests</p>

    <div style="max-width: 720px;">
      <section style="margin-bottom: 40px;">
        <h2 class="section-title">基本情報</h2>
        <dl style="display: grid; grid-template-columns: 120px 1fr; gap: 14px; font-size: 16px;">
          <dt style="color: var(--muted); font-weight: 700;">名前</dt>
          <dd style="margin: 0; font-weight: 700;">利根川 駿（Shun Tonegawa）</dd>

          <dt style="color: var(--muted); font-weight: 700;">別名 / ID</dt>
          <dd style="margin: 0;">鯨とネガ (Whale and Negafilms) / @dockker7mb</dd>

          <dt style="color: var(--muted); font-weight: 700;">拠点</dt>
          <dd style="margin: 0;">東京都 板橋区</dd>

          <dt style="color: var(--muted); font-weight: 700;">活動領域</dt>
          <dd style="margin: 0;">タイポグラフィ</dd>
        </dl>
      </section>

      <section style="margin-bottom: 40px;">
        <h2 class="section-title">関心・ハマっているもの</h2>
        
        <div style="display: grid; gap: 24px; margin-top: 20px;">
          <div style="padding: 20px; border: 2px solid var(--line); background: var(--surface);">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: var(--text);">イヤホン</h3>
            <p style="margin: 0; font-size: 15px; color: var(--muted);">
              高音の抜け感にこだわりがあり、ユニバーサルイヤホン（市販品を言います）やDACの試聴が好きです。<br>
              この際はジャンルを問わず、1ドライバでの表現豊かなサウンドに惹かれます。
            </p>
          </div>

          <div style="padding: 20px; border: 2px solid var(--line); background: var(--surface);">
            <h3 style="margin: 0 0 10px; font-size: 18px; color: var(--text);">ゲーム</h3>
            <p style="margin: 0; font-size: 15px; color: var(--muted);">
              最近は、P4G（ペルソナ4 ゴールデン）をよくやっています<br>
              シミュレーション、独自のキャラデザインやゲーム性を持ったインディーズゲームも好きでよく遊んでいます。
            </p>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 40px;">
        <h2 class="section-title">ライフスタイル＆思想</h2>
        <p>
          神だなんだとか言うよりも<br>
          音楽や会話で深まる人間関係の方が好きです。<br>
          <br>
          丁寧な生活とは程遠いですが、<br>
          生活のちょっとした瞬間を写真に収められたらいいなと思っています。
      </p>
      </section>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--line);">
        <a href="<?php echo $base_path; ?>index.html" style="font-weight: 700;">&larr; ホームへ戻る</a>
      </div>
    </div>
  </main>
</div>

<?php require __DIR__ . '/../includes/footer.php'; ?>
