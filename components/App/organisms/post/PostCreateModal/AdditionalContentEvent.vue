<template>
  <div class="event-container">
    <button class="close" @click="onClose">
      <img src="/app/icon/Icon-enquete-close.svg" />
    </button>
    <h2>
      <img src="/icon/Icon-add-event.svg" />
      イベント設定
    </h2>
    <section class="event-setting">
      <div class="dates-setting">
        <div class="date-info">
          <div class="text">
            開催日時
          </div>
          <div
            class="date-calendar"
            @click="onCalendarActiveInactiveButtonClick"
          >
            <div class="date-calendar-start">
              <div class="date">
                <p>
                  {{ event.start_at | dateFilter }}
                  <img class="icon" src="/icon/Icon-calendar.svg" />
                </p>
              </div>
              <div class="time">
                {{ event.start_at | timeFilter }}
              </div>
            </div>
            <div class="space">
              〜
            </div>
            <div class="date-calendar-end">
              <div class="date">
                <p>
                  {{ event.end_at | dateFilter }}
                  <img class="icon" src="/icon/Icon-calendar.svg" />
                </p>
              </div>
              <div class="time">
                {{ event.end_at | timeFilter }}
              </div>
            </div>
          </div>
          <div v-if="isShowSelectCalender" class="calender-range-modal">
            <date-picker
              v-model="startEndRange"
              type="datetime"
              range
              :open="isShowSelectCalender"
              :editable="false"
              :disabled-time="disabledTime"
              :disabled-date="notBeforeToday"
              :popup-style="{
                position: 'relative',
                top: '-35px',
                left: '0px',
                width: '500px',
                border: 'none',
                'box-shadow': 'none',
              }"
              :append-to-body="false"
              :show-second="false"
            ></date-picker>
            <BaseButton
              inverse
              size="large"
              class="close-button"
              @click="onCalendarActiveInactiveButtonClick"
            >
              完了
            </BaseButton>
          </div>
        </div>
        <div class="all-day">
          <div class="text">
            終日
          </div>
          <toggle-button
            v-model="isAllDay"
            class="button"
            @onChange="allDay"
          ></toggle-button>
        </div>
      </div>
      <div class="place-setting">
        <div class="text">
          開催場所
        </div>
        <input v-model="event.place" type="text" class="input" />
      </div>
      <div class="show-joining-setting">
        <div class="text">
          参加可否ボタンの表示
        </div>
        <toggle-button
          v-model="event.is_required_answer"
          class="button"
          @onChange="requiredAnswer"
        ></toggle-button>
      </div>
      <div v-if="event.is_required_answer" class="expire-setting">
        <div class="expire-date-calendar">
          <div class="text">
            参加回答期限
          </div>
          <div class="date-row expire-date-row">
            <div
              class="date"
              @click="onExpireCalendarActiveInactiveButtonClick"
            >
              <p>
                {{ event.expire_at | dateFilter }}
                <img class="icon" src="/icon/Icon-calendar.svg" />
              </p>
            </div>
            <div
              class="time"
              @click="onExpireCalendarActiveInactiveButtonClick"
            >
              {{ event.expire_at | timeFilter }}
            </div>
          </div>
        </div>
        <div class="all-day">
          <div class="text">
            終日
          </div>
          <toggle-button
            v-model="isExpireAllDay"
            class="button"
            @onChange="allExpireDay"
          ></toggle-button>
        </div>
      </div>
      <div v-if="isExpireShowSelectCalender" class="calender-modal">
        <date-picker
          v-model="expire_at"
          type="datetime"
          :open="isExpireShowSelectCalender"
          :editable="false"
          :disabled-time="disabledTime"
          :disabled-date="notBeforeToday"
          :popup-style="{
            position: 'relative',
            top: '-10px',
            left: '0px',
            width: '250px',
            border: 'none',
            'box-shadow': 'none',
          }"
          :append-to-body="false"
          :show-second="false"
        ></date-picker>
        <BaseButton
          inverse
          size="large"
          class="close-button"
          @click="onExpireCalendarInactiveButtonClick"
        >
          完了
        </BaseButton>
      </div>

      <div v-if="event.is_required_answer" class="show-invitation-setting">
        <div class="content">
          <div class="text">
            招待対象の設定
            <span class="count">{{ event.users.length }}名</span>
          </div>
          <div
            class="open-add-invite-modal"
            @click="isEmployeesOpen = !isEmployeesOpen"
          >
            招待対象を追加
            <img class="icon" src="/icon/Icon-arrow_right_pink.svg" />
          </div>
        </div>
        <div class="invited-organization">
          <ul>
            <li
              v-for="employee in classificationEmployees"
              :key="employee.organizationName"
            >
              {{ employee.organizationName }} {{ employee.memberCount }}名
              <img
                src="/icon/icon_delete.svg"
                class="delete-icon"
                alt=""
                @click="deleteInvitedOrganization(employee.organizationName)"
              />
            </li>
          </ul>
        </div>

        <SelectMembersModal
          v-if="isEmployeesOpen"
          type="publish"
          :selected-public-members="selectedEmployees"
          :all-organizations="organizations"
          @close="closeModalSelectMember"
          @select="onMembersSelect"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import DatePicker from 'vue2-datepicker';
