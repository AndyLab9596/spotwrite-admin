<template>
  <div class="reaction-container">
    <div class="reaction-inner">
      <div
        v-for="reactionIcon in reactionIcons"
        :key="reactionIcon.reactions_uuid"
        class="reaction-column"
      >
        <div
          :class="{
            'reaction-column-check-self': isReactedIcon(
              reactionIcon.reactions_uuid
            ),
          }"
        >
          <img
            :src="reactionIcon.content"
            class="reaction-img"
            @click="clickReaction(reactionIcon.reactions_uuid)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    reactionIcons: {
      type: Array as PropType<ApiResponse.ReactionIcon[]>,
      required: true,
    },
    message: {
      type: Object as PropType<ApiResponse.MessageItem>,
      required: true,
    },
  },
  computed: {
    isReactedIcon() {
      return (reactions_uuid: string): any => {
        return this.message.reaction_info?.reactions
          .filter(
            (n: { user_info: any }) =>
              n.user_info.uuid === this.$accessor.userProfile.uuid
          )
          .some(
            (s: { reaction_uuid: string }) => s.reaction_uuid === reactions_uuid
          );
      };
    },
  },
  methods: {
    clickReaction(reactions_uuid: string) {
      this.$emit('clickReaction', reactions_uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.reaction-container {
  padding: 3px;
}

.reaction-inner {
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 7px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.reaction-img {
  height: 30px;
  display: inline-block;
}

.reaction-column {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 4px;
}

.reaction-column-check-self::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 18px;
  width: 7px;
  height: 7px;
  background-color: #0084ff;
  border-radius: 10px;
}

.reaction-count {
  display: inline-block;
  font-size: 12px;
  color: #0084ff;
}
</style>
