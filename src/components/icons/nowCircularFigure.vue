<template>
  <div class="circular-figure">
    <div class="diagram-container">
      <svg :width="svgSize" :height="svgSize" viewBox="0 0 600 600">
        <!-- 新增辐射线 -->
        <g v-for="(_, index) in 6" :key="'line-'+index">
          <line 
            :x1="center.x"
            :y1="center.y"
            :x2="center.x + 250 * Math.cos((index * 60 - 90-30) * Math.PI / 180)"
            :y2="center.y + 250 * Math.sin((index * 60 - 90-30) * Math.PI / 180)"
            stroke="#666" 
            stroke-width="1"
          />
          <text
            :x="center.x + 260 * Math.cos((index * 60 - 90 + 30) * Math.PI / 180)"
            :y="center.y + 260 * Math.sin((index * 60 - 90 + 30) * Math.PI / 180)"
            fill="#2c3e50"
            font-size="14"
            text-anchor="middle"
          >
            {{ outerSeasonTexts[index] }}
          </text>
        </g>
      
        <!-- 原有外层圆环代码保持不变 -->
        <g v-for="(text, index) in outerTexts" :key="'outer-'+index">
          <path 
            :d="getSectorPath(outerRadius, innerRadius1, index * 60 - 30, (index + 1) * 60 - 30)"
            :fill="outerColors[index]" 


          />
          <path 
            :id="'textPath'+index"
            :d="getArcPath(outerRadius - 40, index * 60 - 30, (index + 1) * 60 - 30)"
            fill="none"
          />
          <text font-size="20" :fill="outerTextColors[index]">
            <textPath 
              :href="'#textPath'+index"
              startOffset="50%"
              text-anchor="middle"
              dominant-baseline="central"
            >
              {{ text }}
            </textPath>
          </text>
        </g>
        
        <!-- 中间层圆环保持不变 -->
        <g v-for="(text, index) in middleTexts" :key="'middle-'+index">
  <path 
    :d="getSectorPath(innerRadius1, innerRadius2, index * 60 + 30, (index + 1) * 60 + 30)"
    :fill="middleColors[index]"
  />
  <!-- 新增弧形路径 -->
  <path 
    :id="'middleTextPath'+index"
    :d="getArcPath((innerRadius1 + innerRadius2)/2, index * 60 + 30, (index + 1) * 60 + 30)"
    fill="none"
  />
  <text font-size="14" :fill="middleTextColors[index]">
    <textPath 
      :href="'#middleTextPath'+index"
      startOffset="50%"
      text-anchor="middle"
      dominant-baseline="central"
    >
      <!-- 修改此处实现多行文本 -->
      <tspan x="0" dy="-0.8em">{{ text.split('\n')[0] }}</tspan>
      <tspan x="0" dy="1.2em">{{ text.split('\n')[1] }}</tspan>
    </textPath>
  </text>
