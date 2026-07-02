<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler)

const props = defineProps({
  labels: Array,
  datasets: Array,
})

const wrapper = ref(null)
let chart = null

onMounted(() => {
  const canvas = wrapper.value.querySelector('canvas')
  chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets.map((d) => ({
        ...d,
        tension: 0,
        pointRadius: 4,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  })
})

onUnmounted(() => chart?.destroy())
</script>

<template>
  <div ref="wrapper" style="position: relative; height: 320px; width: 100%; margin-bottom: 32px;">
    <canvas />
  </div>
</template>