import cloneDeep from 'lodash/cloneDeep';
import SelectMembersModal from '@/components/App/organisms/common/SelectMembersModal.vue';
import ToggleButton from '../../../atoms/buttons/ToggleButton.vue';
import BaseButton from '../../../atoms/buttons/BaseButton.vue';

type StorePostEvent = AppApiRequest.StorePostEvent;

type Organization = AppApiResponse.Organization;
type Employee = AppApiResponse.Employee;

type Heading = {
  kind: 'heading';
  body: string;
};

type classificationEmployee = {
  organizationName: string;
  memberCount: number;
};

export default Vue.extend({
  filters: {
    timeFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('HH:mm');
      }
      return null;
    },
    dateFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('YYYY/MM/DD');
      }
      return null;
    },
  },
  components: {
    ToggleButton,
    DatePicker,
    BaseButton,
    SelectMembersModal,
  },
  props: {
    eventContents: {
      type: Object as PropType<StorePostEvent | null>,
      required: false,
      default: null,
    },
    editPostUuid: {
      type: String,
      required: false,
      default: '',
    },
    employeesList: {
      type: Array as PropType<AppApiResponse.Employee[]>,
      required: true,
    },
    organizations: {
      type: Array as PropType<AppApiResponse.Organization[]>,
      default: null,
    },
  },
  data: () => ({
    event: {} as StorePostEvent,
    selectedOrganization: null as AppApiResponse.Organization | null,
    addOrganizations: [] as AppApiResponse.Organization[],
    isShowSelectCalender: false as boolean,
    startEndRange: [] as Array<Date>,
    isAllDay: false as boolean,
    isEmployeesOpen: false as boolean,
    employee: {} as Employee,
    employees: [] as Array<Employee>,
    selectedEmployees: [] as Array<Employee>,
    classificationEmployees: [] as Array<classificationEmployee>,
    isExpireShowSelectCalender: false as boolean,
    isExpireAllDay: false as boolean,
    expire_at: new Date(),
  }),
  watch: {
    startEndRange(): void {
      this.$set(this.event, 'start_at', dayjs(this.startEndRange[0]).unix());
      this.$set(this.event, 'end_at', dayjs(this.startEndRange[1]).unix());
    },
    eventContents(value: StorePostEvent | null): void {
      if (value === null) {
        const start = dayjs();
        const end = dayjs().add(7, 'day');
        this.startEndRange = [start.toDate(), end.toDate()];

        this.$set(this.event, 'place', null);
        this.$set(this.event, 'start_at', start.unix());
        this.$set(this.event, 'end_at', end.unix());
        this.$set(this.event, 'expire_at', start.unix());
        this.$set(this.event, 'is_required_answer', false);
        this.$set(this.event, 'users', []);
      }
    },
    event(): void {
      // this.event.expire_at = Number(this.event.start_at);
      this.$emit('onEventSelected', this.event);
    },
    expire_at(): void {
      this.$set(this.event, 'expire_at', dayjs(this.expire_at).unix());
    },
    employee(): void {
      const employeeslist = [...this.selectedEmployees];
      this.selectedEmployees = employeeslist.filter(
        (item: Employee, index: number) => {
          return employeeslist.indexOf(item) === index;
        }
      );
      const targetUser = this.classificationEmployees.find(
        (classificationEmploye: classificationEmployee) =>
          classificationEmploye.organizationName ===
          this.employee.organization_name
      );
      if (targetUser === undefined) {
        this.$set(
          this.classificationEmployees,
          this.classificationEmployees.length,
          { organizationName: this.employee.organization_name, memberCount: 1 }
        );
      } else {
        targetUser.memberCount = +targetUser.memberCount + 1;
      }
    },
    employeesList(newValue: AppApiResponse.Employee[]): void {
      if (this.classificationEmployees.length) {
        return;
      }
      this.classificationEmployees = this.event.users.reduce(
        (newList: classificationEmployee[], item: string) => {
          const userData = newValue.filter(
            (i: AppApiResponse.Employee) => i.user_uuid === item
          );
          const indexItem = newList
            .map((i: classificationEmployee) => i.organizationName)
            .indexOf(userData[0].organization_name);
          if (indexItem >= 0) {
            const memberCount = newList[indexItem].memberCount + 1;
            Vue.set(newList[indexItem], 'memberCount', memberCount);
          } else {
            newList.push({
              organizationName: userData[0].organization_name,
              memberCount: 1,
            });
          }
          return newList;
        },
        []
      );

      this.selectedEmployees = this.event.users.reduce(
        (newList: Employee[], item: string) => {
          const userData = newValue.filter(
            (u: AppApiResponse.Employee) => u.user_uuid === item
          );
          newList.push(userData[0]);
          return newList;
        },
        []
      );
    },
  },
  created() {
    if (this.eventContents != null) {
      this.event = cloneDeep(this.eventContents);
      if (this.editPostUuid != null) {
        this.startEndRange = [
          new Date(dayjs.unix(this.event.start_at).format('YYYY/MM/DD HH:mm')),
          new Date(dayjs.unix(this.event.end_at).format('YYYY/MM/DD HH:mm')),
        ];
        if (
          dayjs(this.startEndRange[0])
            .format('H:m')
            .toString() === '0:0' &&
          dayjs(this.startEndRange[1])
            .format('H:m')
            .toString() === '23:59'
        ) {
          this.isAllDay = true;
          this.allDay(true);
        }
        const eventExpireDate = new Date(
          dayjs.unix(this.event.expire_at).format('YYYY/MM/DD HH:mm')
        );
        if (
          dayjs(eventExpireDate)
            .format('H:m')
            .toString() === '23:59'
        ) {
          this.isExpireAllDay = true;
          this.allExpireDay(true);
        }
      }
    } else {
      const start = dayjs();
      const end = dayjs().add(7, 'day');
      this.startEndRange = [start.toDate(), end.toDate()];

      this.$set(this.event, 'place', null);
      this.$set(this.event, 'start_at', start.unix());
      this.$set(this.event, 'end_at', end.unix());
      this.$set(this.event, 'expire_at', start.unix());
      this.$set(this.event, 'is_required_answer', false);
      this.$set(this.event, 'users', []);
    }
  },
  methods: {
    onAddChoiseButtonClick() {},
    onClose(event: Event) {
      this.$emit('onEventSelected', this.event);
      this.$emit('onEventClose', event);
    },
    closeModalSelectMember() {
      this.isEmployeesOpen = false;
    },
    onCalendarActiveInactiveButtonClick() {
      this.isShowSelectCalender = !this.isShowSelectCalender;
    },
    onCalendarActiveButtonClick() {
      this.isShowSelectCalender = true;
    },
    onExpireCalendarActiveInactiveButtonClick() {
      this.isExpireShowSelectCalender = !this.isExpireShowSelectCalender;
    },
    onExpireCalendarInactiveButtonClick() {
      if (this.expire_at < new Date()) {
        alert('回答の期限は現在時刻よりも後に設定してください。');
      } else {
        this.isExpireShowSelectCalender = false;
      }
    },
    allDay(isActive: boolean) {
      if (isActive) {
        this.startEndRange = [
          new Date(this.startEndRange[0].setHours(0, 0)),
          new Date(
            this.startEndRange[0].getFullYear(),
            this.startEndRange[0].getMonth(),
            this.startEndRange[0].getDate(),
            23,
            59,
            59
          ),
        ];
        this.isAllDay = true;
      } else {
        this.isAllDay = false;
      }
    },
    allExpireDay(isActive: boolean) {
      if (isActive) {
        this.expire_at = new Date(this.expire_at.setHours(23, 59));
        this.isExpireAllDay = true;
      } else {
        this.isExpireAllDay = false;
      }
    },

    disabledTime() {
      return this.isAllDay;
    },
    notBeforeToday(date: Date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    requiredAnswer() {
      this.event.is_required_answer = !this.event.is_required_answer;
      if (!this.event.is_required_answer) {
        this.$set(this.event, 'users', []);
        this.expire_at = new Date();
        this.isExpireShowSelectCalender = false;
      }
    },
    onCloseSelectMembers(): void {
      this.isEmployeesOpen = !this.isEmployeesOpen;
    },
    onMembersSelect(members: Employee[]): void {
      const self = this;
      this.selectedEmployees = [];
      this.classificationEmployees = [];
      this.$set(this.event, 'users', []);
      members.forEach((emp: Employee) => {
        self.$set(self.event.users, self.event.users.length, emp.uuid);
        // selectedEmployees
        self.$set(self.selectedEmployees, self.selectedEmployees.length, emp);
        setTimeout(() => {
          self.employee = emp;
        });
        self.$emit('select', emp);
      });
      this.isEmployeesOpen = false;
    },
    deleteInvitedOrganization(orgName: string) {
      this.classificationEmployees = [...this.classificationEmployees].filter(
        (clsEmp: classificationEmployee) =>
          clsEmp.organizationName.trim() !== orgName.trim()
      );
      this.selectedEmployees = [...this.selectedEmployees].filter(
        (e: Employee) => e.organization_name.trim() !== orgName.trim()
      );
      const eventUsers = [...this.selectedEmployees].map(
        (e: Employee) => e.user_uuid
      );
      this.$set(this.event, 'users', eventUsers);
    },
  },
});
</script>

