<template>
  <div class="star-rating">
    <span
      v-for="(star, i) in stars"
      :key="i"
      class="star"
      :class="{ editable }"
      @click="onClick(i)"
      >{{ star }}</span
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    rating: {
      type: Number,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maxRating: 5,
    };
  },
  computed: {
    stars(): string[] {
      const activeStar = new Array(this.maxRating).fill('★');
      return activeStar.fill('☆', this.rating);
    },
  },
  methods: {
    onClick(i: number) {
      if (this.editable) {
        this.$emit('click', i + 1);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.star-rating {
  height: 12px;
  line-height: 10px;
}

.star {
  color: $pink;
  font-size: 12px;

  & + & {
    margin-left: 4px;
  }
}

.editable {
  cursor: pointer;
}

.editable:hover {
  opacity: 0.7;
}
</style>
