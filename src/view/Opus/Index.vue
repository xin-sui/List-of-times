<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import OpusItem from './components/OpusItem.vue';
// 常量定义
const DAYS_IN_WEEK = 7;
// const MONTHS_IN_YEAR = 12;
const START_YEAR = 2023;

// 初始化开始日期和结束日期
const startDate = ref(new Date(START_YEAR, 0, 1)); // 2023年1月1日
const currentWeekStart = ref(new Date(startDate.value)); // 从开始日期开始

// 创建月份列表
interface MonthItem {
    name: string;
    index: number;
}
// 指定开始结束月份
const START_MONTH = 0; // 从3月开始（月份索引从0开始，所以3月是索引2）
const END_MONTH = 3; // 到8月结束（同样，8月是索引7）
const monthList: MonthItem[] = Array.from(
    { length: END_MONTH - START_MONTH + 1 },
    (_, index) => ({
        name: new Date(START_YEAR, START_MONTH + index, 1).toLocaleString('default', { month: 'long' }),
        index: START_MONTH + index
    })
);


// 当前激活的月份索引
const activeIndex: Ref<number> = ref(0);

// 设置当前日期和周开始日期
const setCurrentAndWeekStart = (year: number, monthIndex: number, day: number) => {
    currentDate.value = new Date(year, monthIndex, day);
    if (day === 1) {
        // 如果是月份的第一天，那么周开始日期也设置为这一天
        currentWeekStart.value = new Date(year, monthIndex, 1);
    } else {
        // 否则，计算周开始日期
        let dayOfWeek = currentDate.value.getDay();
        dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // 如果今天是星期日（0），则设置 dayOfWeek 为 7
        currentWeekStart.value = new Date(year, monthIndex, day - dayOfWeek + 1);
    }
    daysInMonth.value = getWeekDays(currentWeekStart.value);
    updateActiveMonth(currentDate.value);
};

// 激活指定的月份
const active = (monthIndex: number) => {
    activeIndex.value = monthIndex;
    const year = currentDate.value.getFullYear();
    setCurrentAndWeekStart(year, monthIndex, 1);
};
//激活当前最新的一天
// const latestDay = (monthIndex: number, day: number = 1) => {
//   activeIndex.value = monthIndex;
//   const year = currentDate.value.getFullYear();
//   setCurrentAndWeekStart(year, monthIndex, day);
// };


// 当前日期
const currentDate: Ref<Date> = ref(new Date());


// 当前月份的天数
const daysInMonth: Ref<Array<{ date: number; dayOfWeek: string, isLastDayOfMonth: boolean }>> = ref([]);


// 更新当前激活的月份
const updateActiveMonth = (date: Date) => {
    activeIndex.value = date.getMonth();
};

// 通用的周切换函数
const changeWeek = (days: number) => {
    const newWeekStart = new Date(currentWeekStart.value.getFullYear(), currentWeekStart.value.getMonth(), currentWeekStart.value.getDate() + days);

    // 检查是否跨越了月份
    if (days > 0 && newWeekStart.getMonth() !== currentWeekStart.value.getMonth()) {
        // 如果是切换到下一周且跨越了月份，则设置为下个月的第一天
        currentWeekStart.value = new Date(newWeekStart.getFullYear(), newWeekStart.getMonth(), 1);
    } else {
        // 否则，直接更新为新的周开始日期
        currentWeekStart.value = newWeekStart;
    }

    daysInMonth.value = getWeekDays(currentWeekStart.value);
    updateActiveMonth(currentWeekStart.value);
};

// 上一周
const previousWeek = (): void => {
    changeWeek(-DAYS_IN_WEEK);
};

// 下一周
const nextWeek = (): void => {
    changeWeek(DAYS_IN_WEEK);
};


// 当前周索引
const weekIndex: Ref<number> = ref(1);

// 选择日期
const togetWeek = (index: number, dateIndex: number) => {
    console.log(dateIndex);

    weekIndex.value = index;
};