<style lang="scss" scoped>
.event-container {
  padding-top: 25px;
  position: relative;

  .close {
    position: absolute;
    right: 1px;
    border: none;
    background: white;
  }
}

h2 {
  font-size: 15px;
  font-weight: bold;
  padding-bottom: 25px;
}

.input {
  width: 100%;
  appearance: none;
  border: none;
  padding: 20px 0;
  color: $main_color;
}

.date {
  background: $light_gray_blue_3;
  color: $main_color;
  font-size: 13px;
  position: relative;
  margin-right: 7px;
  font-family: 'Lato', sans-serif;
  height: 30px;
  font-weight: 400;
  padding: 7px 35px 7px 12px;
  background-color: #e4e5ed;
  border-radius: 16px;
  width: 118px;

  p {
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    display: flex;
    align-items: center;
  }
}

.icon {
  margin: 0 0 0 8px;
}

.time {
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: $main_color;
}

.expire-setting {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 26px 0 21px 0;
  border-bottom: 1px solid $ruled_line;
  margin-bottom: 11px;

  .expire-date-calendar {
    display: flex;
    flex-direction: column;
  }

  .all-day {
    .text {
      color: $gray;
      text-align: center;
    }

    .toggle-button-container {
      padding-top: 17px;
    }
  }
}

