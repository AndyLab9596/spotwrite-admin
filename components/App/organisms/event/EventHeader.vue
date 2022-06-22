<template>
  <div>
    <div class="year">
      <select v-model="year" @change="changeYear">
        <option v-for="item in years" :key="item" :value="item">
          {{ item }}年
        </option>
      </select>
      <div class="button-wrapper">
        <button v-if="!isVisitor" class="create-button" @click="createPost">
          イベントを作る
        </button>
        <button class="event-button" @click="changeCompletedEvent">
          {{ buttonText }}
        </button>
      </div>
    </div>
    <post-create-modal v-if="showPostCreateModal" @close="closeCreatePost" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';

export default Vue.extend({
  components: {
    PostCreateModal,
  },
  props: {
    years: {
      type: Array as PropType<number[]>,
      required: true,
      default: [],
    },
    selectYear: {
      type: Number,
      required: true,
      default: 0,
    },
    isCompletedEvent: {
      type: Boolean,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      year: 0 as number,
      showPostCreateModal: false as boolean,
    };
  },
  computed: {
    buttonText(): string {
      return this.isCompletedEvent ? '開催前のイベント' : '終了したイベント';
    },
  },
  created() {
    this.year = this.selectYear;
  },
  methods: {
    createPost() {
      this.openCreatePost();
    },
    openCreatePost() {
      this.showPostCreateModal = true;
    },
    closeCreatePost() {
      this.showPostCreateModal = false;
    },
    changeYear() {
      this.$emit('onChange', this.year);
    },
    changeCompletedEvent() {
      if (this.isCompletedEvent) {
        this.$emit('onChangeCompletedEvent', false);
      }
      if (!this.isCompletedEvent) {
        this.$emit('onChangeCompletedEvent', true);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.year {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f3f7;
  width: 100%;
  height: 37px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 1px 4px rgba(220, 229, 239, 1);
}

select::-ms-expand {
  display: none;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 68px;
  height: 37px;
  border: none;
  background-color: #f2f3f7;
  background-image: url('/app/icon/Icon-pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right;
  color: #585a69;
  font-weight: 600;
  font-size: 15px;
  margin-left: 16px;
  cursor: pointer;
}

.button-wrapper {
  display: flex;
  align-items: center;
}

.create-button {
  background-color: $true_white;
  height: 28px;
  color: $link_color;
  border: 1px solid $link_color;
  text-align: center;
  font-size: 12px;
  border-radius: 4px;
  margin-right: 10px;
  padding: 0 16px;
  font-weight: 600;
}

.event-button {
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
