<template>
  <html>
    <head>
      <title>Spotwrite</title>
      <meta data-n-head="1" charset="utf-8" />
      <meta
        data-n-head="1"
        name="viewport"
        content="width=device-width,height=device-height,initial-scale=1"
      />
      <meta
        data-n-head="1"
        data-hid="description"
        name="description"
        content="Administrator front end for this project"
      />
      <meta
        data-n-head="1"
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
      />
      <meta
        data-n-head="1"
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
      />
      <meta
        data-n-head="1"
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lexend+Giga&display=swap"
      />
      <meta
        data-n-head="1"
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap"
      />
      <link
        data-n-head="1"
        rel="icon"
        type="image/x-icon"
        href="/favicon.ico"
      />
    </head>

    <body>
      <div>
        <div id="__layout">
          <div class="__error-page">
            <div class="error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                fill="#DBE1EC"
                viewBox="0 0 48 48"
              >
                <path
                  d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
                ></path>
              </svg>
              <div class="title">This page could not be found</div>
              <p class="description">
                You will be redirected to the homepage after
                <span id="counter">3</span>&nbsp;seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
</template>
<script type="text/javascript">
setInterval(function() {
  const div = document.querySelector('#counter');
  const count = div.textContent * 1 - 1;
  div.textContent = count;
  if (count <= 0) {
    window.location.replace('/');
  }
}, 1000);
</script>
<style type="text/css">
.__error-page {
  padding: 1rem;
  background: #f7f8fb;
  color: #47494e;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.__error-page .error {
  max-width: 450px;
}

.__error-page .description {
  color: #7f828b;
  line-height: 21px;
  margin-bottom: 10px;
}

.__error-page .logo {
  position: fixed;
  left: 12px;
  bottom: 12px;
}

.__error-page .title {
  font-size: 1.5rem;
  margin-top: 15px;
  color: #47494e;
  margin-bottom: 8px;
}

.__error-page a {
  color: #7f828b !important;
  text-decoration: none;
}
</style>
