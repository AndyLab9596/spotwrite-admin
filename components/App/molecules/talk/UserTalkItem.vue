<template>
  <div class="user-talk-item">
    <profile-icon
      v-if="commentPosition === 'left'"
      :uuid="uuid"
      :icon="icon"
      :name="name"
      :hide-name="true"
      :class="`${commentPosition}-user-talk-item-icon`"
      :is-visitor="isVisitor"
    />
    <talk-item
      :content="content"
      :comment-position="commentPosition"
      :profile-name="name"
      :pattern="pattern"
    />
    <profile-icon
      v-if="commentPosition === 'right'"
      :uuid="uuid"
      :icon="icon"
      :name="name"
      :hide-name="true"
      :class="`${commentPosition}-user-talk-item-icon`"
      :is-visitor="isVisitor"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProfileIcon from '../profile/ProfileIcon.vue';
import TalkItem from './TalkItem.vue';

export default Vue.extend({
  components: {
    ProfileIcon,
    TalkItem,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    commentPosition: {
      type: String,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    pattern: {
      type: String,
      required: false,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.user-talk-item {
  display: flex;
  align-items: flex-start;
}

.left-user-talk-item-icon {
  margin: 0 31px 0 0;
}

.right-user-talk-item-icon {
  margin: 0 0 0 31px;
}
</style>
