<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <h2 class="title">沿革を追加</h2>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClick" />
        </div>
        <div class="modal-content">
          <div class="input-day">
            <select v-model="historyYear" class="select">
              <option
                v-for="displayYear in displayYears"
                :key="`year_option_${displayYear}`"
                :value="displayYear"
              >
                {{ displayYear }}
              </option>
            </select>
            <span class="input-day__label">年</span>
            <select v-model="historyMonth" class="select">
              <option
                v-for="displayMonth in displayMonths"
                :key="`month_option_${displayMonth}`"
                :value="displayMonth"
              >
                {{ displayMonth }}
              </option>
            </select>
            <span class="input-day__label">月</span>
          </div>
          <input
            v-model="historyTitle"
            class="edit-title"
            placeholder="タイトルをご記入ください。"
          />
          <textarea
            v-model="historyContent"
            class="edit-content"
            placeholder="社歴をご記入ください。"
          ></textarea>
          <base-button class="edit-button" size="large" @click="onClick"
            >変更する</base-button
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    history: {
      type: Object,
      default: {} as Types.History,
    },
  },
  data() {
    return {
      displayYears: [] as number[],
      displayMonths: [] as number[],
      historyYear: Number(dayjs.unix(this.history.date).format('YYYY')),
      historyMonth: Number(dayjs.unix(this.history.date).format('M')),
      historyTitle: this.history.title,
      historyContent: this.history.content,
    };
  },
  mounted() {
    const nowYear = Number(dayjs().format('YYYY'));
    this.displayYears = [...Array(100).keys()].map((m: number) => nowYear - m);
    this.displayMonths = [...Array(12).keys()].map((i: number) => i + 1);
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onClick() {
      const timestamp = dayjs(
        new Date(this.historyYear, this.historyMonth)
      ).unix();
      const timestampDisplay = dayjs(
        new Date(this.historyYear, this.historyMonth - 1)
      ).unix();
      const value = {
        uuid: this.history.uuid,
        title: this.historyTitle,
        content: this.historyContent,
        date: timestamp,
        dateDisplay: timestampDisplay,
      };
      this.$emit('click', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 15px;
}

.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.modal-window {
  background: $true_white;
  border-radius: 6px;
  padding: 20px 30px;
  width: 500px;
  position: relative;
  box-shadow: 0 0 3px $light_gray;

  .icon-cross {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.edit-day {
  display: flex;
}

.select /deep/ .vs__dropdown-toggle {
  width: 150px;
}

.edit-title {
  color: $gray_blue_4;
  height: 40px;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  margin-top: 20px;
  padding-left: 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.edit-content {
  height: 120px;
  margin-top: 20px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  width: 100%;
  resize: none;
  padding: 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.edit-button {
  width: 200px;
  margin: 20px auto 0;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
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

.select {
  height: 40px;
  width: 150px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding-left: 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url(/icon/icon_pulldown.svg);
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 4px center;
}

.input-day {
  display: flex;
  align-items: center;
  margin-top: 16px;

  &__label {
    margin-left: 5px;
    margin-right: 15px;
  }
}
</style>
