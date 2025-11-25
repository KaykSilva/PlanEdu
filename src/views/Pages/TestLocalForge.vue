<script setup lang="ts">
import { ref } from 'vue'
import storage from '@/services/storage'

const title = ref('')
const savedPlans = ref<{ key: string, value: any }[]>([])

async function savePlan() {
    if (!title.value.trim()) return alert('Digite um título!')

    const id = Date.now().toString()
    const plan = { id, title: title.value }
    await storage.save(id, plan)
    title.value = ''
    alert('Plano salvo!')
}

async function listPlans() {
    savedPlans.value = await storage.all()
}
</script>

<template>
    <div class="p-6">
        <h2 class="text-lg font-bold mb-4">Teste localForage</h2>

        <input v-model="title" type="text" placeholder="Título do plano" class="border p-2 mb-2 w-full" />

        <div class="flex gap-2 mb-4">
            <button @click="savePlan" class="bg-blue-500 text-white px-4 py-2">Salvar</button>
            <button @click="listPlans" class="bg-green-500 text-white px-4 py-2">Listar</button>
        </div>

        <ul>
            <li v-for="plan in savedPlans" :key="plan.key">
                {{ plan.key }} → {{ plan.value.title }}
            </li>
        </ul>
    </div>
</template>
