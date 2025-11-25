<script setup>
import { ref, computed, onMounted } from "vue";
import { Search, Plus, BookOpen } from "lucide-vue-next";
import { useRouter } from "vue-router";

import LessonPlanCard from "@/components/cards/lessonPlanCard.vue";
import plansStorage from "@/services/storage";

const plans = ref([]);
const subjects = ref(["Todas"]);
const searchTerm = ref("");
const selectedSubject = ref("Todas");

const router = useRouter();

const loadPlans = async () => {
  const stored = await plansStorage.all();

  plans.value = stored.map((item) => ({
    id: item.key,
    ...item.value,
  }));

  const dynamicSubjects = new Set(["Todas"]);

  plans.value.forEach((p) => {
    if (p.subject) dynamicSubjects.add(p.subject);
  });

  subjects.value = Array.from(dynamicSubjects);
};

onMounted(() => {
  loadPlans();
});


const goToCreate = () => router.push("/create");
const selectSubject = (sub) => (selectedSubject.value = sub);
const cleanedSearch = computed(() => searchTerm.value.trim().toLowerCase());

const filteredPlans = computed(() =>
  plans.value.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(cleanedSearch.value) ||
      plan.subject.toLowerCase().includes(cleanedSearch.value);

    const matchesSubject =
      selectedSubject.value === "Todas"
      || plan.subject === selectedSubject.value;

    return matchesSearch && matchesSubject;
  })
);

const hasActiveFilters = computed(() =>
  cleanedSearch.value !== ""
  || selectedSubject.value !== "Todas"
);
</script>

<style>
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

<template>
  <div class="h-full bg-base-200 overflow-hidden">
    <main class="container max-w-[80%] mx-auto px-4 py-6" role="main">

      <!-- Header -->
      <header class="w-full mb-10" role="banner">
        <div class="flex items-center justify-between">
          <section aria-labelledby="page-title">
            <h1 id="page-title" class="text-2xl font-bold leading-none">
              Seus Planos de Aula
            </h1>

            <p id="page-description" class="text-sm opacity-70 mt-1">
              Organize e gerencie todos os seus planos de ensino em um só lugar
            </p>
          </section>

          <nav aria-label="Ações da página">
            <button class="btn btn-primary gap-2 shadow-md" @click="goToCreate">
              <Plus class="w-5 h-5" />
              Criar Novo Plano
            </button>
          </nav>
        </div>
      </header>

      <!-- Busca + Filtros -->
      <section class="w-full flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Ferramentas de busca e filtros">
        <div class="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-[250px]">
          <div class="relative w-full">
            <Search class=" absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/70" />

            <input v-model="searchTerm" type="search" placeholder="Pesquisar planos..." class="input w-full pl-12 py-3 rounded-xl bg-base-100 shadow-md
                     border border-base-300 focus:border-primary
                     focus:ring-2 focus:ring-primary/20 transition-all" aria-label="Pesquisar planos de aula" />
          </div>
        </div>

        <nav class="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto sm:justify-end items-center"
          aria-label="Filtros por disciplina">
          <button v-for="subject in subjects" :key="subject"
            class="badge cursor-pointer whitespace-nowrap transition-all"
            :class="selectedSubject === subject ? 'badge-primary' : 'badge-outline'" @click="selectSubject(subject)"
            type="button">
            {{ subject }}
          </button>
        </nav>
      </section>

      <!-- Lista de planos -->
      <section v-if="filteredPlans.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-label="Lista de planos de aula">
        <article v-for="(plan, idx) in filteredPlans" :key="plan.id" :style="{ animationDelay: `${idx * 100}ms` }"
          class="animate-fadeIn">
          <LessonPlanCard :plan="plan" />
        </article>
      </section>

      <!-- Caso não haja planos -->
      <section v-else class="text-center py-12" aria-label="Nenhum plano encontrado">
        <BookOpen class="w-16 h-16 mx-auto mb-4 opacity-60" />

        <h3 class="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>

        <p class="opacity-70 mb-4">
          {{
            hasActiveFilters
              ? "Tente ajustar sua pesquisa ou filtros."
              : "Comece criando seu primeiro plano de aula!"
          }}
        </p>

        <button class="btn btn-outline gap-2" @click="goToCreate">
          <Plus class="w-4 h-4" />
          Criar Primeiro Plano
        </button>
      </section>
    </main>
  </div>
</template>
