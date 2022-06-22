<template>
  <div class="tab-wrappper" :style="width">
    <div class="tab">
      <div class="tab__main">
        {{ firstTabName }}
      </div>
      <div class="tab__sub" @click="toggleExtractionModal">
        <div
          class="tab__name"
          @mouseover="openOrganization"
          @mouseleave="closeOrganization"
        >
          <div v-if="tabName.company" class="tab__company">
            {{ tabName.company }}
          </div>
          <div>
            {{ tabName.organization }}
          </div>
        </div>
        <div v-if="hoverTabName" class="tab__organization">
          {{ joinOrganizationName }}
        </div>
      </div>
      <div class="tab__attention">{{ attention }}</div>
    </div>
    <div v-if="isSearch" class="search">
      <input
        v-model="freeWord"
        type="text"
        name="searchbox"
        class="input__search"
        placeholder="名前で検索"
      />
      <button class="button__search" @click="search">検索</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  layout: 'admin/default',
  props: {
    firstTabName: {
      type: String,
      required: true,
    },
    tabName: {
      type: Object as PropType<Types.TabName>,
      required: true,
    },
    selectedOrganizationName: {
      type: Array as PropType<string[]>,
      required: true,
    },
    attention: {
      type: String,
      required: true,
    },
    isType: {
      type: String,
      required: true,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hoverTabName: false as boolean,
      freeWord: '' as string,
    };
  },
  computed: {
    joinOrganizationName(): string {
      return this.selectedOrganizationName.join('、');
    },
    width(): { [key: string]: string } {
      return this.isType === 'register'
        ? { width: '1014px' }
        : { width: '1206px' };
    },
  },
  methods: {
    toggleExtractionModal() {
      this.$emit('click');
    },
    openOrganization() {
      this.hoverTabName =
        this.selectedOrganizationName.length > 0 &&
        this.tabName.organization !== '全ての組織（BOX）';
    },
    closeOrganization() {
      this.hoverTabName = false;
    },
    search() {
      this.$emit('search', this.freeWord);
      this.clearFreeWord();
    },
    clearFreeWord() {
      this.freeWord = '';
    },
  },
});
</script>

<style lang="scss" scoped>
.tab-wrappper {
  // width: 1014px;
  border-bottom: 1px solid #e4e5ed;
  text-align: center;
  display: flex;
  justify-content: space-between;
  margin: 35px 0 15px;
}

.tab {
  font-size: 15px;
  text-align: center;
  display: flex;

  &__main {
    font-weight: bold;
    width: 180px;
    height: 50px;
    background: #f7f8fd;
    border: 1px solid #e4e5ed;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    line-height: 50px;
  }

  &__sub {
    font-weight: bold;
    height: 46px;
    background-color: $light_gray_blue_7;
    border-radius: 4px;
    padding: 0 15px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1em;
    margin: 0 0 0 20px;
    position: relative;

    &:hover {
      background-color: $light_gray_blue_8;
    }
  }

  &__organization {
    position: absolute;
    left: 95%;
    bottom: -13px;
    border: 1px solid $light_gray_blue_3;
    background-color: $true-white;
    font-size: 13px;
    padding: 5px;
    color: $dark_blue;
    font-weight: 300;
    white-space: nowrap;
  }

  &__company {
    font-size: 11px;
    line-height: 1em;
    display: block;
    margin: 0 0 4px 0;
  }

  &__attention {
    margin-left: 20px;
    margin-bottom: 0;
    height: 46px;
    line-height: 75px;
  }

  &__name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.search {
  display: flex;
  justify-content: flex-end;
  margin: auto 0 auto auto;

  .input {
    &__search {
      width: 160px;
      height: 30px;
      border: 1px solid $light_gray_blue_3;
      background-color: $extra_light_gray;
      border-radius: 4px;
      color: $gray_blue_4;
      font-size: 13px;
      font-weight: 300;
      padding: 0 0 0 8px;
      font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
    }

    ::placeholder {
      color: $placeholder_gray;
    }
  }

  .button {
    &__search {
      font-weight: bold;
      color: $true_white;
      font-size: 13px;
      background: $gray_blue_3;
      border-radius: 4px;
      border: none;
      padding: 5px 12px 4px;
      margin-left: 8px;
      margin-right: 31px;

      &:hover {
        background: $gray_blue_4;
      }
    }
  }
}
</style>