const getWeekDays = (startDate: Date): Array<{ date: number; dayOfWeek: string; isLastDayOfMonth: boolean }> => {
    const days: Array<{ date: number; dayOfWeek: string; isLastDayOfMonth: boolean }> = [];
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
        const day: Date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        const nextDay: Date = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
        days.push({
            date: day.getDate(),
            dayOfWeek: day.toLocaleString('zh-CN', { weekday: 'long' }),
            isLastDayOfMonth: nextDay.getMonth() !== day.getMonth() // 检查是否为月末的最后一天
        });
    }
    return days;
};

// 计算给定日期所在周的索引
const getWeekIndex = (date: Date, weekStart: Date): number => {
    const startTimestamp: number = weekStart.getTime();
    const dateTimestamp: number = date.getTime();
    const diff: number = dateTimestamp - startTimestamp;
    const oneDay: number = 24 * 60 * 60 * 1000; // 一天的毫秒数
    return Math.floor(diff / oneDay / DAYS_IN_WEEK) + 1;
};




onMounted(() => {
    const today = new Date();
    currentDate.value = today;
    //激活最新的一天
    // latestDay(today.getMonth(), today.getDate());
    //指定激活月份
    activeIndex.value = 2
    active(2)
    weekIndex.value = getWeekIndex(currentDate.value, currentWeekStart.value);
    // 获取当前月份的天数
    daysInMonth.value = getWeekDays(currentWeekStart.value);
});
</script>

<template>
    <p class="time-time container">展映時段</p>
    <div class="screening container">
        <!-- 月 -->
        <div class="month">
            <ul>
                <li v-for="item in monthList" :key="item.index" @click="active(item.index)"
                    :class="{ active: activeIndex === item.index }">
                    {{ item.name }}
                </li>
            </ul>
        </div>
        <!-- 周 -->
        <div class="weeks">
            <div class="prev" @click="previousWeek">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 5L11 16L21 27" stroke="black" />
                </svg>
            </div>

            <ul>
                <li v-for="(item, index) in daysInMonth" :key="index" :class="{ weekActive: weekIndex === index + 1 }"
                    @click="togetWeek(index + 1, item.date)">
                    <div class="date-week">
                        <p>{{ item.date }}</p>
                        <p>{{ item.dayOfWeek }}</p>
                    </div>
                    <!-- 显示提示信息 -->
                    <span v-if="item.isLastDayOfMonth" class="next-month-hint">
                        <span>
                            二
                            月
                            囉
                        </span>
                    </span>
                </li>
            </ul>
            <div class="next" @click="nextWeek">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L21 16L11 27" stroke="black" />
                </svg>
            </div>
        </div>
        <!-- 列表 -->
        <OpusItem></OpusItem>
    </div>
</template>

<style lang="scss">
.time-time {
    font-weight: 700;
    font-size: 24px;
    padding: 0.9em 0;
    letter-spacing: 0.05em;
    display: flex;
}


.screening {
    background-color: #fff9f7;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    .month {
        height: 84px;
        margin-left: 38px;
        width: 24.6875em;

        ul {
            display: flex;
            height: 100%;
            text-align: center;
            background: rgba(255, 220, 179, 1);

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
        padding: 0 54px;


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
                position: relative;

                &:last-child {
                    margin-right: 0;
                }

                .next-month-hint {
                    position: absolute;
                    top: 50%;
                    /* 垂直居中 */
                    right: -65px;
                    /* 将提示向左移动，确保不会占用额外空间 */
                    transform: translateY(-50%);
                    /* 防止文本换行 */
                    border: 1px solid #0085FF;
                    padding: 5px;
                    border-radius: 5px;
                    width: 36px;
                    height: 77px;
                    text-align: center;

                    span {
                        font-family: Inter;
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 21px;
                        text-align: center;
                        color: #0085FF;
                    }
                }
            }

            .date-week {
                width: 50px;
                height: 52px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 5px 0;
                font-weight: 700;

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

                    }
                }
            }
        }

    }



}
</style>
