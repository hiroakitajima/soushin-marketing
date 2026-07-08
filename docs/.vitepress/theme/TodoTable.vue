<script setup>
import { ref, computed, onMounted } from 'vue'

const BASE_URL = import.meta.env.VITE_SUPABASE_URL + '/rest/v1/tasks'
const HEADERS = {
  'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

const filter = ref('全て')
const filters = ['全て', '🔴 未着手', '🟡 進行中', '🟢 完了']
const statuses = ['🔴 未着手', '🟡 進行中', '🟢 完了']
const categories = ['KASOU', 'ELG', 'コーポレートサイト', '横断施策', 'コンテンツ', '調査', 'その他']

const tasks = ref([])
const loading = ref(true)
const error = ref('')
const showAddForm = ref(false)
const newTask = ref({ title: '', category: '', owner: '', due: '', status: '🔴 未着手' })
const savingIds = ref(new Set())

async function fetchTasks() {
  try {
    console.log('Fetching from:', BASE_URL)
    const res = await fetch(BASE_URL + '?order=position,created_at', { headers: HEADERS })
    const data = await res.json()
    if (!res.ok) throw new Error(JSON.stringify(data))
    tasks.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)

const filtered = computed(() =>
  filter.value === '全て'
    ? tasks.value
    : tasks.value.filter(t => t.status === filter.value)
)

function countByStatus(s) {
  return s === '全て' ? tasks.value.length : tasks.value.filter(t => t.status === s).length
}

const timers = {}
function updateField(task, field, value) {
  task[field] = value
  clearTimeout(timers[task.id])
  savingIds.value = new Set([...savingIds.value, task.id])
  timers[task.id] = setTimeout(async () => {
    await fetch(BASE_URL + '?id=eq.' + task.id, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ [field]: value }),
    })
    const next = new Set(savingIds.value)
    next.delete(task.id)
    savingIds.value = next
  }, 1000)
}

async function addTask() {
  if (!newTask.value.title) return
  await fetch(BASE_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ ...newTask.value, position: tasks.value.length }),
  })
  newTask.value = { title: '', category: '', owner: '', due: '', status: '🔴 未着手' }
  showAddForm.value = false
  await fetchTasks()
}

async function deleteTask(task) {
  await fetch(BASE_URL + '?id=eq.' + task.id, { method: 'DELETE', headers: HEADERS })
  await fetchTasks()
}
</script>

<template>
  <div class="todo-wrap">
    <div class="todo-filters">
      <button
        v-for="f in filters" :key="f"
        :class="['todo-filter-btn', { active: filter === f }]"
        @click="filter = f"
      >
        {{ f }} <span class="count">{{ countByStatus(f) }}</span>
      </button>
      <button class="todo-filter-btn add-btn" @click="showAddForm = !showAddForm">＋ 追加</button>
    </div>

    <div v-if="showAddForm" class="add-form">
      <input v-model="newTask.title" placeholder="タスク名" class="form-input title-input" @keyup.enter="addTask" />
      <select v-model="newTask.category" class="form-input">
        <option value="">カテゴリ</option>
        <option v-for="c in categories" :key="c">{{ c }}</option>
      </select>
      <input v-model="newTask.owner" placeholder="担当" class="form-input" />
      <input v-model="newTask.due" placeholder="期限 (例: 7/31)" class="form-input" />
      <select v-model="newTask.status" class="form-input">
        <option v-for="s in statuses" :key="s">{{ s }}</option>
      </select>
      <button class="save-btn" @click="addTask">追加</button>
      <button class="cancel-btn" @click="showAddForm = false">キャンセル</button>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-if="error" class="loading" style="color:red">エラー: {{ error }}</div>

    <table v-else class="todo-table">
      <thead>
        <tr>
          <th>タスク</th>
          <th>カテゴリ</th>
          <th>担当</th>
          <th>期限</th>
          <th>ステータス</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in filtered" :key="task.id" :class="{ saving: savingIds.has(task.id) }">
          <td><textarea class="cell-input cell-textarea" :value="task.title" @input="updateField(task, 'title', $event.target.value)" rows="1" /></td>
          <td>
            <select class="cell-input tag-input" :value="task.category" @change="updateField(task, 'category', $event.target.value)">
              <option value="">—</option>
              <option v-for="c in categories" :key="c">{{ c }}</option>
            </select>
          </td>
          <td><input class="cell-input short-input" :value="task.owner" placeholder="—" @input="updateField(task, 'owner', $event.target.value)" /></td>
          <td><input class="cell-input short-input" :value="task.due" placeholder="—" @input="updateField(task, 'due', $event.target.value)" /></td>
          <td>
            <select class="cell-input" :value="task.status" @change="updateField(task, 'status', $event.target.value)">
              <option v-for="s in statuses" :key="s">{{ s }}</option>
            </select>
          </td>
          <td><button class="delete-btn" @click="deleteTask(task)">✕</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.todo-wrap { margin-top: 24px; }

.todo-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.todo-filter-btn {
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.todo-filter-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.add-btn { margin-left: auto; }
.count { margin-left: 4px; opacity: 0.7; font-size: 11px; }

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px;
  background: var(--vp-c-bg-mute);
  border-radius: 8px;
}

.form-input {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.title-input { flex: 1; min-width: 200px; }

.save-btn {
  padding: 4px 14px;
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.cancel-btn {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.loading { color: var(--vp-c-text-2); font-size: 14px; padding: 16px 0; }

.todo-table { width: 100%; border-collapse: collapse; font-size: 14px; }

.todo-table th {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 2px solid var(--vp-c-divider);
  font-weight: 600;
  white-space: nowrap;
}

.todo-table td {
  padding: 4px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}

.todo-table tr.saving { opacity: 0.6; }

.cell-input {
  width: 100%;
  padding: 4px 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.cell-input:hover, .cell-input:focus {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
  outline: none;
}

.short-input { width: 80px; }
.tag-input { width: 120px; }

.cell-textarea {
  resize: none;
  overflow: hidden;
  line-height: 1.4;
  min-height: 28px;
  field-sizing: content;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 12px;
  padding: 4px;
  opacity: 0.4;
}

.delete-btn:hover { opacity: 1; color: #ef4444; }
</style>
