<template>
  <!-- 弹窗内容（v-model 控制显示） -->
  <el-dialog v-model="modelValue" title="选择省份" width="60%">
    <v-chart
      class="chart"
      :option="chartOptions"
      autoresize
      @click="handleClick"
    />
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import chinaMap from '@/assets/ThePRC.json'

const modelValue = defineModel('modelValue')
const emit = defineEmits(['select'])

const chartOptions = ref({})

onMounted(() => {
  echarts.registerMap('china', chinaMap)
  chartOptions.value = {
    tooltip: { trigger: 'item', formatter: '{b}' },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: true,
        label: { show: true },
        emphasis: { label: { show: true, color: '#f00' } },
      },
    ],
  }
})

function handleClick(params) {
  emit('select', params.name)
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>
