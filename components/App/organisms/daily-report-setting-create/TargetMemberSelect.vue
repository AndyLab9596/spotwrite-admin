<template>
  <div class="target-member-select-wrapper">
    <title-item :title="title" />
    <div class="select-member-wrapper">
      <p class="select-member-wrapper-title">
        対象メンバー({{ memberTotalCount }}名)
      </p>
      <BaseButton inverse size="large" class="edit-button" @click="openModal">
        日報対象の編集
      </BaseButton>
    </div>
    <div v-if="companyMember.length > 0" class="button-wrapper">
      <company-button
        v-for="item in companyMember"
        :key="item.company_uuid"
        :item="item"
        class="company-button"
        @delete="deleteCompany"
      />
    </div>
    <SelectMembersModal
      v-if="selectMemberModal"
      type="publish"
      @close="closeModal"
      @select="onMembersSelect"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TitleItem from '@/components/App/organisms/daily-report-setting-create/common-items/TitleItem.vue';
import CompanyButton from '@/components/App/organisms/daily-report-setting-create/common-items/CompanyButton.vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
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
  components: {
    TitleItem,
    BaseButton,
    CompanyButton,
    SelectMembersModal,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    targetMembers: {
      type: Array as PropType<string[]>,
      required: true,
    },
    employees: {
      type: Array as PropType<AppApiResponse.Employee[]>,
      required: true,
    },
  },
  data: () => ({
    selectMemberModal: false as boolean,
    members: [] as Employee[],
    companyMember: [] as CompanyMember[],
  }),
  computed: {
    memberTotalCount(): number {
      return this.members.length;
    },
  },
  watch: {
    targetMembers: {
      handler() {
        this.setCompanyMember();
      },
      immediate: true,
    },
  },
  methods: {
    openModal() {
      this.selectMemberModal = true;
    },
    closeModal() {
      this.selectMemberModal = false;
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
          this.targetMembers.includes(item.user_uuid)
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
      if (this.targetMembers.length > 0) {
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
.select-member-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 36px 38px 21px;
}

.select-member-wrapper-title {
  font-size: 13px;
  color: $main_color;
  line-height: 1em;
  font-weight: bold;
}

.edit-button {
  width: 136px;
  height: 28px;
}

.button-wrapper {
  display: flex;
  align-items: center;
  width: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 38px 40px;
}

.company-button {
  margin: 0 8px 0 0;

  &:last-of-type {
    margin: 0;
  }
}
</style>
