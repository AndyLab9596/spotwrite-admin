<template>
  <div v-if="show" class="data-item data-item">
    <div class="data-item__header">
      <icon-bg src="/icon/icon-blood.svg" />
      <span>血液型の割合は？</span>
    </div>
    <div class="data-item__contents blood">
      <div class="blood-row">
        <div class="blood-drop">
          <div class="droplet droplet--ab">
            <blood-droplet :color="getBloodColor('AB型')" />
          </div>
          <div
            v-if="Object.keys(bloodTypes).length > 0"
            class="blood-drop__count"
          >
            {{ bloodTypes.type_ab.count }}
          </div>
        </div>
        <!-- TODO ソートして、円グラフのセクションの色を順番に合わせる -->
        <vc-donut
          background="white"
          foreground="#d8d8d8"
          class="blood-graph"
          :size="100"
          unit="px"
          :thickness="50"
          :sections="sections"
          :start-angle="0"
          :total="100"
        ></vc-donut>
        <!-- TODO ソートして、dropletの色順番に合わせる -->
        <div class="blood-drop">
          <div class="droplet droplet--a">
            <blood-droplet :color="getBloodColor('A型')" />
          </div>
          <div
            v-if="Object.keys(bloodTypes).length > 0"
            class="blood-drop__count"
          >
            {{ bloodTypes.type_a.count }}
          </div>
        </div>
      </div>
      <div class="blood-row blood-row--bottom">
        <div class="blood-drop">
          <div class="droplet droplet--b">
            <blood-droplet :color="getBloodColor('B型')" />
          </div>
          <div
            v-if="Object.keys(bloodTypes).length > 0"
            class="blood-drop__count"
          >
            {{ bloodTypes.type_b.count }}
          </div>
        </div>
        <div class="blood-drop">
          <div class="droplet droplet--o">
            <blood-droplet :color="getBloodColor('O型')" />
          </div>
          <div
            v-if="Object.keys(bloodTypes).length > 0"
            class="blood-drop__count"
          >
            {{ bloodTypes.type_o.count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Donut from 'vue-css-donut-chart';
import IconBg from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/IconBg.vue';
import BloodDroplet from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/CompanyData/BloodDroplet.vue';

import 'vue-css-donut-chart/dist/vcdonut.css';

Vue.use(Donut);

export default Vue.extend({
  components: {
    BloodDroplet,
    IconBg,
  },
  props: {
    bloodTypes: {
      default: null,
      type: Object,
    },
    sections: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  methods: {
    getBloodColor(bloodType: String): any {
      const ranking = this.sections.map((e: any) => e.label).indexOf(bloodType);
      if (ranking === 0) {
        return '#F09C9C';
      }
      if (ranking === 1) {
        return '#9498AF';
      }
      if (ranking === 2) {
        return '#7E8195';
      }
      if (ranking === 3) {
        return '#D3D5E0';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.data-title {
  display: flex;
  height: 50px;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  padding: 0 10px;
  background: #f7f8fd;
}

.data-item {
  position: relative;
  flex: 100%;
  padding: 24px 1px;

  & + .data-item {
    border-top: 1px dotted #7e819587;
  }
}

.data-item__header {
  display: flex;
  align-items: center;

  span {
    margin: 0 0 0 16px;
    font-size: 15px;
    font-weight: 600;
    color: $main_color;
  }
}

.data-item__contents {
  width: 100%;
  width: fit-content;
  margin: 16px auto 0;
}

.blood {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.blood-row {
  display: flex;
  align-items: flex-start;
}

.blood-row--bottom {
  width: 100%;
  margin: -40px 0 0;
  justify-content: center;

  .blood-drop:first-of-type {
    margin: 0 auto 0 0;
  }
}

.blood-graph {
  margin: 40px 13px 0 26px;
}

.droplet {
  position: relative;
}

.droplet::after {
  content: '型';
  position: absolute;
  bottom: 0;
  font-size: 11px;
  color: $main_color;
  line-height: 19px;
}

.droplet--a::before {
  content: 'A';
}

.droplet--b::before {
  content: 'B';
}

.droplet--ab::before {
  content: 'AB';
}

.droplet--o::before {
  content: 'O';
}

.droplet--a::before,
.droplet--b::before,
.droplet--ab::before,
.droplet--o::before {
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  line-height: 29px;
  color: $true_white;
}

.blood-drop__count {
  position: relative;
  font-size: 24px;
  line-height: 29px;
  color: $main_color;
  width: 100%;
  text-align: center;

  &::after {
    content: '人';
    position: absolute;
    left: 100%;
    bottom: 0;
    font-size: 11px;
    color: $main_color;
    line-height: 19px;
  }
}
</style>
