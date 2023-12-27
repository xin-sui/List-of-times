<script setup lang="ts"></script>
<template>
    <li>
        <div class="left">
            <slot name="left"></slot>
        </div>
        <slot></slot>
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
</style>
