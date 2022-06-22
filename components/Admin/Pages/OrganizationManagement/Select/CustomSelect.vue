<template>
  <div class="select-wrapper">
    <div
      class="view"
      @click="open()"
      @mouseover="displayAbbreviatedName()"
      @mouseleave="hideAbbreviatedName()"
    >
      <div>
        <div ref="displayName" class="display-name">
          {{ selectedItemName }}
        </div>
        <div v-if="showFullyName" class="fully-name">
          {{ selectedItemName }}
        </div>
      </div>
      <div>
        <svg
          id="Icon_pulldown"
          data-name="Icon/pulldown"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="8"
          viewBox="0 0 10 8"
        >
          <path
            id="Path_845"
            data-name="Path 845"
            d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
            transform="translate(-440.439 -106.046)"
            fill="#7e8195"
          />
        </svg>
      </div>
    </div>
    <transition name="fade">
      <div v-if="show" ref="selections" class="items">
        <div
          v-for="item in items"
          :key="item.name"
          class="item"
          @click="select(item)"
        >
          <div v-if="item.upperOrganization" class="upper-organization">
            {{ item.upperOrganization }}
          </div>
          <div class="name">
            <svg
              v-if="item.name === selectedItemName"
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="11.24"
              viewBox="0 0 17 11.24"
            >
              <path
                id="Path_2126"
                data-name="Path 2126"
                d="M683.885,826.606l4.725,4.528,9.45-8.465"
                transform="translate(-682.471 -821.257)"
                fill="none"
                stroke="#e4e5ed"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="2"
              />
            </svg>
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="position"
          class="register-text"
          @click="$emit('open-position-register-modal')"
        >
          役職を登録する
        </div>
        <div
          v-if="employmentStatuses"
          class="register-text"
          @click="$emit('open-employment-statuses-register-modal')"
        >
          雇用形態を登録する
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type Select = {
  uuid: string;
  name: string;
  upperOrganization?: string;
};

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: null,
    },
    items: {
      type: Array,
      required: true,
    },
    position: {
      type: Boolean,
      default: false,
    },
    employmentStatuses: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedItem: '',
      upperOrganization: '',
      show: false,
      lock: false,
      ticking: false,
      showFullyName: false,
    };
  },
  computed: {
    selectedItemName: {
      get(): string {
        const items = this.items as Select[];
        if (
          (this.value == null || this.value === '') &&
          this.selectedItem === ''
        )
          return this.selectedItem;

        return this.selectedItem === ''
          ? items.find((item: { uuid: string }) => item.uuid === this.value)!
              .name
          : this.selectedItem;
      },
      set(value: string) {
        this.selectedItem = value;
      },
    },
    selectionPosition: {
      get(): number {
        const e = this.$refs.selections as any;
        return e.offsetLeft;
      },
    },
  },
  methods: {
    select(item: { uuid: string; name: string }) {
      if (this.selectedItemName === item.name) {
        return;
      }
      this.selectedItemName = item.name;
      this.$emit('input', item.uuid);
      this.$emit('change');
    },
    displayAbbreviatedName() {
      const e = this.$refs.displayName as Element;
      // TODO: cssのwidth値と連動しているので注意
      if (e.clientWidth === 57) {
        this.showFullyName = true;
      }
    },
    hideAbbreviatedName() {
      this.showFullyName = false;
    },
    adjustSelectionElementPosition() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.ticking = false;
          this.positionSelectionElement();
        });
        this.ticking = true;
      }
    },
    positionSelectionElement() {
      const d: any = document;
      const e = this.$refs.selections as any;
      if (e == null) {
        return;
      }
      e.style.left = `${this.selectionPosition -
        d.getElementById('table-wrapper').scrollLeft}px`;
    },
    open() {
      this.show = true;
      this.lock = true;
      setTimeout(() => {
        this.lock = false;
        if (document == null) {
          return;
        }
        const d: any = document;
        d.getElementById('__nuxt').addEventListener('click', this.close, false);
        d.getElementById('table-wrapper').addEventListener(
          'scroll',
          this.adjustSelectionElementPosition,
          !d.documentMode ? { passive: true } : false
        );
      }, 250);
      setTimeout(() => this.positionSelectionElement(), 0);
    },
    close() {
      if (this.lock || document == null) {
        return;
      }
      this.show = false;
      const d: any = document;
      d.getElementById('__nuxt').removeEventListener(
        'click',
        this.close,
        false
      );
      d.getElementById('table-wrapper').removeEventListener(
        'scroll',
        this.adjustSelectionElementPosition,
        !d.documentMode ? { passive: true } : false
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.select-wrapper {
  /* TODO: これを変更すると省略文字ポップアップの挙動が変わるので注意 */
  width: 80px;
}

.view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  text-align: left;
  cursor: default;
  height: 100%;
}

.display-name {
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.fully-name {
  z-index: 10;
  position: absolute;
  padding: 4px;
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  width: 190px;
  white-space: normal;
}

.items {
  z-index: 20;
  position: absolute;
  padding: 0 5px;
  box-shadow: 0 0 3px 0 $light_gray;
  background-color: $true_white;
  width: 150px;
}

.item {
  padding: 5px 0;
  flex-direction: column;
  display: flex;
  cursor: pointer;

  &:hover {
    background-color: $light_gray_blue_3;
  }
}

.name {
  display: flex;
  justify-content: start;
  align-items: center;
  white-space: normal;
  text-align: left;
}

.closed-arrow {
  vertical-align: middle;
}

.register-text {
  text-align: left;
  cursor: pointer;
  color: $pink;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
