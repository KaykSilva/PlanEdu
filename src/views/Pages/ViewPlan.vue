<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import localforage from "localforage";

import {
    ArrowLeft,
    Edit,
    Share2,
    Download,
    Clock,
    FileText,
    BookOpen,
    Target,
    Lightbulb,
    Clipboard,
    Home,
} from "lucide-vue-next";
import { generateLessonPlanPDF } from "@/utils/PDFGenerate";

const route = useRoute();
const router = useRouter();

const plan = ref<any | null>(null);
const loading = ref(true);

onMounted(async () => {
    const id = route.params.id;

    try {
        plan.value = await localforage.getItem(route.params.id.toString());
    } catch (error) {
        console.error("Erro ao carregar planos:", error);
    } finally {
        loading.value = false;
    }
});

const deletePlan = async () => {
    if (!plan.value) return;

    const confirmDelete = confirm(
        "Tem certeza que deseja excluir este plano? Essa ação é irreversível."
    );

    if (!confirmDelete) return;

    try {
        await localforage.removeItem(route.params.id.toString());
        alert("Plano removido com sucesso!");
        router.push("/");
    } catch (error) {
        console.error("Erro ao remover plano:", error);
        alert("Erro ao deletar plano.");
    }
};

const goBack = () => router.push("/");

const sharePlan = async () => {
    if (!plan.value) return;

    if (navigator.share) {
        navigator.share({
            title: plan.value.title,
            text: `Plano de aula: ${plan.value.title}`,
            url: window.location.href,
        });
    } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copiado para a área de transferência!");
    }
};

const downloadPlan = () => {
    alert("Download PDF em desenvolvimento...");
    generateLessonPlanPDF(plan.value);
};
</script>

<template>
    <div class="min-h-screen bg-base-200">
        <!-- Header fixo -->
        <header class="w-full bg-base-100 shadow-md p-4 sticky top-0 z-50 flex items-center gap-3">
            <button class="btn btn-ghost btn-sm gap-2" @click="goBack">
                <ArrowLeft class="w-4 h-4" />
                Voltar
            </button>

            <h1 class="text-lg font-semibold">Plano de Aula</h1>
        </header>

        <main class="container max-w-4xl mx-auto px-4 py-6">
            <!-- Carregando -->
            <div v-if="loading" class="text-center py-10 text-lg opacity-70">
                Carregando plano...
            </div>

            <!-- Não encontrado -->
            <div v-else-if="!plan" class="text-center py-10 opacity-70">
                <p class="mb-4 text-lg">Plano não encontrado.</p>

                <button class="btn btn-primary" @click="goBack">
                    Voltar aos Planos
                </button>
            </div>

            <!-- Conteúdo -->
            <div v-else class="space-y-8 animate-fadeIn">
                <!-- Cabeçalho -->
                <section class="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div>
                        <div class="flex gap-2 mb-2">
                            <div class="badge badge-secondary">{{ plan.subject }}</div>
                            <div class="badge badge-outline">{{ plan.grade }}</div>
                        </div>

                        <h2 class="text-2xl font-bold leading-tight">{{ plan.title }}</h2>

                        <div class="flex gap-4 mt-2 text-sm opacity-70">
                            <span class="flex items-center gap-1">
                                <Clock class="w-4 h-4" />
                                {{ plan.duration }}
                            </span>
                            <span>{{ plan.date }}</span>
                        </div>
                    </div>

                    <nav class="flex gap-2">
                        <button class="btn btn-outline gap-2" @click="sharePlan">
                            <Share2 class="w-4 h-4" />
                            Compartilhar
                        </button>

                        <button class="btn btn-outline gap-2" @click="downloadPlan">
                            <Download class="w-4 h-4" />
                            PDF
                        </button>

                        <button class="btn btn-error gap-2" @click="deletePlan">
                            🗑️
                            Deletar
                        </button>

                    </nav>
                </section>

                <!-- Objetivos -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2">
                            <Target class="w-5 h-5 text-primary" />
                            Objetivos de Aprendizagem
                        </h3>

                        <ul class="space-y-3 mt-4">
                            <li v-for="(obj, i) in plan.objectives" :key="i" class="flex gap-3 items-start">
                                <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="text-primary font-semibold text-sm">{{ i + 1 }}</span>
                                </div>
                                <span>{{ obj }}</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <!-- Conteúdo -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2">
                            <BookOpen class="w-5 h-5 text-secondary" />
                            Conteúdo da Aula
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.content }}</p>
                    </div>
                </section>

                <!-- Metodologia -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2">
                            <Lightbulb class="w-5 h-5 text-accent" />
                            Metodologia
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.methodology }}</p>
                    </div>
                </section>

                <!-- Recursos -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2">
                            <FileText class="w-5 h-5 text-primary" />
                            Recursos Necessários
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.resources }}</p>
                    </div>
                </section>

                <!-- Avaliação -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2">
                            <Clipboard class="w-5 h-5 text-secondary" />
                            Avaliação
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.evaluation }}</p>
                    </div>
                </section>

                <!-- Tarefa de casa -->
                <section v-if="plan.homework" class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2">
                            <Home class="w-5 h-5 text-accent" />
                            Tarefa de Casa
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.homework }}</p>
                    </div>
                </section>

                <!-- Rodapé -->
                <footer class="flex flex-col sm:flex-row gap-4 pt-6 border-t mt-8">
                    <button class="btn btn-outline flex-1 gap-2" @click="goBack">
                        <ArrowLeft class="w-4 h-4" />
                        Voltar aos Planos
                    </button>
                </footer>
            </div>
        </main>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease both;
}
</style>
