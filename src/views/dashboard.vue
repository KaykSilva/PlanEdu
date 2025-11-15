<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-base-200">

    <main class="container mx-auto px-4 py-6">
      <!-- Hero -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Seus Planos de Aula</h1>
        <p class="opacity-70 mb-6">
          Organize e gerencie todos os seus planos de ensino em um só lugar
        </p>

        <button
          class="btn btn-primary gap-2 shadow-lg"
          @click="goToCreate"
        >
          <Plus class="w-5 h-5" />
          Criar Novo Plano
        </button>
      </div>

      <!-- Busca + Filtros -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Input -->
        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 w-4 h-4"
          />
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Pesquisar planos de aula..."
            class="input input-bordered w-full pl-10 shadow"
          />
        </div>

        <!-- Badges -->
        <div class="flex gap-2 overflow-x-auto pb-1">
          <div
            v-for="subject in subjects"
            :key="subject"
            class="badge cursor-pointer whitespace-nowrap transition-all"
            :class="selectedSubject === subject ? 'badge-primary' : 'badge-outline'"
            @click="selectedSubject = subject"
          >
            {{ subject }}
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="filteredPlans.length > 0"
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(plan, idx) in filteredPlans"
          :key="plan.id"
          :style="{ animationDelay: `${idx * 100}ms` }"
          class="animate-fadeIn"
        >
          <LessonPlanCard :plan="plan" />
        </div>
      </div>

      <!-- Vazio -->
      <div v-else class="text-center py-12">
        <BookOpen class="w-16 h-16 mx-auto mb-4 opacity-60" />
        <h3 class="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>

        <p class="opacity-70 mb-4">
          {{ searchTerm || selectedSubject !== "Todas"
            ? "Tente ajustar sua pesquisa ou filtros."
            : "Comece criando seu primeiro plano de aula!"
          }}
        </p>

        <button class="btn btn-outline gap-2" @click="goToCreate">
          <Plus class="w-4 h-4" />
          Criar Primeiro Plano
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// Ícones lucide-vue
import { Search, Plus, BookOpen } from "lucide-vue-next";

import LessonPlanCard from "@/components/cards/lessonPlanCard.vue";

// Dados mock
const samplePlans = [
  {
    id: "1",
    title: "Introdução à Matemática: Números e Operações",
    subject: "Matemática",
    duration: "50 min",
    date: "15/01/2024",
    grade: "5º Ano",
    objectives: [
      "Compreender o conceito de números naturais",
      "Realizar operações básicas de adição e subtração",
      "Aplicar conhecimentos em problemas práticos",
      "Desenvolver raciocínio lógico matemático"
    ]
  },
  {
    id: "2",
    title: "História do Brasil: Período Colonial",
    subject: "História",
    duration: "45 min",
    date: "16/01/2024",
    grade: "7º Ano",
    objectives: [
      "Identificar características do período colonial",
      "Analisar a sociedade colonial brasileira",
      "Compreender as relações entre colonizadores e colonizados"
    ]
  },
  {
    id: "3",
    title: "Ciências: O Sistema Solar",
    subject: "Ciências",
    duration: "40 min",
    date: "17/01/2024",
    grade: "6º Ano",
    objectives: [
      "Conhecer os planetas do sistema solar",
      "Compreender o movimento dos planetas",
      "Identificar características de cada planeta"
    ]
  }
];

const subjects = ["Todas", "Matemática", "História", "Ciências", "Português", "Geografia"];

const searchTerm = ref("");
const selectedSubject = ref("Todas");

const router = useRouter();

const goToCreate = () => {
  router.push("/criar");
};

const filteredPlans = computed(() =>
  samplePlans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesSubject =
      selectedSubject.value === "Todas" ||
      plan.subject === selectedSubject.value;

    return matchesSearch && matchesSubject;
  })
);
</script>

<style>
/* simples animação */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease both;
}
</style>
