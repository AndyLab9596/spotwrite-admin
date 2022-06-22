<template>
  <div class="wrapper">
    <div class="inner">
      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19.013"
          height="17.052"
          viewBox="0 0 19.013 17.052"
        >
          <g
            id="info_nyusya"
            data-name="info/nyusya"
            transform="translate(0.506 0.546)"
          >
            <path
              id="Path_1415"
              data-name="Path 1415"
              d="M245.772,117.649v-7.906l4.842-1.437"
              transform="translate(-244.561 -101.94)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <path
              id="Path_1416"
              data-name="Path 1416"
              d="M250.719,117.649V103.942l6.947-2,3.842,2.207V117.8"
              transform="translate(-244.561 -101.94)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_768"
              data-name="Line 768"
              y1="1.122"
              x2="3.895"
              transform="translate(7.684 3.177)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_769"
              data-name="Line 769"
              y1="0.405"
              x2="1.727"
              transform="translate(2.68 9.794)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_770"
              data-name="Line 770"
              y1="0.127"
              x2="1.727"
              transform="translate(2.68 13.222)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_771"
              data-name="Line 771"
              y1="0.221"
              x2="1.63"
              transform="translate(2.68 11.531)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_772"
              data-name="Line 772"
              y1="0.869"
              x2="3.895"
              transform="translate(7.684 5.693)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_773"
              data-name="Line 773"
              y1="0.613"
              x2="3.895"
              transform="translate(7.684 8.212)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_774"
              data-name="Line 774"
              y1="0.459"
              x2="3.895"
              transform="translate(7.684 10.679)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_775"
              data-name="Line 775"
              y1="0.279"
              x2="3.895"
              transform="translate(7.684 13.16)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_776"
              data-name="Line 776"
              y1="15.658"
              transform="translate(13.105 0.154)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
            <line
              id="Line_777"
              data-name="Line 777"
              x2="18"
              transform="translate(0 16)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.013"
            />
          </g>
        </svg>
      </div>
      <div class="name">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
}

.icon {
  height: 40px;
  width: 40px;
  background-color: $white_1;
  border-radius: 14px;
  padding: 10px;
}

.name {
  margin-left: 15px;
  font-size: 15px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
}
</style>
