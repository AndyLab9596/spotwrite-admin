function heredoc(fn) {
	return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
}

var tmpl = heredoc(function () {/*
	<div class="fixBanner pc">
		<div class="close"><img src="./assets/image/common/icon_close.png" alt="close"></div>
		<div class="fixInner flexB">
			<div class="pho"><img src="./assets/image/common/banner_warranty.jpg" alt="3ヶ月間使って、効果がなければ全額返金"></div>
			<div class="touch">
				<p>ご質問やご相談など<br>お気軽にお問い合わせください</p>
				<div class="comBtn comBtn_orange"><a href="../../contact.html"><span>お問い合わせ</span></a></div>
			</div>
		</div>
	</div>
	*/});

document.write(tmpl);
