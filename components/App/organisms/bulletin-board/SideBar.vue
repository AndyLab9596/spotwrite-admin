<template>
  <div class="side-bar-wrapper">
    <img src="/icon/arrow_left.svg" class="arrow-left" alt="" />
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
    <template v-for="company in companies" v-else>
      <div
        :key="company.uuid"
        class="side-bar-company-name toggle-label"
        :class="{
          active: active(company.uuid),
        }"
        @click="toggleAccordion(company.uuid)"
      >
        {{ company.name }}
        <img src="/app/icon/details_grey.svg" />
      </div>
      <transition
        :key="company.uuid + 'transition'"
        name="accordion"
        @before-enter="beforeEnter"
        @enter="enter"
        @before-leave="beforeLeave"
        @leave="leave"
      >
        <div v-if="isOpen(company.uuid)" :key="company.uuid + 'detail'">
          <template v-for="parent in getParent(company.uuid)">
            <p
              :key="parent.uuid"
              class="side-bar-organization-name"
              :class="{
                active: active(parent.uuid),
              }"
              @click="selectOrganization(parent.uuid)"
            >
              {{ parent.name }}
            </p>
            <template v-for="children in getChild(company.uuid, parent.uuid)">
              <p
                :key="parent.uuid + children.uuid"
                class="side-bar-organization-name"
                :class="{
                  active: active(children.uuid),
                }"
                @click="selectOrganization(children.uuid)"
              >
                {{ children.name }}
              </p>
            </template>
          </template>
        </div>
      </transition>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  components: {
    VueLoading,
  },
  props: {
    organizations: {
      type: Array as PropType<AppApiResponse.Organization[]>,
      required: true,
    },
    selectedOrganization: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openAccordions: [] as string[],
    };
  },
  computed: {
    companies(): AppApiResponse.Organization[] {
      return this.organizations.filter(
        (organization: AppApiResponse.Organization) => organization.layer === 0
      );
    },
  },
  watch: {
    organizations() {
      if (this.companies && this.companies.length) {
        this.openAccordions.push(this.companies[0].uuid);
      }
    },
  },
  mounted() {
    if (this.companies && this.companies.length) {
      this.openAccordions.push(this.companies[0].uuid);
    }
  },
  methods: {
    getParent(uuid: string) {
      return this.organizations.filter(
        (organization: AppApiResponse.Organization) =>
          organization.relations.company === uuid && organization.layer === 1
      );
    },
    getChild(companyUuid: string, parentUuid: string) {
      return this.organizations.filter(
        (organization: AppApiResponse.Organization) =>
          organization.relations.company === companyUuid &&
          organization.relations.parent === parentUuid &&
          organization.layer === 2
      );
    },
    selectOrganization(uuid: string) {
      this.$emit('onChange', uuid);
    },
    active(uuid: string): boolean {
      return this.selectedOrganization === uuid;
    },
    isOpen(uuid: string): boolean {
      return this.openAccordions.includes(uuid);
    },
    toggleAccordion(uuid: string) {
      if (this.isOpen(uuid)) {
        this.openAccordions = this.openAccordions.filter(
          (orgUuid: string) => orgUuid !== uuid
        );
      } else {
        this.openAccordions.push(uuid);
      }
    },
    beforeEnter(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = '0';
    },
    enter(element: HTMLElement) {
      const height = `${element.scrollHeight}px`;
      // eslint-disable-next-line no-param-reassign
      element.style.height = height;
    },
    beforeLeave(element: HTMLElement) {
      const height = `${element.scrollHeight}px`;
      // eslint-disable-next-line no-param-reassign
      element.style.height = height;
    },
    leave(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = '0';
    },
  },
});
</script>

<style lang="scss" scoped>
.side-bar-wrapper {
  height: 768px;
  width: 168px;
  max-width: 168px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
}

.arrow-left {
  width: 10px;
  margin: 42px 16px 14px;
  cursor: pointer;
}

.side-bar-company-name {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: $main_color;
  line-height: 1em;
  height: 32px;
  padding: 0 16px 0;
}

.side-bar-organization-name {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 300;
  color: $main_color;
  line-height: 1em;
  height: 32px;
  cursor: pointer;
  padding: 0 16px 0;
}

.active {
  background-color: $link_color;
  color: $true_white;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  border-bottom: 1px solid $light_gray_blue_2;
  cursor: pointer;
  height: auto;
}

.accordion {
  &-enter-active {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-name: accordion--anime__opened;
  }

  &-leave-active {
    animation-duration: 0.1s;
    animation-fill-mode: both;
    animation-name: accordion--anime__closed;
  }
}

@keyframes accordion--anime__opened {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes accordion--anime__closed {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
