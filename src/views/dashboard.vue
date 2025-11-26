<script setup>
import { ref, computed, onMounted } from "vue";
import { Search, Plus, BookOpen, FileUp } from "lucide-vue-next";
import { useRouter } from "vue-router";

import LessonPlanCard from "@/components/cards/lessonPlanCard.vue";
import plansStorage from "@/services/storage";

const plans = ref([]);
const subjects = ref(["Todas"]);
const searchTerm = ref("");
const selectedSubject = ref("Todas");
const isLoading = ref(false);
const importProgress = ref("");

const router = useRouter();

// Atualizar lista de disciplinas
function updateSubjects() {
  const dynamicSubjects = new Set(["Todas"]);
  plans.value.forEach((p) => {
    if (p.subject && p.subject.trim() !== '') {
      dynamicSubjects.add(p.subject);
    }
  });
  subjects.value = Array.from(dynamicSubjects);
}

// Recarregar planos do storage
const loadPlans = async () => {
  try {
    const stored = await plansStorage.all();

    plans.value = stored
      .map((item) => ({
        id: item.key,
        ...item.value,
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Ordenar por data de criação

    updateSubjects();
    console.log('Planos carregados:', plans.value.length);
  } catch (error) {
    console.error('Erro ao carregar planos:', error);
  }
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
      plan.title?.toLowerCase().includes(cleanedSearch.value) ||
      plan.subject?.toLowerCase().includes(cleanedSearch.value) ||
      plan.content?.toLowerCase().includes(cleanedSearch.value);

    const matchesSubject =
      selectedSubject.value === "Todas" || plan.subject === selectedSubject.value;

    return matchesSearch && matchesSubject;
  })
);

const today = new Date().toISOString().split("T")[0];

const todaysPlans = computed(() => filteredPlans.value.filter((plan) => plan.date === today));

const otherPlans = computed(() => filteredPlans.value.filter((plan) => plan.date !== today));

const hasActiveFilters = computed(
  () => cleanedSearch.value !== "" || selectedSubject.value !== "Todas"
);

// Contadores para estatísticas
const totalPlans = computed(() => plans.value.length);
const todayPlansCount = computed(() => todaysPlans.value.length);
const importedPlansCount = computed(() => plans.value.filter(plan =>
  plan.created_at && plan.title?.includes('Importado')
).length);
</script>

<template>
  <div class="min-h-screen bg-base-200 overflow-hidden">
    <main class="container h-full overflow-auto max-w-[80%] mx-auto px-4 py-6" role="main">
      <!-- Header -->
      <header class="w-full mb-10" role="banner">
        <div class="flex items-center justify-between">
          <section class="flex items-center gap-4" aria-labelledby="page-title">
            <img src="/logo.png" alt="Logo" class="w-12 h-12 object-contain" />

            <div>
              <h1 id="page-title" class="text-3xl font-bold leading-none">Seus Planos de Aula</h1>
              <p id="page-description" class="text-sm opacity-70 mt-1">
                Organize e gerencie todos os seus planos de ensino em um só lugar
              </p>
            </div>
          </section>

          <nav aria-label="Ações da página">
            <button class="btn gap-2 bg-gradient-to-r from-primary to-secondary text-white" @click="goToCreate">
              <Plus class="w-5 h-5" />
              Criar Novo
            </button>
          </nav>
        </div>
      </header>

      <!-- Busca + Filtros -->
      <section class="w-full flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Ferramentas de busca e filtros">
        <!-- Barra de busca -->
        <div class="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-[250px] max-w-[400px]">
          <div class="relative w-full">
            <Search class="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/70" />
            <input v-model="searchTerm" type="search" placeholder="Pesquisar planos..."
              class="input w-full pl-12 py-3 rounded-xl bg-base-100 shadow-md border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              aria-label="Pesquisar planos de aula" />
          </div>
        </div>

        <!-- Filtros -->
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

      <!-- Planos de hoje -->
      <section v-if="todaysPlans.length" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold">Planos de hoje</h3>
          <span class="text-sm text-base-content/60">{{ todaysPlans.length }} plano(s)</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="(plan, idx) in todaysPlans" :key="plan.id" :style="{ animationDelay: `${idx * 100}ms` }"
            class="animate-fadeIn">
            <LessonPlanCard :plan="plan" />
          </article>
        </div>
      </section>

      <!-- Demais planos -->
      <section v-if="otherPlans.length" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-bold">Outros planos</h3>
          <span class="text-sm text-base-content/60">{{ otherPlans.length }} plano(s)</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="(plan, idx) in otherPlans" :key="plan.id" :style="{ animationDelay: `${idx * 100}ms` }"
            class="animate-fadeIn">
            <LessonPlanCard :plan="plan" />
          </article>
        </div>
      </section>

      <!-- Caso não haja planos -->
      <section v-if="filteredPlans.length === 0" class="text-center py-12" aria-label="Nenhum plano encontrado">
        <BookOpen class="w-16 h-16 mx-auto mb-4 opacity-60" />
        <h3 class="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
        <p class="opacity-70 mb-4">
          {{
            hasActiveFilters
              ? "Tente ajustar sua pesquisa ou filtros."
              : "Comece criando seu primeiro plano de aula!"
          }}
        </p>
        <div class="flex gap-3 justify-center">
          <button class="btn btn-outline gap-2" @click="triggerFileInput" :disabled="isLoading">
            <FileUp class="w-4 h-4" />
            Importar PDF
          </button>
          <button class="btn btn-outline gap-2" @click="goToCreate">
            <Plus class="w-4 h-4" />
            Criar Primeiro Plano
          </button>
        </div>

        <!-- Dicas de importação -->
        <div class="mt-8 p-4 bg-base-100 rounded-lg border border-base-300 max-w-md mx-auto">
          <h4 class="font-semibold mb-2">💡 Dica para importação</h4>
          <p class="text-sm opacity-70">
            Para melhor extração, certifique-se que seu PDF contenha seções como:
            <strong>Título, Disciplina, Objetivos, Conteúdo, Metodologia</strong>.
          </p>
          <p class="text-xs opacity-50 mt-2">
            Formatos suportados: PDF até 10MB
          </p>
        </div>
      </section>
    </main>
  </div>
</template>
