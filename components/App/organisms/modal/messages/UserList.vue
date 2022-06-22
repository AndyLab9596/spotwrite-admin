<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          メンバーを追加する
        </div>
        <v-select
          v-model="selected"
          multiple
          :options="addEmployees"
          label="name"
          :reduce="(addEmployees) => addEmployees.user_uuid"
        >
          <template slot="option" slot-scope="addEmployee">
            <div class="select-list">
              <img :src="addEmployee.user_icon" class="select-list-image" />
              <div>{{ addEmployee.name }}</div>
            </div>
          </template>
        </v-select>
        <div class="modal-footer">
          <div class="cancel" @click="onClose">キャンセル</div>
          <div class="submit" @click="onClick">追加する</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default Vue.extend({
  components: {
    vSelect,
  },
  props: {
    employees: {
      type: Array as PropType<ApiResponse.Employee[]>,
      required: true,
    },
    roomUsers: {
      type: Array as PropType<ApiResponse.RoomUser[]>,
      required: true,
    },
  },
  data() {
    return {
      selected: [] as Array<string>,
      addEmployees: [] as Array<ApiResponse.Employee>,
    };
  },
  mounted(): void {
    this.addEmployees = this.employees.filter(
      (f: ApiResponse.Employee) =>
        !this.roomUsers.some(
          (s: ApiResponse.RoomUser) => s.uuid === f.user_uuid
        )
    );
  },
  methods: {
    onClick() {
      this.$emit('addUser', this.selected);
    },
    onClose() {
      this.$emit('toggleModal');
    },
  },
});
</script>

<style lang="scss" scoped>
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
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 600px;
  background: #fff;
  padding: 20px;
  position: relative;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ccc;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 0 20px 10px;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  right: 35%;
}

.submit {
  color: #f03d25;
  cursor: pointer;
}

.cancel {
  margin-right: 20px;
  color: #0084ff;
  cursor: pointer;
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

.organization-list {
  overflow-y: scroll;
}

.employee-list-container {
  background-color: white;
  display: flex;
  flex-direction: column;
  max-height: 200px;
  padding: 10px;
  overflow-y: scroll;
  border-radius: 10px;
  z-index: 9;
  cursor: pointer;
}

.employee-list {
  display: flex;
  height: 30px;
  font-size: 13px;
  margin-bottom: 5px;
}

.employee-list > img {
  width: 30px;
  margin-right: 5px;
  object-fit: cover;
  border-radius: 50%;
}

.chat-title > input {
  border: none;
}

.new-group-employees {
  display: flex;
  flex-wrap: wrap;
}

.new-group-employee {
  border: 1px solid #4099ff;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 3px;
  border-radius: 5px;
  color: #0084ff;
  background-color: #cbe6fe;
  white-space: nowrap;
}

.tab-active {
  color: white;
  background-color: #0084ff;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.title-name {
  width: 50px;
  margin-left: 5px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-list {
  display: flex;
  align-items: center;
}

.select-list-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
</style>
