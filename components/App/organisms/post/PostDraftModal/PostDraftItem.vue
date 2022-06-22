<template>
  <div class="draft-item" @click="clickItem(postUuid)">
    <div class="content-left">
      <div class="title">
        {{ title }}
      </div>
      <div class="date">
        {{ dateTimeFilter }}
      </div>
    </div>
    <div class="content-right">
      <BaseButton
        inverse
        size="large"
        class="delete-button"
        :disabled="disabled"
        @click="clickTrashButton(postUuid)"
      >
        削除
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    draftedAt: {
      type: Number,
      default: 0,
    },
    postUuid: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    dateTimeFilter() {
      if (this.draftedAt) {
        return dayjs.unix(Number(this.draftedAt)).format('YYYY/MM/DD hh:mm');
      }
      return null;
    },
  },
  methods: {
    clickItem(uuid: string) {
      this.$emit('click', uuid);
    },
    clickTrashButton(uuid: string) {
      this.$emit('trash', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.draft-item {
  background: $white_1;
  border: $ruled_line 1px solid;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  height: 80px;
  align-items: center;
  margin-top: 18px;
  padding: 0 24px;
  cursor: pointer;
}

.content-left {
  display: flex;

  .title {
    font-size: 15px;
    padding-right: 26px;
    padding-left: 15px;
    font-weight: bold;
  }

  .date {
    color: $sub_color;
  }
}

.delete-button {
  width: 119px;
}
</style>
