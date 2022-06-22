function heredoc(fn) {
	return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
}

var tmpl = heredoc(function () {/*
	<footer id="gFooter">
		<div class="logo"><a href="../../index.html"><img src="../assets/image/common/logo.png" alt="SpotWrite"></a></div>
		<div class="content flexB">
			<ul class="fNavi">
				<li><a href="../../product.html">製品紹介</a></li>
				<li><a href="../../flow.html">導入までの流れ</a></li>
				<!--<li><a href="../../plan.html">料金プラン</a></li>-->
				<li><a href="../../case.html">導入事例</a></li>
				<!--<li><a href="../../news_list.html">ニュース</a></li>-->
				<li><a href="../../download.html">資料ダウンロード</a></li>
				<li><a href="../../contact.html">お問い合わせ</a></li>
				<li><a href="../../corporation.html">大企業向けプラン</a></li>
				<li><a href="../../agent.html">代理店募集</a></li>
				<li><a href="../../privacy.html">プライバシーポリシー</a></li>
				<li><a href="../../use_rule.html">利用規約</a></li>
				<li><a href="../../law.html">特定商法取引</a></li>
				<li><a href="../../company.html">会社概要</a></li>
			</ul>
			<div class="fLink">
				<div class="img"><a href="../../company.html"><img src="../assets/image/common/logo-sw.png" alt="Spotwrite"></a></div>
				<ul class="fLinkUl">
					<li><a href="../../company.html">運営会社</a></li>
					<li><a href="../../company.html">株式会社Spotwrite</a></li>
				</ul>
			</div>
		</div>
		<address>
		Copyright &copy; Worksmedia
		</address>
	</footer>
	*/});

document.write(tmpl);
