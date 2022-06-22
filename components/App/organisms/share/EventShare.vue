<template>
  <div class="event-share-container">
    <div class="event-share-header-container">
      <div class="event-share-header-text-container">
        <span
          >こんにちは!!
          <span class="event-share-header-text-large">{{
            $store.state.userProfile.name
          }}</span
          >さん!</span
        >
        <span>今日もよろしくお願いします！</span>
      </div>
      <div v-if="newMemberFlag" class="icon-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          @click="$emit('openTutorial')"
        >
          <g
            id="Group_8321"
            data-name="Group 8321"
            transform="translate(-319 -132)"
          >
            <circle
              id="Ellipse_256"
              data-name="Ellipse 256"
              cx="20"
              cy="20"
              r="20"
              transform="translate(319 132)"
              fill="#fff"
              opacity="0.8"
            />
            <g
              id="Component_171_1"
              data-name="Component 171 – 1"
              transform="translate(332 142)"
            >
              <path
                id="Path_6322"
                data-name="Path 6322"
                d="M1215.948,891.783a.56.56,0,0,0-.935.416v13.142a1.12,1.12,0,0,0,.328.792l6.672,6.672V897.242Z"
                transform="translate(-1215.013 -891.639)"
                fill="#efe38b"
              />
              <path
                id="Path_6323"
                data-name="Path 6323"
                d="M1272.013,905.342V892.2a.56.56,0,0,0-.935-.416l-6.065,5.458v15.564l6.672-6.672A1.12,1.12,0,0,0,1272.013,905.342Z"
                transform="translate(-1258.013 -891.639)"
                fill="#8add7c"
              />
            </g>
          </g>
        </svg>
      </div>
      <div class="event-share-header-time-container">
        {{ today }}
      </div>
    </div>
    <div
      v-if="!isVisitor"
      class="event-share-button-container"
      @click="onClick"
    >
      <span class="event-share-button-text">
        <template v-if="currentTheme">
          今回のテーマは{{ dateFormat(currentTheme.end_date) }}までです！
        </template>
        <template v-else>できごとを共有しましょう！</template>
      </span>
      <icon class="event-share-button-icon" name="write" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { fetchCurrentTheme } from '@/libs/api/app';
import Icon from '../../atoms/images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    isVisitor: {
      type: Boolean,
      default: false,
    },
    newMemberFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      today: dayjs()
        .locale('en')
        .format('YYYY/MM/DD/ddd.'),
      currentTheme: null as AppApiResponse.PostTheme,
    };
  },
  computed: {
    dateFormat(): string {
      return (time: number) => dayjs.unix(time).format('MM/DD');
    },
  },
  async created() {
    const { data } = await fetchCurrentTheme();
    this.currentTheme = data;
  },
  methods: {
    onClick() {
      this.$emit('shareButtonClick');
    },
  },
});
</script>

<style lang="scss" scoped>
.event-share-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  background-color: #f2f3f7;
  padding: 25px 40px;
  box-shadow: 0 1px 2px 0 #dce5ef;
}

.event-share-header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.event-share-header-text-container {
  display: flex;
  flex-direction: column;
  font-size: 15px;
}

.event-share-header-text-large {
  font-weight: 600;
}

.event-share-header-time-container {
  font-size: 11px;
  color: $sub_color;
}

.event-share-button-container {
  display: flex;
  width: 100%;
  height: 52px;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  margin-top: 24px;
  font-size: 15px;
  color: rgba(156, 157, 165, 0.5);
  cursor: pointer;
  box-shadow: 0 1px 2px 0 #dce5ef;
}

.icon-box {
  float: left;
  width: 50%;
  padding-left: 20px;
  padding-top: 10px;

  svg {
    cursor: pointer;
  }

  svg:active {
    opacity: 0.5;
  }
}
</style>
