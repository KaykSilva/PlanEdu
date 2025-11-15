<script setup>
import { useRouter } from 'vue-router'
import { Plus, BookOpen, User } from 'lucide-vue-next'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full bg-porcelain backdrop-blur border-b border-base-300 shadow"
  >
    <div class="container flex h-16 items-center justify-between px-4">

      <!-- Logo -->
      <div
        class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        @click="goTo('/')"
      >
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow"
        >
          <BookOpen class="w-6 h-6 text-base-100" />
        </div>

        <div>
          <h1 class="text-xl font-bold">PlanEdu</h1>
          <p class="text-xs opacity-70">Planos de Ensino</p>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex items-center gap-3">

        <!-- Botão Criar -->
        <button
          class="btn btn-outline btn-sm gap-2 shadow hover:shadow-md"
          @click="goTo('/criar')"
        >
          <Plus class="w-4 h-4" />
          Novo Plano
        </button>

        <!-- Usuário -->
        <button class="btn btn-ghost btn-sm w-9 h-9 p-0">
          <User class="w-5 h-5" />
        </button>

      </div>

    </div>
  </header>
</template>
