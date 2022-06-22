<template>
  <div>
    <div
      class="hero-image"
      :style="{
        backgroundImage: 'url(' + mainImage + ')',
      }"
    >
      <div v-if="isChangeOrganizationPermission">
        <a
          :href="
            `/admin/organization-management/organizations/${typeMap[type]}/${uuid}`
          "
          class="button"
        >
          <img
            class="icon"
            width="14"
            height="14"
            src="/icon/icon_pen@2x.png"
          />
          組織情報の編集
        </a>
      </div>
    </div>
    <header class="company-header">
      <div class="organization-header__title">
        <img
          class="logo"
          :class="{ 'logo--company': isCompany, 'logo--other': !isCompany }"
          :src="`${logoImage}`"
          :onerror="
            isCompany
              ? `document.getElementById('name-${uuid}').style.display = null; this.remove();`
              : `this.remove();`
          "
        />
        <span
          v-if="orgName"
          :id="`name-${uuid}`"
          :class="{ 'name--company': isCompany, 'name--other': !isCompany }"
          :style="{ display: isCompany ? 'none' : null }"
        >
          {{ orgName }}
        </span>
      </div>
      <div class="employee-count">
        社員数：{{ userCount }}名
        <span v-if="establishDate && isCompany" class="establish-date">
          設立日：{{ establishDate }}
        </span>
      </div>
      <img
        v-if="isFavorite === true"
        src="@/assets/image/icon/favorite_y.png"
        class="favorite"
        @click.stop="unfavorite"
      />
      <img
        v-if="isFavorite === false"
        src="@/assets/image/icon/favorite.png"
        class="favorite"
        @click.stop="favorite"
      />
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchUser } from '@/libs/api';

export default Vue.extend({
  props: {
    logoImage: {
      default: '/image/no-image.png',
      type: String,
    },
    userCount: {
      default: null,
      type: Number,
    },
    isCompany: {
      required: true,
      type: Boolean,
    },
    orgName: {
      default: null,
      type: String,
    },
    mainImage: {
      default: null,
      type: String,
    },
    isFavorite: {
      default: false,
      type: Boolean,
    },
    type: {
      type: String,
      default: '',
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    establishDate: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      typeMap: {
        company: 'companies',
        department: 'departments',
        branch: 'shops',
        shop: 'shops',
        management: 'managements',
        other: 'others',
      },
      userAuthorities: undefined as Types.Authorities | undefined,
    };
  },
  computed: {
    isChangeOrganizationPermission(): boolean {
      return !!this.userAuthorities?.admin?.length;
    },
  },
  created() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      // FIXME: レスポンスの型定義間違っているので any にしてこの修正に関係ないところに影響が出ないようにした
      const {
        data: { authorities },
      }: { data: any } = await fetchUser(this.$accessor.userProfile.uuid);
      this.userAuthorities = authorities as Types.Authorities;
    },
    favorite() {
      this.$emit('favorite', this.$props.uuid);
    },
    unfavorite() {
      this.$emit('unfavorite', this.$props.uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.hero-image {
  position: relative;
  width: 100%;
  height: 152px;
  border-radius: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.no-image {
  background-image: url('/static/image/no-image.png');
}

.company-header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.organization-header__title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 14px 0 0;
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
}

.logo {
  width: 142px;
  height: auto;

  &--company {
    margin: 16px 0 0;
  }

  &--other {
    margin: 0 16px;
  }
}

.name {
  font-weight: bold;

  &--company {
    font-size: 15px;
  }

  &--other {
    font-size: 13px;
  }
}

.favorite {
  background-repeat: no-repeat;
  background-size: 12px 16px;
  height: 16px;
  width: 12px;
  position: absolute;
  top: calc(50% - 8px);
  right: 0;
  line-height: 100%;
  cursor: pointer;
}

.employee-count {
  margin: 8px 0 13px;
  font-size: 11px;
  line-height: 1;
  color: $main_color;
}

.establish-date {
  margin-left: 5px;
}

.button {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 12px;
  top: 10px;
  right: 10px;
  background: $gray_blue_6;
  color: $true_white;
  opacity: 0.6;
  border-radius: 4px;
  line-height: 1;
}

.icon {
  color: $true_white;
  margin-right: 8px;
}
</style>
