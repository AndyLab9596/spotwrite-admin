<template>
  <div class="tutorial-content">
    <div class="image">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="83.113"
        height="99.34"
        viewBox="0 0 83.113 99.34"
      >
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0.137"
            y1="0.845"
            x2="0.863"
            y2="0.155"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#ededef" />
            <stop offset="1" stop-color="#fdf0f0" />
          </linearGradient>
          <linearGradient
            id="linear-gradient-2"
            x1="0.15"
            y1="1.212"
            x2="0.85"
            y2="0.209"
            xlink:href="#linear-gradient"
          />
        </defs>
        <g id="icon_05" transform="translate(0.5 0.5)">
          <ellipse
            id="Ellipse_4457"
            data-name="Ellipse 4457"
            cx="17.343"
            cy="18.274"
            rx="17.343"
            ry="18.274"
            transform="translate(13.878 4.171)"
            fill="url(#linear-gradient)"
          />
          <path
            id="パス_1621"
            data-name="パス 1621"
            d="M644.4,107.609q-.821-.541-1.678-1.012a24.37,24.37,0,0,0-12.712-2.994h0a27.4,27.4,0,0,0-27.048,27.746v10.279"
            transform="translate(-602.964 -55.1)"
            fill="none"
            stroke="#90747f"
            stroke-linecap="round"
            stroke-width="1"
          />
          <ellipse
            id="Ellipse_4458"
            data-name="Ellipse 4458"
            cx="17.343"
            cy="18.274"
            rx="17.343"
            ry="18.274"
            transform="translate(9.707)"
            fill="none"
            stroke="#90747f"
            stroke-width="1"
          />
          <path
            id="Path_6350"
            data-name="Path 6350"
            d="M606.969,145.629V135.351A27.4,27.4,0,0,1,634.016,107.6a24.359,24.359,0,0,1,15.424,4.759,27.377,27.377,0,0,1,12.076,23.058V145.7Z"
            transform="translate(-602.795 -54.931)"
            fill="url(#linear-gradient-2)"
          />
          <g
            id="楕円形_2422"
            data-name="楕円形 2422"
            transform="translate(32.46 48.687)"
          >
            <circle
              id="Ellipse_4459"
              data-name="Ellipse 4459"
              cx="21.639"
              cy="21.639"
              r="21.639"
              transform="translate(6.876 6.876)"
              fill="#fff"
            />
            <circle
              id="Ellipse_4460"
              data-name="Ellipse 4460"
              cx="24.343"
              cy="24.343"
              r="24.343"
              fill="none"
            />
            <circle
              id="Ellipse_4461"
              data-name="Ellipse 4461"
              cx="21.639"
              cy="21.639"
              r="21.639"
              transform="translate(2.705 2.705)"
              fill="none"
              stroke="#90747f"
              stroke-width="1"
            />
          </g>
          <path
            id="パス_3123"
            data-name="パス 3123"
            d="M649.88,129.547l5.41,4.6L666.4,122.465"
            transform="translate(-600.985 -54.304)"
            fill="none"
            stroke="#90747f"
            stroke-width="1"
          />
        </g>
      </svg>
    </div>
    <div class="title">
      <p>今後のイベント予定、お気に入りの投稿など、</p>
      <p>必要なことは全てマイページから確認ができます。</p>
    </div>
    <div class="text-content">
      <p>
        プロフィールを完成させて、自分のことを会社の人にわかってもらいましょう。
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend();
</script>
<style lang="scss" scoped>
.tutorial-content {
  width: 412px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  min-height: 250px;
}

.image {
  text-align: center;
  margin-top: 20px;

  svg {
    width: 72px;
  }
}

.title {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: bold;
}

.text-content {
  width: 100%;
  text-align: justify;
  margin-bottom: 30px;
}
</style>
