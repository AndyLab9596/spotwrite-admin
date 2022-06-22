<template>
  <div class="tutorial-content">
    <div class="image">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="95"
        height="87.791"
        viewBox="0 0 95 87.791"
      >
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0.075"
            y1="0.874"
            x2="0.9"
            y2="-0.029"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#ededef" />
            <stop offset="1" stop-color="#fdf0f0" />
          </linearGradient>
        </defs>
        <g id="icon_01" transform="translate(0.5 0.5)">
          <path
            id="Path_6332"
            data-name="Path 6332"
            d="M522.3,473.145h2.947v8.841a2.947,2.947,0,0,0,4.582,2.453l17.136-11.294h28.581a8.842,8.842,0,0,0,8.841-8.842V428.936a8.841,8.841,0,0,0-8.841-8.841H522.3a8.842,8.842,0,0,0-8.842,8.841V464.3A8.842,8.842,0,0,0,522.3,473.145Z"
            transform="translate(-509.379 -416.013)"
            fill="url(#linear-gradient)"
          />
          <path
            id="Path_6333"
            data-name="Path 6333"
            d="M518.3,469.142h2.947v8.842a2.947,2.947,0,0,0,4.582,2.452l17.137-11.294h28.58a8.842,8.842,0,0,0,8.842-8.842V424.934a8.842,8.842,0,0,0-8.842-8.842H518.3a8.842,8.842,0,0,0-8.841,8.842V460.3A8.842,8.842,0,0,0,518.3,469.142Z"
            transform="translate(-509.458 -416.092)"
            fill="none"
            stroke="#90747f"
            stroke-width="1"
          />
          <path
            id="Path_6334"
            data-name="Path 6334"
            d="M552.193,475.125v12a6.285,6.285,0,0,0,6.284,6.285h20.315l12.041,8.307a2.095,2.095,0,0,0,3.256-1.743v-6.564h2.095a6.406,6.406,0,0,0,6.425-6.285V461.985a6.406,6.406,0,0,0-6.425-6.284H585.711"
            transform="translate(-508.61 -415.306)"
            fill="none"
            stroke="#90747f"
            stroke-width="1"
          />
          <g
            id="Group_8320"
            data-name="Group 8320"
            transform="translate(14.215 17.7)"
          >
            <g id="Group_8317" data-name="Group 8317">
              <line
                id="Line_1343"
                data-name="Line 1343"
                x2="13.746"
                fill="none"
                stroke="#90747f"
                stroke-linecap="round"
                stroke-width="1"
              />
              <line
                id="Line_1344"
                data-name="Line 1344"
                x2="23.519"
                transform="translate(18.981)"
                fill="none"
                stroke="#90747f"
                stroke-linecap="round"
                stroke-width="1"
              />
            </g>
            <g
              id="Group_8318"
              data-name="Group 8318"
              transform="translate(0 17.757)"
            >
              <line
                id="Line_1345"
                data-name="Line 1345"
                x2="13.746"
                fill="none"
                stroke="#90747f"
                stroke-linecap="round"
                stroke-width="1"
              />
              <line
                id="Line_1346"
                data-name="Line 1346"
                x2="23.519"
                transform="translate(18.981)"
                fill="none"
                stroke="#90747f"
                stroke-linecap="round"
                stroke-width="1"
              />
            </g>
            <g
              id="Group_8319"
              data-name="Group 8319"
              transform="translate(0 8.879)"
            >
              <line
                id="Line_1347"
                data-name="Line 1347"
                x2="27.961"
                fill="none"
                stroke="#90747f"
                stroke-linecap="round"
                stroke-width="1"
              />
              <line
                id="Line_1348"
                data-name="Line 1348"
                x2="9.304"
                transform="translate(33.195)"
                fill="none"
                stroke="#90747f"
                stroke-linecap="round"
                stroke-width="1"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="title">
      <p>社内のメンバーとリアルタイムで</p>
      <p>すぐにやりとりができるメッセージ機能。</p>
    </div>
    <div class="text-content">
      <p>
        会社や部署の組織をまとめてグループを作ることができます。
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
