<template>
  <div>
    <div class="public-target-wrapper">
      <div class="public-target-heading-wrapper">
        <p class="public-target-title">公開対象(詳細設定)</p>
        <div class="public-target-peaple" @click="clickChange">
          <p class="public-target-peaple-text">{{ memberTotalCount }}名</p>
          <img
            src="/icon/Icon-arrow_right_pink.svg"
            class="arrow-right"
            alt=""
          />
        </div>
      </div>
      <div class="public-target-button-wrapper">
        <button
          v-for="item in companyMember"
          :key="item.company_uuid"
          class="organization-button"
        >
          <p class="organization-name">{{ item.company_name }}</p>
          <p class="organization-peaple">{{ item.users.length }}名</p>
          <img
            src="/icon/icon_delete.svg"
            class="delete-icon"
            alt=""
            @click="deleteCompany(item.company_uuid)"
          />
        </button>
      </div>
      <base-button size="large" class="change-button" @click="clickChange">
        <img src="/app/icon/Icon-plus-pink.svg" class="plus-icon" alt="" />
        公開対象の変更
      </base-button>
    </div>
    <SelectMembersModal
      v-if="isModalVisible"
      type="publish"
      :selected-public-members="members"
      :all-organizations="allOrganizations"
      @close="closeModal"
      @select="onMembersSelect"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import SelectMembersModal from '@/components/App/organisms/common/SelectMembersModal.vue';

type Employee = AppApiResponse.User;
type CompanyMember = {
  company_uuid: string;
  company_name: string;
  users: User[];
};

type User = {
  uuid: string;
  name: string;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    BaseButton,
    SelectMembersModal,
  },
  props: {
    selectPublicMembers: {
      type: Array as PropType<string[]>,
      required: true,
    },
    employees: {
      type: Array as PropType<AppApiResponse.Employee[]>,
      required: true,
    },
    allOrganizations: {
      type: Array as PropType<AppApiResponse.Organization[]>,
      default: null,
    },
  },
  data: () => ({
    isModalVisible: false as boolean,
    members: [] as Employee[],
    companyMember: [] as CompanyMember[],
  }),
  computed: {
    memberTotalCount(): number {
      return this.members.length;
    },
  },
  watch: {
    selectPublicMembers() {
      this.setCompanyMember();
    },
  },
  created() {
    if (this.selectPublicMembers && this.selectPublicMembers.length > 0) {
      this.members = this.employees
        .filter((item: AppApiResponse.Employee) =>
          this.selectPublicMembers.includes(item.user_uuid)
        )
        .map((item: AppApiResponse.Employee) => ({
          ...item,
          uuid: item.user_uuid,
          icon: item.user_icon,
          position_name: '',
          enrollment_text: '',
          enrollment_color: '',
        }));
      this.companyMember = this.getMembersCompany(this.members);
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    clickChange() {
      this.openModal();
    },
    getMembersCompany(members: Employee[]): CompanyMember[] {
      return members.reduce((result: CompanyMember[], user: Employee) => {
        const element = result.find(
          (item: CompanyMember) => item.company_uuid === user.company_uuid
        );

        if (element) {
          element.users.push({
            uuid: user.uuid,
            name: user.name,
          });
        } else {
          result.push({
            company_uuid: user.company_uuid,
            company_name: user.company_name,
            users: [{ uuid: user.uuid, name: user.name }],
          });
        }
        return result;
      }, []);
    },
    getSelectedMembersDetail(): Employee[] {
      return this.employees
        .filter((item: AppApiResponse.Employee) =>
          this.selectPublicMembers.includes(item.user_uuid)
        )
        .map((item: AppApiResponse.Employee) => ({
          ...item,
          uuid: item.user_uuid,
          icon: item.user_icon,
          position_name: '',
          enrollment_text: '',
          enrollment_color: '',
        }));
    },
    deleteCompany(uuid: string) {
      this.companyMember = this.companyMember.filter(
        (item: CompanyMember) => item.company_uuid !== uuid
      );
      this.members = this.members.filter(
        (item: Employee) => item.company_uuid !== uuid
      );
      this.$emit('select', this.setMembers());
    },
    onMembersSelect(members: Employee[]): void {
      this.members = members;
      this.$emit('select', this.getSelectMemberUuids(this.members));
      this.setCompanyMember();
    },
    getSelectMemberUuids(members: Employee[]): string[] {
      return members.map((item: Employee) => item.uuid);
    },
    setCompanyMember() {
      // 既に選択済の場合はpropsで渡ってきたuuidをもとに詳細情報を取得し代入している
      if (this.selectPublicMembers.length > 0) {
        this.members = this.getSelectedMembersDetail();
        this.companyMember = this.getMembersCompany(this.members);
        return;
      }
      this.companyMember = this.getMembersCompany(this.members);
    },
    setMembers(): string[] {
      return this.companyMember.flatMap((item: CompanyMember) => {
        return item.users.map((user: User) => user.uuid);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.public-target-heading-wrapper {
  display: flex;
  align-items: center;
  margin: 0 0 15px;
}

.public-target-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 15px 0 0;
}

.public-target-peaple {
  cursor: pointer;
  display: flex;
  align-items: center;

  .public-target-peaple-text {
    font-family: 'Lato', 'Hiragino Kaku Gothic Pro', sans-serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 1em;
    color: $dark_blue;
    margin: 0 15px 0 0;
  }

  .arrow-right {
    width: 8px;
  }
}

.public-target-button-wrapper {
  display: flex;
  align-items: center;
  width: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 0 40px;
}

.organization-button {
  display: flex;
  align-items: center;
  font-size: 15px;
  border: 1px solid $job_type_border;
  border-radius: 4px;
  height: 44px;
  padding: 0 10px;
  line-height: 1em;
  cursor: pointer;
  color: $dark_blue;
  background-color: $true_white;
  flex-shrink: 0;

  &:not(:last-child) {
    margin-right: 8px;
  }

  .organization-name {
    margin: 0 3px 0 0;
  }

  .organization-peaple {
    margin: 0 3px 0 0;
  }

  .delete-icon {
    width: 16px;
  }
}

.change-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $light_gray_blue_7;
  width: 100%;
  color: $gray_blue_4;

  .plus-icon {
    position: absolute;
    left: 12px;
    width: 20px;
  }

  &:hover {
    background-color: $light_gray_blue_8;
  }
}
</style>
