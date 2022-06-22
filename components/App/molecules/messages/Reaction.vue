<template>
  <div class="reaction-container" @click="checkReactionUsers">
    <div class="reaction-inner">
      <div
        v-for="reactionIcon in reactionIconList"
        :key="reactionIcon.reactions_uuid"
        class="reaction-column"
      >
        <img :src="reactionIcon.content" class="reaction-img" />
        <div class="reaction-count">
          {{ reactionCount(reactionIcon.reactions_uuid) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<ApiResponse.MessageItem>,
      required: true,
    },
    reactionIcons: {
      type: Array as PropType<ApiResponse.ReactionIcon[]>,
      required: true,
    },
  },
  computed: {
    reactionIconList(): Array<ApiResponse.ReactionIcon> | undefined {
      const reactionUuids = [
        ...new Set(
          this.message.reaction_info?.reactions.map(
            (n: { reaction_uuid: string }) => n.reaction_uuid
          )
        ),
      ] as Array<string>;
      return this.reactionIcons.filter((n: ApiResponse.ReactionIcon) =>
        reactionUuids.some((s: string) => s === n.reactions_uuid)
      );
    },
    reactionCount() {
      return (reactionUuid: string): number => {
        if (!this.message.reaction_info) return 0;
        return this.message.reaction_info.reactions.filter(
          (n: { reaction_uuid: string }) => n.reaction_uuid === reactionUuid
        ).length;
      };
    },
  },
  methods: {
    checkReactionUsers() {
      this.$emit('click', this.message);
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
  padding: 3px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  height: 22px;
}

.reaction-img {
  height: 15px;
  display: inline-block;
}

.reaction-column {
  display: flex;
  align-items: center;
  margin-right: 4px;
}

.reaction-count {
  display: inline-block;
  font-size: 12px;
  color: #0084ff;
}
</style>
