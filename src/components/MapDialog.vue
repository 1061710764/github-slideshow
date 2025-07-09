<template>
  <div v-if="visible" class="dialog-mask">
    <div class="dialog-box">
      <div ref="chartRef" class="chart"></div>
      <button @click="emit('close')" class="close-btn">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts';
import {
  TooltipComponent,
  GeoComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ECharts } from 'echarts/core';

echarts.use([
  MapChart,
  TooltipComponent,
  GeoComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'selectProvince', province: string): void;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: ECharts | null = null;

// 加载 assets 中的 json（使用动态 import）
async function loadGeoJsonMap(
  geoJsonName: string,
  selCity: string,
  onClickProvince: (province: string) => void
): Promise<void> {
  try {
    const mapJson = await import(`../assets/echartsgeoJson/${geoJsonName}.json`);

    echarts.registerMap('chosenMap', mapJson.default); // 注意 .default

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}',
      },
      series: [
        {
          name: selCity,
          type: 'map',
          map: 'chosenMap',
          label: { show: true },
          emphasis: {
            label: {
              color: '#f00',
              fontWeight: 'bold',
            },
            itemStyle: {
              areaColor: '#fce38a',
            },
          },
        },
      ],
    };

    chartInstance?.setOption(option);

    chartInstance?.off('click');
    chartInstance?.on('click', (params: any) => {
      if (params.name) {
        onClickProvince(params.name);
      }
    });
  } catch (error) {
    console.error('地图加载失败:', error);
  }
}

watch(
  () => props.visible,
  async (val) => {
    if (val && chartRef.value) {
      if (!chartInstance) {
        chartInstance = echarts.init(chartRef.value);
      }
      await loadGeoJsonMap('china', '中国地图', (province) => {
        emit('selectProvince', province);
      });
    }
  }
);
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 999;
}
.dialog-box {
  background: white;
  width: 80%;
  height: 80%;
  margin: 5% auto;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.chart {
  width: 100%;
  height: 100%;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
