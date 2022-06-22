<template>
  <div class="data-item">
    <div class="data-item__header">
      <icon-bg src="/app/icon/icon-blood.svg" />
      <span>血液型の割合は？</span>
    </div>
    <div v-if="show" class="data-item__contents blood">
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
        <vc-donut
          background="white"
          foreground="#d8d8d8"
          class="blood-graph"
          :size="114"
          unit="px"
          :thickness="50"
          :sections="sections"
          :start-angle="0"
          :total="100"
        ></vc-donut>
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
import IconBg from '../../../atoms/icons/IconBg.vue';
import 'vue-css-donut-chart/dist/vcdonut.css';
import BloodDroplet from '../../../atoms/icons/BloodDroplet.vue';

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
.data-item {
  position: relative;
  flex: 50%;
  max-width: 50%;
  margin: 24px 0;
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
  margin: 16px 0 0;
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
  margin: -23px 0 0;
  justify-content: center;

  .blood-drop:first-of-type {
    margin: 0 150px 0 0;
  }
}

.blood-graph {
  margin: 23px 13px 0 26px;
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
  top: 50%;
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
