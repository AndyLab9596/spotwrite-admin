<template>
  <div class="star-rating">
    <span v-for="(star, i) in stars" :key="i" class="star">
      {{ star }}
    </span>
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
});
</script>

<style lang="scss" scoped>
.star-rating {
  height: 12px;
  line-height: 12px;
}

.star {
  display: inline-block;
  width: 12px;
  color: $pink;
  font-size: 15px;

  & + & {
    margin-left: 4px;
  }
}
</style>
