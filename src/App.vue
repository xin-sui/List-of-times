<template>
  <Index></Index>

  <!-- <Schedule :title="'訂票/播放时间表'">
    <div class="playlist">
      <SchedultItem v-for="(item, i) in data" :key="i" :class="{ 'last-child': data.length - 1 === i }">
        <template #left>
          <div class="time">
            <div class="time-left">
              (周三)
              <span> 2023 </span>
            </div>
            <div class="time-right">
              <span> /01/18 08:00 </span>
            </div>
          </div>

          <div class="address">这里显示地点，这是第一个地址</div>
        </template>
        <template #right>
          <div class="play-right">
            <div class="price">
              正价票：99.00
            </div>

            <div class="play">去购票</div>
          </div>

        </template>
      </SchedultItem>
      <div class="page">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="100" />

      </div>
    </div>
  </Schedule> -->
</template>

<script setup lang="ts">

const data = [1, 2, 3, 4, 5, 6]
import Index from './view/Opus/Index.vue'
import Schedule from './view/Opus/components/Schedule.vue'
import SchedultItem from './view/Opus/components/SchedultItem.vue'
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style>
.playlist {
  padding: 0 11px;
  font-family: Noto Sans;
  font-size: 14px;
  font-weight: 700;
  line-height: 19px;
  position: relative;
  display: flex;
  flex-direction: column;

  .time {
    display: flex;
    margin-right: 16px;

    span {
      font-family: Noto Sans;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 1.2px;
    }

    .time-left {
      color: #000;

    }

    .time-right {
      color: rgba(255, 56, 14, 1);
    }
  }

  .play-right {
    display: flex;
    align-items: center;

    .play {
      font-family: Noto Sans TC;
      font-size: 14px;
      font-weight: 700;
      line-height: 32px;
      letter-spacing: 0.04em;
      text-align: center;
      color: rgba(255, 255, 255, 1);
      margin-left: 26px;
      width: 138px;
      height: 32px;
      background-color: rgba(255, 56, 14, 1);
    }
  }

  .last-child {
    border-bottom: none;
  }

  .page {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;

    .el-pagination {
      --el-pagination-bg-color: '';

      font-family: Noto Sans;
      font-size: 14px;
      font-weight: 700;
      line-height: 19px;
      letter-spacing: 0.06em;

      .el-pager {
        padding: 0 12px
      }

      .is-first,
      .is-last {

        background-color: #ffffff00 !important;
        color: #000;

        i {
          width: 32px;
          height: 32px;

          svg {
            width: 32px;
            height: 32px;
          }
        }
      }

      .el-pager li {
        color: rgba(191, 191, 191, 1);
        font-family: Noto Sans;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 0.84px;

        li.is-active {
          color: aliceblue;
        }
      }

      .el-pager li.is-active {
        color: rgba(0, 0, 0, 1);

      }

    }


  }
}

@media (max-width: 768px) {
  .playlist {
    li {
      height: 153px;
      flex-direction: column;
      align-items: flex-start;
      padding: 24px 0;

      .left {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
      }

      .right {
        margin-top: 16px;
        width: 100%;

        .play-right {
          height: 100%;
          justify-content: space-between;
          width: 100%;
        }
      }

      .address {
        height: 16px;
        margin-top: 12px;
      }

    }

    .page {
      flex-direction: column;
      justify-content: center;
      height: 100px;

      .play {
        margin: 0;
        margin-top: 24px;
      }
    }
  }

  .time-left {
    font-family: Noto Sans;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 1.2px;
  }
}
</style>