.expire-date-row {
  padding-top: 17px;
}

.event-setting {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-direction: column;

  .dates-setting {
    display: flex;
    justify-content: space-between;
    padding: 26px 0 21px 0;
    border-bottom: 1px solid $ruled_line;
    margin-bottom: 11px;

    .date-info {
      display: flex;
      flex-direction: column;

      .date-calendar {
        display: flex;
        align-items: center;
        font-size: 24px;
        padding-top: 17px;

        .date-calendar-start {
          display: flex;
        }

        .date-calendar-end {
          display: flex;
        }

        .space {
          width: 54px;
          text-align: center;
        }
      }
    }

    .all-day {
      .text {
        color: $gray;
        text-align: center;
      }

      .toggle-button-container {
        padding-top: 17px;
      }
    }
  }

  .place-setting {
    .input {
      width: 100%;
      appearance: none;
      border: none;
      padding: 20px 0;
      color: $main_color;
    }

    input.input {
      border-bottom: 1px solid $ruled_line;
      margin-bottom: 11px;
    }
  }

  .show-joining-setting {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 20px 0;
    border-bottom: 1px solid $ruled_line;
    margin-bottom: 11px;
  }

  .show-invitation-setting {
    height: fit-content;
    border-bottom: 1px solid $ruled_line;
    margin-bottom: 24px;

    .content {
      display: flex;
      justify-content: space-between;

      .text {
        .count {
          font-weight: bold;
        }
      }

      .open-add-invite-modal {
        cursor: pointer;
      }
    }

    .invited-organization {
      padding: 16px 0 24px 0;

      ul {
        display: flex;
        color: $text_gray;
        flex-wrap: wrap;
        height: fit-content;

        li {
          padding: 10px;
          border: 1px solid $ruled_line;
          border-radius: 10px;
          margin-right: 8px;
          margin-bottom: 10px;
        }
      }
    }
  }
}

.calender-range-modal {
  background: white;
  width: 521px;
  height: 360px;
  position: relative;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;

  .close-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $link_color;
  }
}

.calender-modal {
  background: white;
  width: 270px;
  height: 360px;
  position: relative;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;

  .close-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $link_color;
  }
}

.calender-modal ::v-deep .mx-datepicker .mx-input-wrapper {
  visibility: hidden;
}

.date-row {
  display: flex;
  align-items: center;
}

.delete-icon {
  width: 16px;
  margin-bottom: 2px;
  cursor: pointer;
}
</style>
