<template>
  <div>
    <div v-if="publicTitle" class="title-wrapper">
      <p class="public-setting-title">記事設定</p>
    </div>
    <div class="article-setting-wrapper">
      <p class="article-text">重要な記事に設定する</p>
      <toggle-button
        v-model="importantArticle"
        @onChange="changeArticleImportant"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ToggleButton from '@/components/App/atoms/buttons/ToggleButton.vue';

export default Vue.extend({
  components: {
    ToggleButton,
  },
  props: {
    isImportant: {
      type: Boolean,
      required: true,
    },
    publicTitle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    importantArticle: false as boolean,
  }),
  created() {
    this.importantArticle = this.isImportant;
  },
  methods: {
    changeArticleImportant(value: boolean) {
      this.importantArticle = value;
      this.$emit('changeArticleImportant', this.importantArticle);
    },
  },
});
</script>

<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $white_1;
  padding: 18px 24px 17px;
  margin: 0 0 30px;
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.public-setting-title {
  font-size: 15px;
  font-weight: 600;
  color: $gray_blue_4;
}

.article-setting-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 698px;
  margin: 0 0 0 30px;
}

.article-text {
  font-size: 15px;
  font-weight: 300;
  color: $dark_blue;
}
</style>
