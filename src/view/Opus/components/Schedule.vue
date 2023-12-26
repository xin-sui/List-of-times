<script setup lang="ts">

</script>
<template>
    <p class="time-time container">展映時段</p>
    <div class="schedule container">
        <!-- 列表 -->
        <div class="data-list">
            <ul>
                <li v-for="(item, index) in 6" :key="index">
                    <div class="left">

                    </div>

                    <div class="right">

                    </div>
                </li>
            </ul>

        </div>
    </div>
</template>
<style scoped lang="scss">
.schedule {
    background-color: aquamarine;
}

.time-time {
    font-weight: 700;
    font-size: 24px;
    padding: 0.9em 0;
    letter-spacing: 0.05em;
    display: flex;
}

.data-list {

    ul {
        margin-top: 18px;

        li {
            width: 100%;
            height: 90px;
            border-bottom: 1px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 73px;

            .left {
                display: flex;
                align-items: center;
                height: 100%;
                position: relative;

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
                    width: 48px;
                    height: 48px;
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
            }

            .right {
                display: flex;

                .time-long {
                    margin-right: 26px;
                }

                .ml-2 {
                    margin-right: 6px;
                    width: 64px;
                    height: 19px;
                    font-family: Noto Sans;
                    font-size: 11px;
                    font-weight: 400;
                    line-height: 15px;
                    letter-spacing: 0em;
                    text-align: left;

                    color: #393939;
                }
            }
        }
    }
}
</style>