<script setup lang="ts">
defineProps<{
    title?: string
}>()
</script>
<template>
    <p class="time-time container">{{ title }}</p>
    <div class="schedule container">
        <!-- 列表 -->
        <div class="data-list">
            <ul>
                <slot></slot>
            </ul>

        </div>
    </div>
</template>
<style scoped lang="scss">
.schedule {

    background: linear-gradient(98.18deg, rgba(255, 153, 0, 0.19) 0%, rgba(255, 153, 0, 0) 100%);

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
    }
}
</style>