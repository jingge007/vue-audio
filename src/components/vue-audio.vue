<template>
  <div class="mainpart">
    <div class='operationBox'>
      <!-- 播放/暂停 -->
      <div class="playButtCon" @click="playBtn">{{ playButtConText }}</div>
      <!--开始时间-->
      <div class="start_time">{{countTime}}</div>
      <!-- 音频轨迹 -->
      <div
        @mousedown='trackDown'
        @mousemove='trackMove'
        @mouseup='trackUp'
        class="audioTrack"
        ref="audioTrack">
        <!-- 进度百分比 -->
        <div
          class="audioPercentage"
          ref='audioPercentage'
          :style="{ width: accomplishData + unit}">
        </div>
        <div class='audioName'></div>
      </div>
      <!--结束时间-->
      <div class="end_time">{{altogetherTimer}}</div>
    </div>
    <!-- 原生音频文件 -->
    <div class="originalAudio">
      <audio ref='audioEl' autobuffer controls="controls" @canplaythrough="oncanplaythrough">
        <source :src="source" type="audio/mpeg">
      </audio>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  let timer
  export default {
    props: {
      source: {
        type: String,
        default: 'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131229550.m4a?#.mp3'
      }
    },
    data() {
      return {
        playButtConText: '▶',
        altogetherTimer: null, //音频总时长
        scheduleTimer: 0, //当前播放进度时间
        accomplishData: null, // 当前播放进度比
        countTime: '00:00:00', // 倒计时时间
        unit: '%', //单位
        isTransition: true,
        ismouseDown: false,
        lastMoveVal: 0
      }
    },
    methods: {
      // oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发
      oncanplaythrough() {
        let time = Math.round(this.$refs.audioEl.duration) === Infinity ? 0 : Math.round(this.$refs.audioEl.duration)
        this.altogetherTimer = this.realFormatSecond(time);
      },
      // 正在播放时音频轨迹的状态
      myAudioPlay(PercentageData) {
        let audioEl = this.$refs.audioEl
        this.unit = '%'
        this.accomplishData = PercentageData * 100
        if (audioEl.currentTime == audioEl.duration) {
          this.playButtConText = '▶'
          clearInterval(timer)
        }
      },
      playBtn() {
        let audioEl = this.$refs.audioEl
        if (this.$refs.audioEl.paused) {
          if (audioEl.currentTime == audioEl.duration) {
            this.accomplishData = 0
          }
          audioEl.play()
          clearInterval(timer) // 清除计时器
          this.playButtConText = '■'
          timer = setInterval(() => {
            this.myAudioPlay(audioEl.currentTime / audioEl.duration) // 计算播放进度百分比
            let time =Math.round(audioEl.currentTime);
            this.countTime = this.realFormatSecond(time)
          }, 1000)
        } else {
          audioEl.pause()
          clearInterval(timer) // 清除计时器
          this.playButtConText = '▶'
        }
      },
      // 重置按钮
      // retPlay() {
      //   let audioEl = this.$refs.audioEl
      //   audioEl.currentTime = 0
      //   this.accomplishData = 0
      //   this.countTime = null
      //   audioEl.pause()
      //   this.playBtn()
      // },
      trackFn(ev) {
        let audioTrack = this.$refs.audioTrack // 音频轨迹
        let audioEl = this.$refs.audioEl
        let audioTrackW = audioTrack.offsetWidth // 读取音频轨迹的长度
        this.unit = 'px'
        this.accomplishData = ev.layerX
        let cilckPercentage = ev.layerX / audioTrackW
        audioEl.currentTime = cilckPercentage * audioEl.duration
        let time =Math.round(audioEl.currentTime)
        this.countTime = this.realFormatSecond(time);
      },
      // 点击音频轨迹
      trackDown(ev) {
        this.ismouseDown = true
        this.unit = 'px'
        this.accomplishData = ev.layerX
      },
      trackMove(ev) {
        if (this.ismouseDown) {
          this.trackFn(ev)
        }
      },
      trackUp(ev) {
        this.ismouseDown = false
        this.trackFn(ev)
        if (this.$refs.audioEl.paused) {
          this.playBtn()
        }
      },
      // 将整数转换成 时：分：秒的格式
      realFormatSecond(s) {
        let t;
        if (s > -1) {
          let hour = Math.floor(s / 3600);
          let min = Math.floor(s / 60) % 60;
          let sec = s % 60;
          if (hour < 10) {
            t = '0' + hour + ":";
          } else {
            t = hour + ":";
          }
          if (min < 10) {
            t += "0";
          }
          t += min + ":";
          if (sec < 10) {
            t += "0";
          }
          t += sec;
        }
        return t;
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .mainpart {
    width: 650px
    margin 50px auto 0
    .operationBox {
      height: 30px;
      display: flex;
      align-items: center;
      background-color: #000000
      color #fff
      .playButtCon {
        width: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #fff;
        font-weight: 700;
        cursor: pointer
      }
      .audioTrack {
        cursor: pointer
        width: 100%;
        height: 10px
        border-radius 2px
        position: relative;
        background-color: #7B7979;
        .audioPercentage {
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #fff;
          opacity: .85;
          transition: all .05s;
          border-radius 2px
        }
        .audioName {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #333;
          position: absolute;
          -moz-user-select: none; /* Firefox私有属性 */
          -webkit-user-select: none; /* WebKit内核私有属性 */
          -ms-user-select: none; /* IE私有属性(IE10及以后) */
          -khtml-user-select: none; /* KHTML内核私有属性 */
          -o-user-select: none; /* Opera私有属性 */
          user-select: none; /* CSS3属性 */
        }
      }
      .start_time, .end_time {
        padding 0 10px
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
  }

  .originalAudio {
    display: none
  }
</style>
