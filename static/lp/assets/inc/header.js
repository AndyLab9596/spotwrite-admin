function heredoc(fn) {
	return fn.toString().split('\n').slice(1, -1).join('\n') + '\n'
}

var tmpl = heredoc(function () {/*
	<header id="gHeader" class="flex">
	<h1><a href="../../index.html" ><img src="../assets/image/common/logo.png" alt="SpotWrite"></a></h1>
	<div class="hBanner sp"><img src="../assets/image/common/banner01.png" alt="3ヶ月間使って、効果がなければ全額返金"></div>
	<nav id="gNavi">
		<ul>
			<li><a href="../../introduction.html">効果としくみ</a></li>
			<li><a href="../../product.html">製品紹介</a></li>
			<li><a href="../../flow.html">導入までの流れ</a></li>
			<!--<li><a href="../../plan.html">料金プラン</a></li>-->
			<li><a href="../../case.html">導入事例</a></li>
			<li><a href="../../download.html">資料ダウンロード</a></li>
		</ul>
	</nav>
	<div class="hBtn"><a href="../../contact.html">お問い合わせ</a></div>
	</header>
	<div class="spHeader sp">
		<div class="menu"><span></span><span></span><span></span></div>
		
		<div class="btn"><a href="../../contact.html">お問い合わせ</a></div>
	</div>
	<div class="menuBox">
		<div class="menuInner">
			<div class="menuSub">
				<div class="logo"><a href="../../index.html" ><img src="../assets/image/common/logo_menu.png" alt="SpotWrite"></a></div>
				<ul class="menuUl">
					<li><a href="../../introduction.html">効果としくみ</a></li>
					<li><a href="../../product.html">製品紹介</a></li>
					<li><a href="../../flow.html">導入までの流れ</a></li>
					<!--<li><a href="../../plan.html">料金プラン</a></li>-->
					<li><a href="../../case.html">導入事例</a></li>
					<li><a href="../../download.html">資料ダウンロード</a></li>
				</ul>
			</div>
		</div>
	</div>
	*/});

document.write(tmpl);
