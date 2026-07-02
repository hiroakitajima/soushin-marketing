# 分析

<script setup>
const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']

const datasets = [
  {
    label: 'サイト訪問数',
    data: [120, 145, 160, 175, 210, 195, 230],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  {
    label: 'お問い合わせ数',
    data: [5, 8, 7, 12, 15, 11, 18],
    borderColor: '#10b981',
    backgroundColor: 'rgba(16,185,129,0.1)',
  },
  {
    label: '資料DL数',
    data: [3, 4, 6, 9, 10, 8, 14],
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245,158,11,0.1)',
  },
]

const tableData = [
  { month: '1月', visits: 120, inquiries: 5, downloads: 3 },
  { month: '2月', visits: 145, inquiries: 8, downloads: 4 },
  { month: '3月', visits: 160, inquiries: 7, downloads: 6 },
  { month: '4月', visits: 175, inquiries: 12, downloads: 9 },
  { month: '5月', visits: 210, inquiries: 15, downloads: 10 },
  { month: '6月', visits: 195, inquiries: 11, downloads: 8 },
  { month: '7月', visits: 230, inquiries: 18, downloads: 14 },
]
</script>

<ClientOnly>
  <LineChart :labels="labels" :datasets="datasets" />
</ClientOnly>

<table>
  <thead>
    <tr>
      <th>月</th>
      <th>サイト訪問数</th>
      <th>お問い合わせ数</th>
      <th>資料DL数</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="row in tableData" :key="row.month">
      <td>{{ row.month }}</td>
      <td>{{ row.visits }}</td>
      <td>{{ row.inquiries }}</td>
      <td>{{ row.downloads }}</td>
    </tr>
  </tbody>
</table>
