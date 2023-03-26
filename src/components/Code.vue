<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'
import ValidPng from '../assets/valid.png'

const { color } = defineProps({
  color: String
})
const randomPostion = { left: Math.floor(Math.random() * 200 + 40), top: Math.floor(Math.random() * 120 + 10) }
const isShow = ref(false)
const isTouch = ref(false)
const offsetX = ref(0)
const btnRef = ref(null)
const imgRef = ref(null)
const canvasRef = ref(null)
const blankRef = ref(null)
const result = ref('')
const position = computed(() => {
  const { width, left } = btnRef.value.getBoundingClientRect()
  return { width, left }
})

// 鼠标按下
const down = () => {
  isTouch.value = true
}
// 鼠标移动
const move = (e: any) => {
  if (!isTouch.value) return
  const offset = e.clientX - position.value.left
  const flag = offset >= 0 && offset < position.value.width - 34
  if (flag) {
    offsetX.value = offset
    if (offsetX.value - randomPostion.left + 6 <= 2 && offsetX.value - randomPostion.left + 6 >= -2) {
      const ctx = canvasRef.value.getContext('2d')
      ctx.strokeStyle = 'green'
      ctx.stroke()
    }
  }
}
// 鼠标松开
document.body.addEventListener('mouseup', () => {
  isTouch.value = false
  if (offsetX.value - randomPostion.left + 6 > 2 || offsetX.value - randomPostion.left + 6 < -2) {
    const ctx = canvasRef.value.getContext('2d')
    ctx.strokeStyle = 'red'
    ctx.stroke()
  }
})
const show = () => {
  isShow.value = !isShow.value
  if (isShow.value) {
    nextTick(drawSlider)
  }
}
// 绘制滑块
const drawSlider = () => {
  const ctx = canvasRef.value.getContext('2d')
  const img = document.createElement('img')
  img.src = ValidPng
  img.onload = () => {
    const { width, height } = imgRef.value.getBoundingClientRect()
    const wRatio = img.naturalWidth / width // 横向比
    const hRatio = img.naturalHeight / height // 纵向比
    const { left, top } = randomPostion
    ctx.beginPath()
    ctx.moveTo(13, 8)
    ctx.beginPath()
    ctx.arc(21, 8, 8, 0, Math.PI, true)
    ctx.moveTo(29, 8)
    ctx.lineTo(40, 8)
    ctx.lineTo(40, 48)
    ctx.lineTo(1, 48)
    ctx.lineTo(1, 36)
    ctx.arc(1, 28, 8, 0.5 * Math.PI, - 0.5 * Math.PI, true)
    ctx.lineTo(1, 8)
    ctx.lineTo(13, 8)
    ctx.clip()
    ctx.drawImage(img, left * wRatio, top * hRatio, 40 * wRatio, 48 * hRatio, 0, 0, 40, 48)
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.stroke()
    drawPlain()
  }
}
// 绘制空白块
const drawPlain = () => {
  const ctx = blankRef.value.getContext('2d')
  ctx.moveTo(13, 8)
    ctx.beginPath()
    ctx.arc(21, 8, 8, 0, Math.PI, true)
    ctx.moveTo(29, 8)
    ctx.lineTo(40, 8)
    ctx.lineTo(40, 48)
    ctx.lineTo(1, 48)
    ctx.lineTo(1, 36)
    ctx.arc(1, 28, 8, 0.5 * Math.PI, - 0.5 * Math.PI, true)
    ctx.lineTo(1, 8)
    ctx.lineTo(13, 8)
    ctx.clip()
    ctx.lineCap = 'round'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.lineWidth = 3
    ctx.fill()
}
</script>

<template>
  <div class="flex h-[600px] justify-center items-center">
    <div class="w-[278px] relative">
      <div v-if="isShow" class="w-[278px] h-[240px] bg-white absolute z-20 left-0 -translate-y-[246px] border rounded px-[6px]">
        <img class="mx-auto mt-[6px] w-full rounded select-none" :src="ValidPng" ref="imgRef" />
        <canvas class="absolute z-30" :style="{ left: `${offsetX + 6 > 230 ? 230 : offsetX + 6}px`, top: `${randomPostion.top}px` }" ref="canvasRef" width="40" height="48"></canvas>
        <canvas class="absolute z-20" :style="{ left: `${randomPostion.left}px`, top: `${randomPostion.top}px` }" ref="blankRef" width="40" height="48"></canvas>
        <div class="relative h-[35px] z-10 flex items-center mt-[4px]" @mousemove.stop.prevent="move" @mouseleave="() => isTouch = false">
          <div :class="`w-[34px] h-[34px] rounded-full absolute top-0 border bg-white cursor-pointer ${isTouch && 'bg-gray-500'}`" :style="{ left: `${offsetX}px` }" @mousedown.stop="down"></div>
          <button class="w-full h-[25px] bg-v-gray rounded-[64px]" ref="btnRef"></button>
        </div>
      </div>
      <slot :show="show" :type="result === 'success' ? 'bg-green-500' : result === 'error' ? 'bg-red-500' : 'bg-blue-500'" />
    </div>
  </div>
</template>
