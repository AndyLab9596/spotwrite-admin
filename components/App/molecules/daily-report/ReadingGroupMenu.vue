<template>
  <div>
    <accordion
      tag="main"
      :body="mainMenuItems"
      :selected="selected.main"
      @click="selectMainGroup"
    >
    </accordion>

    <accordion
      tag="sub"
      :body="subMenuItems"
      :selected="selected.sub"
      @click="selectSubGroup"
    >
    </accordion>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Accordion from '@/components/App/molecules/daily-report/Accordion.vue';

type MenuItem = { uuid: string; title: string };

export default Vue.extend({
  components: {
    Accordion,
  },
  props: {
    mainMenuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
    subMenuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true,
    },
  },
  data() {
    return {
      selected: {
        main: '',
        sub: '',
      },
      isShow: {
        main: false,
        sub: false,
      },
    };
  },
  methods: {
    showMainGroupPopup() {
      // console.log('show');
    },
    hideMainGroupPopup() {
      // console.log('hide');
    },
    selectMainGroup(uuid: string) {
      this.clearSelectedItem();
      if (uuid.indexOf('main') === 0) {
        this.selected.main = uuid.replace('main-', '');
        this.$emit('select-main-group', this.selected.main);
      }
    },
    selectSubGroup(uuid: string) {
      this.clearSelectedItem();
      if (uuid.indexOf('sub') === 0) {
        this.selected.sub = uuid.replace('sub-', '');
        this.$emit('select-sub-group', this.selected.sub);
      }
    },
    clearSelectedItem() {
      this.selected = {
        main: '',
        sub: '',
      };
    },
  },
});
</script>
