<template>
  <div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
    <form
      v-if="Object.keys(input).length > 0"
      class="form l-contents"
      @submit.prevent
    >
      <div class="profile-container">
        <p class="profile-title">フリー入力設問</p>
        <p class="profile-sub-title">
          「プロフィール・会社履歴」にあるフリー入力設問を登録することができます。<br />
          一度登録したタイトル名を変更することはできません。
        </p>
        <div class="profile-input-container">
          <template v-for="item in input.free_input_question">
            <select
              :key="item.uuid"
              v-model="item.question_uuid"
              class="select"
            >
              <option
                v-for="option in master.profile_free_questions"
                :key="option.uuid"
                :value="option.uuid"
                >{{ option.content }}
              </option>
            </select>
          </template>
        </div>
      </div>
      <div class="profile-container">
        <p class="profile-title">会社アンケート</p>
        <p class="profile-sub-title">
          「Q &amp;
          A」にある会社からのアンケートの表示・非表示を選ぶことができます。
        </p>
        <table>
          <tr class="heading">
            <th class="left-item">アンケートタイトル</th>
            <th class="center-item">選択肢</th>
            <th class="right-item"></th>
          </tr>
          <tr>
            <td class="left-item">血液型</td>
            <td class="center-item">A/B/AB/O/回答しない</td>
            <td class="right-item">
              <toggle-button
                v-model="blood_type"
                class="toggle-button"
                name="blood_type"
                :contents="[
                  { label: '表示', value: 'on' },
                  { label: '非表示', value: 'off' },
                ]"
                @input="(val) => (blood_type = val)"
              ></toggle-button>
            </td>
          </tr>
          <tr>
            <td class="left-item">文系・理系</td>
            <td class="center-item">文系/理系</td>
            <td class="right-item">
              <toggle-button
                v-model="humanities_or_science"
                class="toggle-button"
                name="humanities_or_science"
                :contents="[
                  { label: '表示', value: 'on' },
                  { label: '非表示', value: 'off' },
                ]"
                @input="(val) => (humanities_or_science = val)"
              ></toggle-button>
            </td>
          </tr>
          <tr>
            <td class="left-item">新卒・中途</td>
            <td class="center-item">新卒/中途/その他</td>
            <td class="right-item">
              <toggle-button
                v-model="new_graduate_or_mid_career"
                class="toggle-button"
                name="new_graduate_or_mid_career"
                :contents="[
                  { label: '表示', value: 'on' },
                  { label: '非表示', value: 'off' },
                ]"
                @input="(val) => (new_graduate_or_mid_career = val)"
              ></toggle-button>
            </td>
          </tr>
          <tr>
            <td class="left-item">住んだことのある都道府県</td>
            <td class="center-item">47都道府県</td>
            <td class="right-item">
              <toggle-button
                v-model="prefectures_where_lived"
                class="toggle-button"
                name="prefectures_where_lived"
                :contents="[
                  { label: '表示', value: 'on' },
                  { label: '非表示', value: 'off' },
                ]"
                @input="(val) => (prefectures_where_lived = val)"
              ></toggle-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="profile-container">
        <p class="profile-title">Q &amp; A</p>
        <p class="profile-sub-title">
          「Q &amp; A」にある質問事項を編集出来ます。 <br />
          たくさんの質問事項を設定することで、スタッフの人物像がより豊かに浮かび上がります。
        </p>
        <template v-for="(item, index) in input.questions">
          <input :key="item.uuid" v-model="item.question" class="input" />
          <img
            :key="index"
            src="/icon/icon_delete.svg"
            class="delete-icon"
            alt=""
            @click="deleteItem(index)"
          />
        </template>
        <base-button
          class="add-button"
          size="small"
          type="button"
          @click="addQuestions"
        >
          <img src="/icon/icon_add_pink.svg" class="icon-add" />
          質問を追加する
        </base-button>
      </div>
      <base-button
        class="submit-button"
        size="large"
        type="button"
        @click="onSubmit"
      >
        保存する
      </base-button>
    </form>
    <success-message
      v-if="successMessageModal"
      @close="toggleSuccessMessageModal"
    >
      入力された情報が保存されました。
    </success-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SuccessMessage } from '@/components/Admin/Modules/Modal';
