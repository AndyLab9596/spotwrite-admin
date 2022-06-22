function heredoc(fn) {
	return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
}

var tmpl = heredoc(function () {/*
	<section class="comContact">
	<div class="content">
		<ul class="linkUl flexB">
			<li>
				<h3>まずは資料を見て<br>
					検討したい</h3>
				<div class="pho"><img src="../assets/image/common/photo01.png" alt="資料ダウンロード"></div>
				<div class="comBtn comBtn_orange"><a href="../../download.html">資料ダウンロード</a></div>
			</li>
			<li>
				<h3>実際の画面を見て<br>
					使ってみたい</h3>
				<div class="pho"><img src="../assets/image/common/photo02.png" alt="無料デモお申し込み"></div>
				<div class="comBtn comBtn_orange"><a href="../../contact.html?mode=demo">無料デモお申し込み</a></div>
			</li>
			<li>
				<h3>お気軽に<br>
					ご質問ください</h3>
				<div class="pho"><img src="../assets/image/common/photo03.png" alt="お問い合わせ"></div>
				<div class="comBtn comBtn_orange"><a href="../../contact.html">お問い合わせ</a></div>
			</li>
		</ul>
	</div>
</section>
	*/});

document.write(tmpl);
