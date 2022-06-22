<template>
  <div
    class="mental-check-button-container"
    :class="isClicked ? 'mental-check-button-container-clicked' : ''"
    @click="onClick"
  >
    <img
      v-show="!isClicked"
      class="mental-check-img"
      :src="require(`@/assets/image/btn/mental-check-${status}.png`)"
      :alt="text"
    />
    <img
      v-show="isClicked"
      class="mental-check-img"
      :src="require(`@/assets/image/btn/mental-check-${status}-clicked.png`)"
      :alt="text"
    />
    <span
      class="mental-check-text"
      :class="isClicked ? 'mental-check-button-text-clicked' : ''"
    >
      {{ text }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const statusType = {
  excellent: '最高',
  very_good: 'いい感じ',
  good: 'ふつう',
  average: 'まあまあ',
  poor: 'いまいち',
} as {
  [key: string]: string;
};

export default Vue.extend({
  props: {
    status: {
      type: String,
      required: true,
      validator: (v: string) => Object.keys(statusType).includes(v),
    },
  },
  data() {
    return {
      isClicked: false,
    };
  },
  computed: {
    text(): string {
      return statusType[this.status];
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.status);
      this.isClicked = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.mental-check-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.mental-check-button-container-clicked {
  animation: transformStart 1s, transformEnd 0.25s 1s forwards;
}

@keyframes transformStart {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-20px);
  }
}

@keyframes transformEnd {
  0% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(-30px);
  }
}

.mental-check-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.mental-check-text {
  color: $sub_color;
  font-size: 11px;
  line-height: 24px;
  white-space: nowrap;
}

.mental-check-button-text-clicked {
  color: #f09c9c;
}
</style>
