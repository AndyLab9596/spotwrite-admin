<template>
  <transition name="modal" appear>
    <div class="modal-window" :class="{ fixed: fixed }">
      <div class="modal-header">
        <div class="row">
          <h3 class="modal-header-title">オプション権限</h3>
          <base-checkbox
            v-model="allCheckbox"
            class="check-box title"
            label="全てのオプション権限にチェックをいれる"
          />
        </div>
        <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
      </div>
      <div class="modal-content">
        <div class="authority-box">
          <base-checkbox
            v-model="adminCheckbox"
            class="authority-checkbox"
            label="管理画面操作権限"
          />
          <div class="content">
            <div class="description">
              管理画面の操作ができます。ただし、分析画面で個人の利用度チェック及びモチベーションチェックは閲覧できません。
            </div>
          </div>
        </div>

        <div class="authority-box">
          <base-checkbox
            v-model="usageCheckbox"
            class="authority-checkbox"
            label="利用度チェック閲覧権限"
          />
          <div class="content">
            <div class="description">
              分析画面の利用度チェックで、会社や組織、個人ごとの分析ができます。<br />
              組織のリーダーにおすすめです。
            </div>
            <div class="selected-companies">
              <span>
                選択中：
              </span>
              <span v-if="readUsageCheck.length === organizations.length"
                >全社</span
              >
              <template v-else>
                <span class="pink">{{ readUsageCheck.length }}</span>
                <span>社</span>
              </template>
            </div>
            <div class="company-list">
              <div
                v-for="(row, index) in chunkedCompanies"
                :key="`row-${index}`"
                class="company-row"
              >
                <base-checkbox
                  v-for="company in row"
                  :key="company.uuid"
                  v-model="readUsageCheck"
                  class="company-checkbox"
                  :value="company.uuid"
                  :label="company.name"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="authority-box">
          <base-checkbox
            v-model="motivationCheckbox"
            class="authority-checkbox pink"
            label="モチベーション閲覧権限"
          />
          <div class="content">
            <div class="description">
              分析画面で、チームや個人のモチベーションがチェックできます。<br />
              下のボックスにチェックを入れると、メンバー個人のモチベーションチェクを閲覧できます。
            </div>

            <div class="personal-information-box">
              <base-checkbox
                v-model="readPersonalInformation"
                label="個人情報閲覧を含める"
              />
              <div class="triangle"></div>
              <div class="attention">
                プライベート情報のため、細心の注意をお願いします。
              </div>
            </div>
            <div class="selected-companies">
              <span>
                選択中：
              </span>
              <span
                v-if="readMotivationAnalytics.length === organizations.length"
                >全社</span
              >
              <template v-else>
                <span class="pink">{{ readMotivationAnalytics.length }}</span>
                <span>社</span>
              </template>
            </div>
            <div class="company-list">
              <div
                v-for="(row, index) in chunkedCompanies"
                :key="`row-${index}`"
                class="company-row"
              >
                <base-checkbox
                  v-for="company in row"
                  :key="company.uuid"
                  v-model="readMotivationAnalytics"
                  class="company-checkbox"
                  :value="company.uuid"
                  :label="company.name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="button-box">
          <base-button size="large" class="modal-button" @click="onSave"
            >保存する</base-button
          >
          <base-button
            size="large"
            class="modal-button"
            inverse
            @click="$emit('close')"
            >キャンセル</base-button
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { chunk } from 'lodash';

type Authorities = {
  admin: string[];
  readMotivationAnalytics: string[];
  readUsageCheck: string[];
  readPersonalInformation: string[];
};

