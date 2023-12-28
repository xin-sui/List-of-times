<script setup lang="ts">
import { ref, onMounted, Ref, watchEffect, onUnmounted } from 'vue';
import SchedultItemVue from './components/SchedultItem.vue';

// 常量定义
const DAYS_IN_WEEK = ref(7);

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
const START_MONTH = 2; // 从3月开始（月份索引从0开始，所以3月是索引2）
const END_MONTH = 6; // 到8月结束（同样，8月是索引7）
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
        console.log('dayOfWeek', dayOfWeek);

        dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // 如果今天是星期日（0），则设置 dayOfWeek 为 7

        currentWeekStart.value = new Date(year, monthIndex, day - dayOfWeek + 1);

    }
    weekDateIndex.value = 1
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
//     activeIndex.value = monthIndex;
//     const year = currentDate.value.getFullYear();

//     setCurrentAndWeekStart(year, monthIndex, day);
// };


// 当前日期
const currentDate: Ref<Date> = ref(new Date());


// 当前月份的天数
const daysInMonth: Ref<Array<{ date: number; dayOfWeek: string, isLastDayOfMonth: boolean, isWeekInSameMonth: boolean }>> = ref([]);


// 更新当前激活的月份
const updateActiveMonth = (date: Date) => {
    activeIndex.value = date.getMonth();
};

// 通用的周切换函数
// 通用的周切换函数
const changeWeek = (days: number) => {
    let newWeekStart = new Date(currentWeekStart.value.getFullYear(), currentWeekStart.value.getMonth(), currentWeekStart.value.getDate() + days);

    // 检查新的周开始日期是否在允许的月份范围内
    if (newWeekStart.getMonth() >= START_MONTH && newWeekStart.getMonth() <= END_MONTH) {
        // 如果切换到下一周后跨越了月份
        if (days > 0 && newWeekStart.getMonth() !== currentWeekStart.value.getMonth()) {
            // 设置为下个月的第一天
            newWeekStart = new Date(currentWeekStart.value.getFullYear(), currentWeekStart.value.getMonth() + 1, 1);
            activeIndex.value = newWeekStart.getMonth(); // 更新激活的月份索引
        }
        // 如果切换到上一周后跨越了月份
        else if (days < 0 && newWeekStart.getMonth() !== currentWeekStart.value.getMonth()) {

            // 计算上一周的开始日期
            const dayOfWeek = currentWeekStart.value.getDay() || DAYS_IN_WEEK.value;

            // 减去7天，得到上一周的日期
            newWeekStart = new Date(currentWeekStart.value.getFullYear(), currentWeekStart.value.getMonth(), currentWeekStart.value.getDate() - dayOfWeek);
            if (DAYS_IN_WEEK.value === 5) {
                // 如果新的周开始日期是上一个月，则设置为上个月的最后一天
                if (newWeekStart.getMonth() !== currentWeekStart.value.getMonth()) {
                    newWeekStart = new Date(currentWeekStart.value.getFullYear(), currentWeekStart.value.getMonth(), 0);
                }
            }

            activeIndex.value = newWeekStart.getMonth(); // 更新激活的月份索引

        }

        // 更新当前周的开始日期
        currentWeekStart.value = newWeekStart;
        weekDateIndex.value = currentWeekStart.value.getDate();
        // 更新当前月份的天数
        daysInMonth.value = getWeekDays(currentWeekStart.value);
        // 更新激活的月份
        updateActiveMonth(currentWeekStart.value);
    }
};

// 上一周
const previousWeek = (): void => {
    changeWeek(-DAYS_IN_WEEK.value);
};

// 下一周
const nextWeek = (): void => {
    changeWeek(DAYS_IN_WEEK.value);
};

// 添加一个响应式变量来存储窗口宽度
const windowWidth = ref(window.innerWidth);

// 监听窗口大小变化的函数
const onResize = () => {
    windowWidth.value = window.innerWidth;
};

// 当前周索引

const weekDateIndex: Ref<number> = ref(1);
// 选择日期
const togetWeek = (dateIndex: number) => {

    weekDateIndex.value = dateIndex;

};
const getWeekDays = (startDate: Date): Array<{ date: number; dayOfWeek: string; isLastDayOfMonth: boolean; isWeekInSameMonth: boolean }> => {
    // 定义一个数组，用于存储每一天的信息
    const days: Array<{ date: number; dayOfWeek: string; isLastDayOfMonth: boolean; isWeekInSameMonth: boolean }> = [];
    // 定义一个布尔值，用于判断是否在同一月份
    let isWeekInSameMonth = true;
    // 获取开始日期的月份
    const startMonth = startDate.getMonth();
    // 遍历每一天的信息
    for (let i = 0; i < DAYS_IN_WEEK.value; i++) {
        // 创建一个新的日期对象
        const day: Date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        // 如果日期不在指定的月份范围内，则跳过
        if (day.getMonth() < START_MONTH || day.getMonth() > END_MONTH) {
            continue;
        }
        // 如果日期不在同一月份，则将布尔值设置为false
        if (day.getMonth() !== startMonth) {
            isWeekInSameMonth = false;
        }
        // 创建一个新的日期对象，用于获取下一个日期
        const nextDay: Date = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
        // 将每一天的信息添加到数组中
        days.push({
            date: day.getDate(),
            dayOfWeek: day.toLocaleString('zh-CN', { weekday: 'long' }),
            isLastDayOfMonth: nextDay.getMonth() !== day.getMonth(),
            isWeekInSameMonth: isWeekInSameMonth
        });
    }

    // 将每一天的isWeekInSameMonth属性设置为布尔值
    days.forEach(day => day.isWeekInSameMonth = isWeekInSameMonth);
    // 返回每一天的信息
    return days;
};


