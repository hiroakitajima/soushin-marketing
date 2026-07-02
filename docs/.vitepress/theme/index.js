import DefaultTheme from 'vitepress/theme'
import { watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import LineChart from './LineChart.vue'
import './custom.css'

function injectDividers() {
  nextTick(() => {
    document.querySelectorAll('.sidebar-divider').forEach(el => el.remove())
    const groups = document.querySelectorAll('.VPSidebar .group')
    if (groups.length > 3) {
      const hr = document.createElement('hr')
      hr.className = 'sidebar-divider'
      groups[2].after(hr)
    }
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LineChart', LineChart)
  },
  setup() {
    const route = useRoute()
    watch(() => route.path, injectDividers, { immediate: true })
  }
}
