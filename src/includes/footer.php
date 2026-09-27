<?php
$base_path = isset($base_path) ? $base_path : './';
?>
  <!-- Contact Modal -->
  <dialog class="contact-dialog" id="contact-modal" aria-labelledby="contact-modal-title">
      <div class="contact-dialog-head">
        <div><h2 id="contact-modal-title">Contact</h2><p>ご用件に近い件名を選んでください。</p></div>
        <button class="contact-close" type="button" aria-label="Contactモーダルを閉じる">×</button>
      </div>
      <div class="contact-options">
        <button class="contact-option" type="button" data-subject="サイトについて"><span><strong>サイトについて</strong><span>サイトについての不具合など</span></span></button>
        <button class="contact-option" type="button" data-subject="管理人宛"><span><strong>管理人宛</strong><span>管理人へのお問い合わせ、交流</span></span></button>
        <button class="contact-option" type="button" data-subject="重要"><span><strong>重要</strong><span>緊急での対応が必要なもの</span></span></button>
        <button class="contact-option" type="button" data-subject=""><span><strong>その他</strong><span>件名の指定はありません</span></span></button>
      </div>
  </dialog>

  <script src="<?php echo $base_path; ?>js/main.js"></script>
</body>
</html>