// 使用watchEffect来追踪windowWidth的变化
watchEffect(() => {
    if (windowWidth.value <= 768) {
        DAYS_IN_WEEK.value = 5; // 移动端显示5天
    } else {
        DAYS_IN_WEEK.value = 7; // 桌面端显示7天
    }
    // 每次窗口宽度变化时，重新计算周天数
    daysInMonth.value = getWeekDays(currentWeekStart.value);
});




const getNextMonthName = (monthIndex: number): string => {
    const nextMonthIndex = (monthIndex + 1) % 12; // 使用模运算确保索引在0-11之间
    const nextMonthDate = new Date(START_YEAR, nextMonthIndex, 1);
    return nextMonthDate.toLocaleString('default', { month: 'long' });
};


onMounted(() => {
    const today = new Date();
    currentDate.value = today;

    //指定激活月份
    activeIndex.value = 2
    active(2)
    //激活最新的一天
    // latestDay(today.getMonth(), today.getDate());
    // //设置指定多少号或者最新的一天
    // weekDateIndex.value = currentDate.value.getDate()

    // 获取当前月份的天数
    daysInMonth.value = getWeekDays(currentWeekStart.value);
    window.addEventListener('resize', onResize);
    // 初始检查
    onResize();
});
onUnmounted(() => {
    window.removeEventListener('resize', onResize);
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
                <li v-for="item, in daysInMonth" :key="item.date" :class="{ weekActive: weekDateIndex === item.date }"
                    @click="togetWeek(item.date)">
                    <div class="date-week">
                        <p>{{ item.date }}</p>
                        <p>{{ item.dayOfWeek }}</p>
                    </div>
                    <span v-if="!daysInMonth[0].isWeekInSameMonth && item.isLastDayOfMonth" class="next-month-hint">
                        <span>
                            {{ getNextMonthName(activeIndex) }}

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
        <div class="screening-list">
            <SchedultItemVue v-for="item in 6 ">
                <template #left>
                    <div class="time">08:00</div>
                    <div class="title-svg error">
                        <svg width="65" height="65" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink">
                            <circle cx="24.5" cy="24" r="24" fill="url(#pattern0)" />
                            <defs>
                                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use xlink:href="#image0_600_13817"
                                        transform="translate(-0.162465) scale(0.00280112)" />
                                </pattern>
                                <image id="image0_600_13817" width="473" height="357"
                                    xlink:href="data:image/jpeg;base64,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dpWEB7c/ShF9gv8AdEKkSeTX3+xWW9yDs8nWreqWN3+3GmZn4W7iH7XO1RqGzlxioEPtvqHFuS8HvRYwEUDkJDcotczbuau8OE/ew9vRL6ddZNFGWAgDQ+ymzBGA+ds0QS9UAMcxSPXlWLICSfZ4bKNJ2c+ObDzftnbP1txRDPlG8cY8wdpd+54q0k0cgmJPUrdTPllzQCD5qSZbuTty+4jtx8H5muU+9Onqx9kXVkUnYpUEI5zwhuEXOrnkfcH+JQGYclcfNDjqG9dZOuugcFKxXo/Zp9xnMWHV/HprKxk+ST4+zN6gj+I61LFy8Rymavl8QsJZj+W2sTH2TWPw+oX3Gug2Jm0Dw0U8DF1gv7/ZmUhAzFk6KAEi90iYo8CJP5TXhGLM1dre1Y7qex9yDAj7NJIaj01GJfrb0VAiAQXtY9P+jci1Mo0pfBNZUhzolRYwHntSRRp/c0Cp75Xq+FjOxRMJGhK1Jw753pkfeFC2QJyrHbslO/8A0fUvaoJBC5/dTJJV8m37agMhMtyBFSJgZv8A6ogcZSV6kO5KPKZNprBfHfFSrMbM61HMSp+jv/0QoA5k1/h6/wAPX+Hr/D1/h6/w9f4ev8PX+Hr/AA9ehIR/0f/aAAwDAQACAAMAAAAQ888888888888888888888888888888888888888888888888888888888888888888888888sN1lw8888888os8888888888888888oMcMQ8888888w48888888888888888888888888888ss888888888888888084w88888888888888888888888888Y0B08488888888888888884A888888oFa1Qs88884088888888888kU0088Qp7ATkO5846I88888888888844abw08xj/ABrITzEHCkjPPPPPPPPPPIOwOY+FYXaTnnjvrGB8GNPPPPPPPPLG/wCThwksl70ejy8UDWJ9nbzzzzzzzzzzPTDw6++w3FDSyQwWxt3fzzzzzzzzzyz/AL87CU4sWSX8M888X/088888888wUX//AD0UwFK1Y3+HPLNF/wBzjzzzzzzxe9tfvtQoPy0HDQgzyCDuOhjzzzzzzyxPP968iSXz8MTziCzRwxwzzzzzzzzzzyDtT1Mkn/z5zzzzzzzwzDzzzzzzzzzx97zz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" />
                            </defs>
                        </svg>
                    </div>

                    <div class="error-box">
                        <p>該短片因無法播出的原因導致該短片無法播出。</p>
                    </div>
                </template>
                <div class="screening-right">
                    <h4>标题标题</h4>
                    <div class="right">
                        <div class="time-long">时长：38分钟</div>
                        <div class="taps">
                            <el-tag v-for="i in 2" class="ml-2" color="#FFEEC7" type="success">劇情短片</el-tag>
                        </div>
                    </div>
                </div>
            </SchedultItemVue>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.time-time {
    font-weight: 700;
    font-size: 24px;
    padding: 0.9em 0;
    letter-spacing: 0.05em;
    display: flex;
}


.screening {
    background: linear-gradient(110deg, rgba(255, 56, 14, 0.08) 0%, rgba(255, 56, 14, 0.00) 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    .month {
        height: 84px;
        margin-left: 38px;

        width: 100%;

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
        width: 100%;
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

.screening-list {
    padding: 0 73px;

    li {
        justify-content: start;
    }

    .screening-right {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .right {
            display: flex;
        }
    }

    .time {
        margin-right: 16px;
        font-family: Noto Sans;
        font-size: 14px;
        font-weight: 700;
        line-height: 19px;
        letter-spacing: 0.06em;
        text-align: left;
        color: #000000;

    }

    .title-svg {
        position: relative;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        /* 或者使用 24px 也可以 */
        object-fit: cover;
        /* 当图片比例不是1:1时，这可以帮助图片适当地填充 */
        overflow: hidden;
        /* 防止图片溢出容器 */
        margin-right: 24px;
    }

    h4 {
        font-family: Inter;
        font-size: 14px;
        font-weight: 700;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;

    }

    .time-long {
        margin-right: 26px;
    }

    .ml-2 {
        margin-right: 6px;
        width: 64px;
        height: 19px !important;
        font-family: Noto Sans;
        font-size: 11px;
        font-weight: 400;
        line-height: 15px;
        letter-spacing: 0em;
        text-align: left;
        color: #393939 !important;
        border-radius: 0%;
        border: none;
    }

    .error::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('../../assets/image/error.png');
        background-size: 31px 31px;

        /* 或者使用 contain，根据需要调整 */
        background-repeat: no-repeat;
        /* 防止背景图像重复 */
        background-position: center;
        /* 将背景图像居中 */
        background-color: rgba(0, 0, 0, 0.7);
        /* 如果需要，可以保留或移除 */
        z-index: 10;
    }

    .error-box {
        width: 186px;
        height: 67px;
        background-color: rgba(255, 56, 14, 0.56);
        position: absolute;
        left: 90%;
        bottom: -40%;

        p {
            font-family: Noto Sans;
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            letter-spacing: 0.06em;
            padding: 20px 15px 10px 15px;
            color: rgba(255, 255, 255, 1);
        }

        &::after {
            content: '';
            width: 0px;
            height: 0px;
            border-width: 9px 0 0 10px;
            border-style: solid;
            border-color: transparent transparent transparent rgba(255, 56, 14, 0.56);
            position: absolute;
            top: -9px;
            left: 0;
        }
    }


}

@media (max-width: 768px) {
    .screening {
        width: 100% !important;
    }

    .month {
        width: 100% !important;
        margin-left: 0 !important;

        ul {
            justify-content: center;
        }
    }

    .weeks {
        padding: 16px 0 !important;

        ul {
            width: 100% !important;
            margin: 0 !important;
            justify-content: center;

            li {
                margin: 0 5px !important;
            }
        }
    }

    .screening-list {
        padding: 0;
        margin-left: 18px;

        li {
            height: 113px;
        }

        .screening-right {
            flex-direction: column;

            .right {
                flex-direction: column;
            }
        }
    }

    .error-box {
        height: auto !important;
        bottom: -20% !important;

        p {
            padding: 5px 12px !important;
        }
    }

    .next-month-hint {
        display: none;
    }
}
</style>
