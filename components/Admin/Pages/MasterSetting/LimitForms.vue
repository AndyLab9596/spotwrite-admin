<template>
  <div class="wrapper">
    <div v-if="title" class="title">{{ title }}</div>
    <div class="column-container">
      <div class="column">
        <div class="item">
          <p class="item-title">投稿文字数（下限値）</p>
          <base-select
            v-model="rules.min_word_count"
            :items="minWords"
            @input="onChange"
          />
        </div>
        <div class="item">
          <p class="item-title">記事閲覧制限</p>
          <base-select
            v-model="rules.inspection_rights"
            :items="inspectionRights"
            @input="onChange"
          />
        </div>
      </div>
      <div class="column">
        <div class="item">
          <p class="item-title">投稿写真枚数(下限値)</p>
          <base-select
            v-model="rules.min_photo_count"
            :items="minPhotos"
            @input="onChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

export default Vue.extend({
  components: {
    BaseSelect,
  },
  model: {
    prop: 'rules',
    event: 'change',
  },
  props: {
    rules: {
      type: Object,
      required: true,
    },
    minWords: {
      type: Array,
      required: true,
    },
    inspectionRights: {
      type: Array,
      required: true,
    },
    minPhotos: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
  },
  methods: {
    onChange(event: { target: HTMLSelectElement }) {
      if (event.target instanceof HTMLSelectElement) {
        const rules = {
          ...this.rules,
          [event.target.name]: event.target.value,
        };
        this.$emit('change', rules);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 15px;
  margin-bottom: 15px;
}

.column-container {
  display: flex;
  flex-flow: row;
}

.column {
  display: flex;
  flex-flow: column;

  & + .column {
    margin-left: 30px;
  }
}

.item {
  width: 190px;

  & + .item {
    margin-top: 18px;
  }
}

.item-title {
  color: $dark_blue;
  font-size: 15px;
  line-height: 1em;
  letter-spacing: 0;
  margin: 0 0 12px 0;
}

.select {
  min-width: 190px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid $light_gray_blue_3;
  color: $gray_blue_4;
  background-color: $white_1;
  line-height: 1em;
  letter-spacing: 0;
}
</style>
