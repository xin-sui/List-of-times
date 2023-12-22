<script setup>
import { ref, computed, onMounted } from 'vue';

// 初始化开始日期和结束日期
const startDate = ref(new Date(2023, 0, 1)); // 2023年1月1日
const endDate = ref(new Date(2023, 11, 31)); // 2023年12月31日
let currentWeekStart = new Date(startDate.value); // 从开始日期开始

// 创建月份列表
const monthList = Array.from({ length: 12 }, (_, index) => ({
  name: new Date(2023, index, 1).toLocaleString('default', { month: 'long' }),
  index: index
}));

// 当前激活的月份索引
const activeIndex = ref(0);

// 激活指定的月份
const active = (monthIndex) => {
  activeIndex.value = monthIndex;
  const year = currentDate.value.getFullYear();
  currentDate.value = new Date(year, monthIndex, 1);
  currentWeekStart = new Date(year, monthIndex, 1 - currentDate.value.getDay());
  daysInMonth.value = getWeekDays(currentDate.value);
};


// 当前日期
const currentDate = ref(new Date());
// 当前月份的天数
const daysInMonth = ref([]);

// 计算当前月份和年份
const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// 更新当前激活的月份
const updateActiveMonth = (date) => {
  activeIndex.value = date.getMonth();
};

// 上一周
const previousWeek = () => {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  daysInMonth.value = getWeekDays(currentWeekStart);
  updateActiveMonth(currentWeekStart);
};

// 下一周
const nextWeek = () => {
  const potentialNextWeekStart = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 7);

  if (potentialNextWeekStart.getMonth() !== currentWeekStart.getMonth()) {
    currentWeekStart = new Date(potentialNextWeekStart.getFullYear(), potentialNextWeekStart.getMonth(), 1);
  } else {
    currentWeekStart = potentialNextWeekStart;
  }

  daysInMonth.value = getWeekDays(currentWeekStart);
  updateActiveMonth(currentWeekStart);
};

// 当前周索引
const weekIndex = ref(1);

// 选择日期
const togetWeek = (index) => {
  console.log(index);
  weekIndex.value = index;
};

// 上一个月
const previousMonth = () => {
  if (currentDate.value <= startDate.value) {
    return;
  }
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  daysInMonth.value = getWeekDays(currentDate.value);
  updateActiveMonth(currentDate.value);
};

// 下一个月
const nextMonth = () => {
  if (currentDate.value >= endDate.value) {
    return;
  }
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  daysInMonth.value = getWeekDays(currentDate.value);
  updateActiveMonth(currentDate.value);
};

// 星期的映射表
const dayOfWeekMap = {
  'Monday': '周一',
  'Tuesday': '周二',
  'Wednesday': '周三',
  'Thursday': '周四',
  'Friday': '周五',
  'Saturday': '周六',
  'Sunday': '周日',
};

// 获取一周的天数
const getWeekDays = (startDate) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    days.push({
      date: day.getDate(),
      dayOfWeek: dayOfWeekMap[day.toLocaleString('en-US', { weekday: 'long' })],
    });
  }
  return days;
};

// 计算给定日期所在周的索引
const getWeekIndex = (date, weekStart) => {
  const start = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay / 7) + 1;
};
// 组件挂载时执行
onMounted(() => {
  // 设置当前日期为今天
  currentDate.value = new Date();
  // 获取当前日期所在的月份
  const currentMonthIndex = currentDate.value.getMonth();
  // 激活当前月份
  active(currentMonthIndex);
  // 更新当前激活的月份
  updateActiveMonth(currentDate.value);
  // 设置当前周索引为当前日期所在的周
  weekIndex.value = getWeekIndex(currentDate.value, currentWeekStart);
});

</script>

<template>
  <p class="time-time container">展映時段</p>
  <div class="screening container">
    <div class="month">
      <ul>
        <li v-for="item in monthList" :key="item.index" @click="active(item.index)"
          :class="{ active: activeIndex === item.index }">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="weeks">
      <div class="prev" @click="previousWeek">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 5L11 16L21 27" stroke="black" />
        </svg>
      </div>

      <ul>
        <li v-for="(item, index) in daysInMonth" :key="index" :class="{ weekActive: weekIndex === index + 1 }"
          @click="togetWeek(index + 1)">
          <div class="date-week">
            <p>{{ item.date }}</p>
            <p>{{ item.dayOfWeek }}</p>
          </div>
        </li>
      </ul>
      <div class="next" @click="nextWeek">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 5L21 16L11 27" stroke="black" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.time-time {
  font-weight: 700;
  font-size: 2.4em;
  padding: 0.9em 0;
  line-height: 2.4em;
  letter-spacing: 0.05em;
  display: flex;
}


.screening {
  background-color: #fff9f7;
  margin: 0 auto;
  height: 758px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .month {
    height: 84px;
    width: 1100px;
    margin-left: 4em;
    background: rgba(255, 220, 179, 1);


    ul {
      display: flex;
      align-items: center;
      height: 100%;
      text-align: center;

      li {
        width: 84px;
        line-height: 84px;
        font-weight: 400;
        font-size: 18px;
      }
    }
  }

  .active {
    position: relative; // 确保伪元素可以相对于此定位
    background-color: #fe301b;
    color: #fff; // 使用简写的颜色值
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      width: 100%; // 使伪元素宽度与父元素相同
      height: 100%; // 使伪元素高度与父元素相同
      top: -15px;
      left: 0;
      background: linear-gradient(178.9deg, #FFEEC7 0.94%, rgba(255, 56, 14, 0) 74.52%);
      clip-path: polygon(50% 0, 0 100%, 100% 100%); // 创建倒三角形
    }
  }

  .weeks {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1100px;
    margin: 0 auto;


    ul {
      display: flex;
      width: 1051px;
      margin: 30px 54px;
      align-items: center;

      .weekActive {
        background-color: #fe301b;
        color: #FFFFFF;
      }

      >li {
        margin-right: 100px;

        &:last-child {
          margin-right: 0;
        }
      }

      .date-week {
        width: 50px;
        height: 52px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px 0;


        p {
          &:nth-child(1) {
            font-family: Noto Sans;
            font-size: 14px;
            font-weight: 700;
            line-height: 19px;
            letter-spacing: 0.06em;
            text-align: center;

          }

          &:nth-child(2) {
            font-family: Noto Sans;
            font-size: 12px;
            line-height: 16px;
            letter-spacing: 0.06em;
            text-align: center;
            color: #222222;
          }
        }
      }
    }

  }


}
</style>