</g>

        <!-- 最内层圆保持不变 -->
        <circle 
          :cx="center.x" 
          :cy="center.y" 
          :r="innerRadius2" 
          fill="#FFFFFF" 
        />
        <!-- 新增背景文字 -->
        <text 
          :x="center.x" 
          :y="center.y + 3 " 
          text-anchor="middle" 
          fill="#666" 
          fill-opacity="0.5"
          font-size="30"
          font
          dominant-baseline="middle"
        >
          主气
        </text>
        <text 
          :x="center.x" 
          :y="center.y" 
          text-anchor="middle" 
          fill="#000" 
          font-size="36"
          dominant-baseline="middle"
          font-weight="bold"
        >
          <!-- 修正模板语法 -->
          <tspan 
            v-for="(char, index) in tianGanDiZhi.split('')" 
            :key="index"
            :x="center.x"
            :dy="index === 0 ? '-0.6em' : '1.4em'"
            style="font-size:28px;alignment-baseline:middle"
          >
            {{ char }}
          </tspan>
        </text>
      </svg>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    patientId: {
      type: Number,
      required: true
    },
    isStartLichun: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tianGanDiZhi: "",
      birthsiTianQi: "",
      birthzaiQuanQi: "",
      birthsiTianZaiQuan: "",
      nowsiTianQi: "",
      nowZaiQuanQi: "",
      nowsiTianZaiQuan: "",
      svgSize: 600,
      center: { x: 300, y: 300 },
      outerRadius: 200,
      innerRadius1: 120,
      innerRadius2: 60,
      outerTexts: [],
      middleTexts: [
      '太阴湿土\n四之气', 
      '阳明燥金\n五之气',
      '太阳寒水\n终之气',  
      '厥阴风木\n初之气',
      '少阴君火\n二之气',
      '少阳相火\n三之气',
    ],
    // 颜色映射表
    middleColorMap: {
      '太阴湿土': '#f6d206',
      '少阳相火': '#f80707',
      '阳明燥金': '#d4dcde',
      '太阳寒水': '#010001',
      '厥阴风木': '#05af2a',
      '少阴君火': '#f4529d'
    },
    outerColorMap: {
      '太阴湿土': '#f6d206',
      '少阳相火': '#f80707',
      '阳明燥金': '#d4dcde',
      '太阳寒水': '#010001',
      '厥阴风木': '#05af2a',
      '少阴君火': '#f4529d'

    },
  }
  },
  computed: {
  outerSeasonTexts(){
    return this.isStartLichun
      ?['8月4，立秋','10月4，寒露','12月4，大雪','2月4，立春','4月5，清明','6月4，芒种'] 
      :['7月21，大暑','9月21，秋分','11月21，小雪','1月21，大寒','3月21，春分','5月21，小满']
  },
  outerColors() {
    return this.outerTexts.map(text => {
      return this.outerColorMap[text] || '#CCCCCC';
    });
  },
  middleColors() {
    return this.middleTexts.map(text => {
      const key = text.split('\n')[0]; 
      return this.middleColorMap[key] || '#CCCCCC'; 
    });
  },
  outerTextColors() {
    return this.outerTexts.map(text => text === '太阳寒水' ? '#FFFFFF' : '#000');
  },
  middleTextColors() {
    return this.middleTexts.map(text => {
      const key = text.split('\n')[0];
      return key === '太阳寒水' ? '#FFFFFF' : '#000';
    });
  }
},

  watch: {
    patientId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchData();
        }
      }
    },
    isStartLichun: {
      immediate: true,
      handler(newVal) {
        this.fetchData();
      }
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.post(
          '/ljkj_cloud/patient/getPatient5y6q',
          { patientId: this.patientId,
            isStartLiChun: false
           }
        );
        if (response.data.code === 200) {
          this.tianGanDiZhi = response.data.data.now5y6q.tianGanDiZhi;

          this.nowsiTianQi = response.data.data.now5y6q.siTianQi;
          
          const sixQiCycle = [
            '厥阴风木',
            '少阴君火',
            '太阴湿土',
            '少阳相火',
            '阳明燥金',
            '太阳寒水'  
          ];


          const startIndex = sixQiCycle.indexOf(this.nowsiTianQi);
          
          this.outerTexts = [];
          for (let i = 0; i < 6; i++) {
            const cycleIndex = (startIndex + i) % 6;
            this.outerTexts.push(sixQiCycle[cycleIndex]);
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    getSectorPath(outerR, innerR, startAngle, endAngle) {
      const startRad = (startAngle - 90) * Math.PI / 180
      const endRad = (endAngle - 90) * Math.PI / 180
      
      const x1 = this.center.x + innerR * Math.cos(startRad)
      const y1 = this.center.y + innerR * Math.sin(startRad)
      const x2 = this.center.x + outerR * Math.cos(startRad)
      const y2 = this.center.y + outerR * Math.sin(startRad)
      const x3 = this.center.x + outerR * Math.cos(endRad)
      const y3 = this.center.y + outerR * Math.sin(endRad)
      const x4 = this.center.x + innerR * Math.cos(endRad)
      const y4 = this.center.y + innerR * Math.sin(endRad)
      
      const largeArc = endAngle - startAngle <= 180 ? 0 : 1
      
      return `M ${x1} ${y1} 
              L ${x2} ${y2} 
              A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} 
              L ${x4} ${y4} 
              A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1} Z`
    },
    getTextPosition(radius, angle) {
      const rad = (angle - 90) * Math.PI / 180
      return {
        x: this.center.x + radius * Math.cos(rad),
        y: this.center.y + radius * Math.sin(rad)
      }
    },
    // 新增方法：生成弧形路径
    getArcPath(radius, startAngle, endAngle) {
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
      
      const startX = this.center.x + radius * Math.cos(startRad);
      const startY = this.center.y + radius * Math.sin(startRad);
      const endX = this.center.x + radius * Math.cos(endRad);
      const endY = this.center.y + radius * Math.sin(endRad);
      
      return `M ${startX} ${startY} 
              A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
    }
  }
}
</script>

<style scoped>
.circular-figure {
  padding: 20px;
}

.diagram-container {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px;
  margin: 10px auto;
  max-width: 600px;
  overflow: visible;
}

text{
  pointer-events: none;
  user-select: none;
}
</style>