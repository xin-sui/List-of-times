<script setup lang="ts"></script>
<template>
    <li>
        <div class="left">
            <slot name="left"></slot>
        </div>

        <div class="right">
            <slot name="right"></slot>
        </div>
    </li>
</template>
<style scoped lang="scss">
li {

    height: 90px;
    border-bottom: 1px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
        display: flex;
        align-items: center;
        height: 100%;
        position: relative;
    }

    .right {
        display: flex;

        .time-long {
            margin-right: 26px;
        }
    }
}

@media (max-width: 768px) {

    /* 在屏幕宽度小于或等于768像素时应用的样式 */
    li {
        width: 90%;
        height: 126px;
        flex-direction: column;
        padding: 20px 18px;
        align-items: flex-start;
        .left {
            flex-direction: column;
            align-items: flex-start;
        }
    }
}
</style>
