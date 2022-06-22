<template>
  <div id="container">
    <GChart
      type="ComboChart"
      :data="chartData"
      :options="options"
      @ready="onChartReady"
    />
    <svg
      style="width: 0; height: 0; position: absolute;"
      aria-hidden="true"
      focusable="false"
    >
      <linearGradient id="chart-gradient" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e90ff" stop-opacity="0.3" />
        <stop offset="50%" stop-color="#1e90ff" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#1e90ff" stop-opacity="0" />
      </linearGradient>
    </svg>
  </div>
</template>

<script lang="ts">
import { GChart } from 'vue-google-charts';

export default {
  components: {
    GChart,
  },
  props: {
    chartData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      options: {
        series: {
          0: {
            type: 'area',
            color: '#7e8195',
            pointSize: 2,
            pointShape: 'circle',
          },
        },
        areaOpacity: 1,
        lineWidth: 1,
        vAxis: {
          title: 'decimal',
          baselineColor: '#e4e5ed',
          minValue: 0,
          maxValue: 5,
          textStyle: {
            color: '#2e303e',
            fontName: 'Lato',
            fontSize: 11,
          },
          gridlines: {
            color: '#e4e5ed',
            count: 5,
          },
          minorGridlines: {
            count: 0,
          },
        },
        hAxis: {
          format: 'MM/dd',
          textStyle: {
            color: '#2e303e',
            fontName: 'Lato',
            fontSize: 11,
          },
          gridlines: {
            color: '#e4e5ed',
          },
          minorGridlines: {
            count: 0,
          },
        },
        axisTitlesPosition: 'none',
        fullWidth: true,
        chartArea: {
          left: '20',
          width: '100%',
          height: '300px',
          backgroundColor: {
            stroke: '#e4e5ed',
            strokeWidth: 1,
          },
        },
      },
    };
  },
  methods: {
    onChartReady(chart: any, google: any) {
      const container = document.getElementById('container');
      if (container) {
        const observer = new MutationObserver(() => {
          Array.prototype.forEach.call(
            container.getElementsByTagName('path'),
            (path: any) => {
              // 日別平均点（series[0]のデータ）グラフ表示部のpath要素のfill属性を用意したグラデーションに書き換える
              // [参考記事]
              // https://stackoverflow.com/questions/53105096/how-fill-area-in-googlecharts-areachart-with-gradient-color
              if (path.getAttribute('fill') === '#7e8195') {
                path.setAttribute('fill', 'url(#chart-gradient)');
              }
            }
          );
        });
        observer.observe(container, {
          childList: true,
          subtree: true,
        });
        /* eslint new-cap: ["error", { "newIsCap": false }] */
        const dataTable = new google.visualization.arrayToDataTable(
          // @ts-ignore
          this.chartData
        );
        // @ts-ignore
        chart.draw(dataTable, this.options);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
g > text {
  display: none;
}
</style>
