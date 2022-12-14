import { Bar, Doughnut, Line, Pie } from 'vue-chartjs'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler, Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('bar-chart', Bar)
  nuxtApp.vueApp.component('line-chart', Line)
  nuxtApp.vueApp.component('doughnut-chart', Doughnut)
  nuxtApp.vueApp.component('pie-chart', Pie)
})