import {
  fetchMasterProfileFreeQuestions,
  fetchMasterProfile,
  updateMasterProfile,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import { ToggleButton } from '@/components/Admin/Modules/Button';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

type CompanyConfigs = {
  blood_type: String | boolean;
  humanities_or_science: String | boolean;
  new_graduate_or_mid_career: String | boolean;
  prefectures_where_lived: String | boolean;
};

export default Vue.extend({
  components: {
    SuccessMessage,
    VueLoading,
    ToggleButton,
    BaseButton,
  },
  data() {
    return {
      successMessageModal: false as boolean,
      input: {} as ApiResponse.MasterProfile,
      isLoading: false as boolean,
      master: {
        profile_free_questions: [] as ApiResponse.MasterProfileFreeQuestion[],
      },
      companyConfigs: {} as CompanyConfigs,
      deleteUuids: [] as any,
    };
  },
  computed: {
    blood_type: {
      get(): string {
        return this.companyConfigs.blood_type ? 'on' : 'off';
      },
      set(value: string) {
        this.companyConfigs.blood_type = value;
      },
    },
    humanities_or_science: {
      get(): string {
        return this.companyConfigs.humanities_or_science ? 'on' : 'off';
      },
      set(value: string) {
        this.companyConfigs.humanities_or_science = value;
      },
    },
    new_graduate_or_mid_career: {
      get(): string {
        return this.companyConfigs.new_graduate_or_mid_career ? 'on' : 'off';
      },
      set(value: string) {
        this.companyConfigs.new_graduate_or_mid_career = value;
      },
    },
    prefectures_where_lived: {
      get(): string {
        return this.companyConfigs.prefectures_where_lived ? 'on' : 'off';
      },
      set(value: string) {
        this.companyConfigs.prefectures_where_lived = value;
      },
    },
  },
  async mounted() {
    this.isLoading = true;
    try {
      await this.fetchProfile();
      await this.fetchMaster();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        // toggleボタンにStringを渡してるためboolean値に変更し代入
        if (this.companyConfigs.blood_type === 'on')
          this.input.company_configs.blood_type = true;
        if (this.companyConfigs.blood_type === 'off')
          this.input.company_configs.blood_type = false;

        if (this.companyConfigs.humanities_or_science === 'on')
          this.input.company_configs.humanities_or_science = true;
        if (this.companyConfigs.humanities_or_science === 'off')
          this.input.company_configs.humanities_or_science = false;

        if (this.companyConfigs.new_graduate_or_mid_career === 'on')
          this.input.company_configs.new_graduate_or_mid_career = true;
        if (this.companyConfigs.new_graduate_or_mid_career === 'off')
          this.input.company_configs.new_graduate_or_mid_career = false;

        if (this.companyConfigs.prefectures_where_lived === 'on')
          this.input.company_configs.prefectures_where_lived = true;
        if (this.companyConfigs.prefectures_where_lived === 'off')
          this.input.company_configs.prefectures_where_lived = false;

        this.input.questionsDeleteUuids = this.deleteUuids;
        await updateMasterProfile(this.input);
        await this.fetchProfile();
        this.toggleSuccessMessageModal();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    addQuestions() {
      const lastOrder = this.input.questions.length
        ? this.input.questions.slice(-1)[0].order + 1
        : 1;
      this.input.questions.push({
        uuid: Math.random()
          .toString(36)
          .slice(-10),
        order: lastOrder,
        question: '',
      });
    },
    deleteItem(index: number) {
      if (!this.deleteUuids.includes(this.input.questions[index].uuid)) {
        this.deleteUuids.push(this.input.questions[index].uuid);
      }
      this.input.questions.splice(index, 1);
    },
    async fetchProfile(): Promise<void> {
      const { data } = await fetchMasterProfile();
      this.input = data;
      this.companyConfigs = this.input.company_configs;
    },
    async fetchMaster(): Promise<void> {
      const { data } = await fetchMasterProfileFreeQuestions();
      this.master.profile_free_questions = data.free_question;
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 19px;
  color: $dark_blue;
}

.profile-sub-title {
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 1.7em;
  margin-bottom: 7px;
  color: $dark_blue;
}

.submit-button {
  width: 200px;
  margin: 0 auto;
}

.profile-container {
  margin: 0 0 33px 0;

  &:last-of-type {
    margin: 0 0 47px 0;
  }
}

.profile-input {
  display: flex;
  align-items: center;
  padding: 0 0 0 13px;
  margin: 20px 0 0 0;
  height: 40px;
  width: 100%;
  border: 1px solid #707070;
  border-radius: 4px;

  &:first-of-type {
    margin: 0;
  }
}

.profile-input-container {
  display: flex;
  flex-direction: column;
  width: 500px;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 134px;
  height: 30px;
  margin: 0 0 40px 0;
  padding: 0 0 0 7px;
}

.icon-add {
  margin: 0 6px 0 0;
  width: 16px;
}

.l-contents {
  padding: 33px 30px 30px;
}

.select {
  height: 40px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  padding: 0 0 0 8px;
  margin: 0 0 20px 0;
  width: 650px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('/icon/icon_pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 8px center;

  &:last-of-type {
    margin: 0 0 43px 0;
  }

  &::-ms-expand {
    display: none;
  }
}

table {
  border-bottom: 1px solid #e4e5ed;
  border-right: 1px solid #e4e5ed;
  border-left: 1px solid #e4e5ed;
}

tr {
  display: flex;
  align-items: center;
  height: 40px;
}

th {
  align-items: center;
  justify-content: center;
  height: 40px;
  background-color: $white_1;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 600;
}

.left-item {
  display: flex;
  align-items: center;
  width: 300px;
  height: 40px;
  color: $gray_blue_4;
  background-color: $white_1;
  padding: 0 0 0 11px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.7em;
  border-top: 1px solid #e4e5ed;
  border-right: 1px solid #e4e5ed;
}

.center-item {
  display: flex;
  align-items: center;
  width: 200px;
  height: 40px;
  border-top: 1px solid #e4e5ed;
  border-right: 1px solid #e4e5ed;
  padding: 0 0 0 18px;
  font-size: 15px;
  color: $dark_blue;
}

.heading > .center-item {
  color: $gray_blue_4;
}

.right-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 154px;
  height: 40px;
  border-top: 1px solid #e4e5ed;
  cursor: pointer;
}

.toggle-button {
  width: 134px;
}

.input {
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  padding: 0 0 0 14px;
  border: 1px solid $light_gray_blue_3;
  width: 650px;
  height: 40px;
  border-radius: 4px;
  margin: 0 0 10px 0;

  &:last-of-type {
    margin: 0 0 15px 0;
  }
}

.delete-icon {
  width: 16px;
  margin: 0 0 22px 8px;
  cursor: pointer;
}
</style>
