<template>
  <div class="pagination">
    <div class="label-box">
      <div>{{ start }}</div>
      <div>
        〜
      </div>
      <div>
        {{ end }}
      </div>
      <div class="slash gray">/</div>
      <div class="gray">{{ value.total }}</div>
    </div>
    <button class="page-handle" @click="goToPage(value.number - 1)">
      <img class="icon" src="/icon/icon_caret-left.png" alt="" />
    </button>
    <button class="page-handle double" @click="goToPage(1)">
      <img class="icon" src="/icon/icon_backward.png" alt="" />
    </button>
    <button
      v-for="number of totalPageCount"
      :key="number"
      class="page-number"
      :disabled="value.number === number"
      @click="goToPage(number)"
    >
      {{ number }}
    </button>
    <button class="page-handle double" @click="goToPage(totalPageCount)">
      <img class="icon" src="/icon/icon_foward.png" alt="" />
    </button>
    <button class="page-handle" @click="goToPage(value.number + 1)">
      <img class="icon" src="/icon/icon_caret-right.png" alt="" />
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  computed: {
    totalPageCount(): number {
      return Math.ceil(this.value.total / this.value.limit);
    },
    pages(): number[] {
      return [...Array(this.totalPageCount).keys()].map((i: number) => i + 1);
    },
    start(): number {
      return this.value.offset + 1;
    },

    end(): number {
      if (this.value.number === this.totalPageCount) {
        return this.value.total;
      }
      return this.value.offset + this.value.limit;
    },
  },
  methods: {
    goToPage(page: number) {
      if (!this.isValidPage(page)) {
        return;
      }

      this.$emit('input', {
        ...this.value,
        offset: this.value.limit * (page - 1),
        number: page,
      });
      this.$emit('go-to-page', page);
    },
    isValidPage(page: number) {
      const first = 1;
      const last = this.pages.length;
      const validRange = first <= page && page <= last;
      const notCurrentPage = this.value.number !== page;
      return validRange && notCurrentPage;
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

.pagination {
  display: flex;
}

.label-box {
  display: flex;
  height: 30px;
  line-height: 32px;
}

.slash {
  margin-right: 5px;
  margin-left: 5px;
}

.gray {
  color: $gray_blue_1;
}

button {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  font-family: 'Lato', sans-serif;
  appearance: none;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
}

.page-handle {
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    width: 9px;
  }
}

.page-handle.double {
  .icon {
    width: 14px;
  }
}

.page-number {
  color: $gray_blue_1;

  &:disabled {
    color: $true_white;
    background-color: $pink;
    border: none;
  }
}
</style>