export default Vue.extend({
  components: { BaseCheckbox, BaseButton },
  props: {
    organizations: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
    authorities: {
      type: Object as PropType<Authorities>,
      required: true,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAllSelected: false,
      selectedCategories: [] as string[],
      isDisabledSelected: true,
      admin: [] as string[],
      readMotivationAnalytics: [] as string[],
      readUsageCheck: [] as string[],
      readPersonalInformation: [] as string[],
    };
  },
  computed: {
    allCheckbox: {
      get(): string[] {
        return this.adminCheckbox.length &&
          this.usageCheckbox.length &&
          this.motivationCheckbox.length
          ? ['default']
          : [];
      },
      set(arr: string[]) {
        if (arr.length) {
          this.admin = this.organizations.flatMap(
            (o: ApiResponse.Organization) => o.uuid
          );
        } else {
          this.admin = [];
        }
        this.readUsageCheck = this.admin;
        this.readMotivationAnalytics = this.admin;
      },
    },
    adminCheckbox: {
      get(): string[] {
        if (this.admin.length > 0) {
          return ['default'];
        }
        return [];
      },
      set(arr: string[]) {
        if (arr.length) {
          this.admin = this.organizations.flatMap(
            (o: ApiResponse.Organization) => o.uuid
          );
          return;
        }
        this.admin = [];
      },
    },
    usageCheckbox: {
      get(): string[] {
        if (this.readUsageCheck.length === this.organizations.length) {
          return ['default'];
        }
        return [];
      },
      set(arr: string[]) {
        if (arr.length) {
          this.readUsageCheck = this.organizations.flatMap(
            (o: ApiResponse.Organization) => o.uuid
          );
          return;
        }
        this.readUsageCheck = [];
      },
    },
    motivationCheckbox: {
      get(): string[] {
        if (this.readMotivationAnalytics.length === this.organizations.length) {
          return ['default'];
        }
        return [];
      },
      set(arr: string[]) {
        if (arr.length) {
          this.readMotivationAnalytics = this.organizations.flatMap(
            (o: ApiResponse.Organization) => o.uuid
          );
          return;
        }
        this.readMotivationAnalytics = [];
      },
    },
    chunkedCompanies() {
      return chunk(this.organizations, 3);
    },
  },
  mounted() {
    this.admin = this.authorities.admin;
    this.readUsageCheck = this.authorities.readUsageCheck;
    this.readMotivationAnalytics = this.authorities.readMotivationAnalytics;
    this.readPersonalInformation = this.authorities.readPersonalInformation;
  },
  methods: {
    onSave() {
      if (
        this.readPersonalInformation.length > 0 &&
        this.readMotivationAnalytics.length === 0
      ) {
        alert('モチベーション閲覧権限を最低1社選択してください。');
        return;
      }
      this.$emit('save', {
        admin: this.admin,
        read_usage_check: this.readUsageCheck,
        read_motivation_analytics: this.readMotivationAnalytics,
        read_personal_information: this.readPersonalInformation.length > 0,
      });
    },
    onClose() {
      this.$emit('close');
    },
    selectAllOffice() {
      this.isAllSelected = !this.isAllSelected;

      if (this.isAllSelected) {
        this.selectedCategories = [
          'team-analysis',
          'mental-analysis',
          'management-screen',
        ];
        return;
      }
      this.selectedCategories = [];
    },
    selectDisabledSelected() {
      this.isDisabledSelected = !this.isDisabledSelected;
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-window {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: auto;
  background: $true_white;
  border-radius: 4px;
  padding: 20px 30px;
  border: none;
  box-shadow: 0 0 3px #b8c7d8;
  z-index: 10;
  overflow: scroll;

  &.fixed {
    position: fixed;
  }
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  img {
    object-fit: contain;
  }
}

.modal-header-title {
  font-size: 18px;
  font-weight: 600;
  margin-right: 25px;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  margin-top: 30px;

  h3 {
    margin-right: 20px;
  }
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.1s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.1s, transform 0.1s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.1s ease 0.1s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title {
  & /deep/ .checkbox-text {
    font-size: 13px;
  }
}

.authority-box {
  & + & {
    margin-top: 30px;
  }

  .authority-checkbox {
    & /deep/ .checkbox-text {
      font-size: 15px;
      font-weight: 600;
    }

    &.pink /deep/ .checkbox-text {
      color: $pink;
    }
  }

  .content {
    padding-left: 26px;

    .description {
      margin-top: 10px;
    }

    .selected-companies {
      text-align: right;

      .pink {
        color: $pink;
      }
    }

    .company-list {
      border: 1px solid $light_gray_blue_3;
      border-radius: 4px;
      padding: 13px 15px;
      max-height: 100px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #7e8195 white;
    }

    .company-list::-webkit-scrollbar {
      width: 4px;
      height: 0;
    }

    .company-list::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #7e8195;
    }

    .company-row {
      display: flex;
      justify-content: flex-start;
      padding: 8px 0;

      /deep/ .checkbox-text {
        font-size: 15px;
      }

      .company-checkbox {
        width: 226px;
      }
    }

    .company-row + .company-row {
      margin-top: 8px;
    }

    .personal-information-box {
      display: flex;
      align-items: center;
      margin-top: 14px;
      margin-bottom: 15px;
      padding: 10px;
      background-color: $white_1;
      border-radius: 4px;

      .triangle {
        margin-left: 5px;
        border-top: 7px solid transparent;
        border-right: 10px solid $gray_blue_5;
        border-bottom: 7px solid transparent;
      }

      .attention {
        background-color: $gray_blue_5;
        color: $true_white;
        font-size: 12px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 4px;
      }
    }
  }
}

.button-box {
  display: flex;
  justify-content: center;
  justify-items: center;
  margin-top: 40px;

  .modal-button {
    width: 200px;
  }

  .modal-button + .modal-button {
    margin-left: 20px;
  }
}
</style>
