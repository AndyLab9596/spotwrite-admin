<template>
  <div class="all-organization-table-container">
    <div class="table-row">
      <div class="table-item table-title table-center">
        <input type="checkbox" />
      </div>
      <div class="table-item table-title">部署・店舗</div>
      <div class="table-item table-title">人数</div>
      <div class="table-item table-title">グループ</div>
    </div>
    <template v-for="organization in organizations">
      <div :key="organization.uuid" class="table-row">
        <div class="table-item table-center">
          <input
            v-model="checked"
            :value="organization.uuid"
            type="checkbox"
            @change="onChange"
          />
        </div>
        <div class="table-item">
          {{ organization.name }}
        </div>
        <div class="table-item table-center">{{ organization.number }}名</div>
        <div class="table-item">
          <div class="table-group-contents">
            <span
              v-for="group in organization.groups"
              :key="group.uuid"
              class="table-group-contents-item"
              >{{ group.name }}</span
            >
          </div>
          <div class="table-group-buttons">
            <button @click="addGroup(organization)">追加</button
            ><button @click="deleteGroup(organization)">削除</button>
          </div>
        </div>
      </div>
      <template v-for="parent in organization.parents">
        <div :key="parent.uuid" class="table-row">
          <div class="table-item table-center">
            <input
              v-model="checked"
              :value="parent.uuid"
              type="checkbox"
              @change="onChange"
            />
          </div>
          <div class="table-item">
            {{ parent.name }}
          </div>
          <div class="table-item table-center">{{ parent.number }}名</div>
          <div class="table-item">
            <div class="table-group-contents">
              <span
                v-for="group in parent.groups"
                :key="group.uuid"
                class="table-group-contents-item"
                >{{ group.name }}</span
              >
            </div>
            <div class="table-group-buttons">
              <button @click="addGroup(parent)">追加</button
              ><button @click="deleteGroup(parent)">削除</button>
            </div>
          </div>
        </div>
        <div
          v-for="child in parent.children"
          :key="child.uuid"
          class="table-row"
        >
          <div class="table-item table-center">
            <input
              v-model="checked"
              :value="child.uuid"
              type="checkbox"
              @change="onChange"
            />
          </div>
          <div class="table-item">
            {{ child.name }}
          </div>
          <div class="table-item table-center">{{ child.number }}名</div>
          <div class="table-item">
            <div class="table-group-contents">
              <span
                v-for="group in child.groups"
                :key="group.uuid"
                class="table-group-contents-item"
                >{{ group.name }}</span
              >
            </div>
            <div class="table-group-buttons">
              <button @click="addGroup(child)">追加</button
              ><button @click="deleteGroup(child)">削除</button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    organizations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      checked: [],
    };
  },
  methods: {
    addGroup(selectOrganization: {}) {
      this.$emit('add', selectOrganization);
    },
    deleteGroup(selectOrganization: {}) {
      this.$emit('delete', selectOrganization);
    },
    onChange() {
      this.$emit('change', this.checked);
    },
  },
});
</script>

<style lang="scss" scoped>
.all-organization-table-container {
  border-top: solid 1px #707070;
  border-left: solid 1px #707070;
}

.table-row {
  display: grid;
  grid-template-columns: 30px 310px 84px 1fr;
  grid-template-rows: auto auto;
}

.table-item {
  border-right: solid 1px #707070;
  border-bottom: solid 1px #707070;
  display: flex;
  align-items: center;
  min-height: 60px;
  padding-left: 10px;
}

.table-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: initial;
}

.table-title {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
}

.table-group-contents {
  flex: 1;
}

.table-group-contents-item {
  display: inline-block;
  background-color: #ccc;
  padding: 2px 4px;
  margin: 2px;
}

.table-group-buttons {
  display: flex;
  flex-direction: row;
}
</style>
