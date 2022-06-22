<template>
  <div class="title">
    <p>招待されているイベント</p>
    <button @click="changeParticipationEvent">{{ buttonText }}</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isParticipationEvent: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    buttonText(): string {
      return this.isParticipationEvent ? '全て表示' : '参加予定のみ表示';
    },
  },

  methods: {
    changeParticipationEvent() {
      this.$emit('onChangeParticipationEvent', !this.isParticipationEvent);
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $background_color;
  width: 100%;
  height: 37px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 1px 4px rgba(220, 229, 239, 1);
}

p {
  color: $text_gray;
  font-weight: 600;
  font-size: 15px;
  margin-left: 16px;
}

button {
  background-color: #e4e5ed;
  height: 28px;
  color: $gray_blue_4;
  text-align: center;
  font-size: 12px;
  border-radius: 4px;
  margin-right: 16px;
  padding: 0 16px;
  font-weight: 600;
  border: none;
}
</style>
