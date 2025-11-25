<script setup lang="ts">
/* ------------------------------------------
   Imports
------------------------------------------ */
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import localforage from "localforage";

import {
    ArrowLeft,
    Edit,
    Share2,
    Trash2,
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
import { POSITION, TYPE } from "vue-toastification";
import { useNotify } from "@/composables/UseNotify";
import { useConfirmDelete } from "@/composables/UseConfirmDelete";
import ConfirmDelete from "@/components/modals/ConfirmDelete.vue";

/* ------------------------------------------
   Setup
------------------------------------------ */
const route = useRoute();
const router = useRouter();

const confirm = useConfirmDelete();
const { notify } = useNotify();

const plan = ref<any | null>(null);
const loading = ref(true);

/* ------------------------------------------
   Lifecycle
------------------------------------------ */
onMounted(async () => {
    try {
        plan.value = await localforage.getItem(route.params.id.toString());
    } catch (error) {
        console.error("Erro ao carregar planos:", error);
    } finally {
        loading.value = false;
    }
});

/* ------------------------------------------
   Methods
------------------------------------------ */
const goBack = () => router.push("/");

const deletePlan = async () => {
    if (!plan.value) return;

    const confirmed = await confirm.open();
    if (!confirmed) return;

    try {
        await localforage.removeItem(route.params.id.toString());

        notify("Plano removido com sucesso!", {
            position: POSITION.TOP_CENTER,
            type: TYPE.SUCCESS,
        });

        router.push("/");
    } catch (error) {
        notify("Erro ao deletar plano.", {
            position: POSITION.TOP_CENTER,
            type: TYPE.ERROR,
        });
    }
};

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
    generateLessonPlanPDF(plan.value);
    notify("Download iniciado com sucesso!", {
        bodyClass: "rounded-md shadow-lg",
        position: POSITION.TOP_CENTER,
        type: TYPE.SUCCESS,
    });
};

const editPLan = () => {
    if (!plan.value) return;
    router.push(`/edit/${plan.value.id}`);
};
</script>

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

<template>
    <div class="min-h-screen bg-base-200">

        <!-- Modal de confirmação de exclusão -->
        <ConfirmDelete :open="confirm.isOpen.value" :item="plan" @close="confirm.close" />

        <!-- Header fixo -->
        <header class="w-full">
            <div class="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
                <button class="btn btn-soft gap-2" @click="goBack" type="button" aria-label="Voltar">
                    <ArrowLeft class="w-4 h-4" />
                    Voltar
                </button>

                <div class="text-right">
                    <h1 class="text-2xl font-bold">Plano de Aula</h1>
                    <p class="text-sm text-base-content/60">
                        Visualize os detalhes do seu plano de aula aqui.
                    </p>
                </div>
            </div>
        </header>

        <main class="container max-w-4xl mx-auto px-4 py-6">

            <!-- Carregando -->
            <div v-if="loading" class="text-center py-10 text-lg opacity-70">
                Carregando plano...
            </div>

            <!-- Não encontrado -->
            <div v-else-if="!plan" class="text-center py-10 opacity-70">
                <p class="mb-4 text-lg">Plano não encontrado.</p>
                <button class="btn btn-primary" @click="goBack">Voltar aos Planos</button>
            </div>

            <!-- Conteúdo -->
            <div v-else class="space-y-8 animate-fadeIn">

                <!-- Cabeçalho -->
                <section class="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <div class="badge badge-secondary p-3.5">{{ plan.subject }}</div>
                            <div class="badge badge-outline">{{ plan.grade }}</div>
                        </div>

                        <h2 class="text-5xl font-bold leading-tight">{{ plan.title }}</h2>

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

                        <button class="btn gap-2 bg-gradient-to-r from-primary to-secondary text-white"
                            @click="editPLan">
                            <Edit class="w-4 h-4" />
                            Editar
                        </button>
                    </nav>
                </section>

                <!-- Objetivos -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2 text-3xl">
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
                        <h3 class="card-title flex items-center gap-2 text-3xl">
                            <BookOpen class="w-5 h-5 text-secondary" />
                            Conteúdo da Aula
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.content }}</p>
                    </div>
                </section>

                <!-- Metodologia -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2 text-3xl">
                            <Lightbulb class="w-5 h-5 text-accent" />
                            Metodologia
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.methodology }}</p>
                    </div>
                </section>

                <!-- Recursos -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2 text-3xl">
                            <FileText class="w-5 h-5 text-primary" />
                            Recursos Necessários
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.resources }}</p>
                    </div>
                </section>

                <!-- Avaliação -->
                <section class="card bg-base-100 shadow-md">
                    <div class="card-body">
                        <h3 class="card-title flex items-center gap-2 text-3xl">
                            <Clipboard class="w-5 h-5 text-secondary" />
                            Avaliação
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.evaluation }}</p>
                    </div>
                </section>

                <!-- Tarefa de casa -->
                <section v-if="plan.homework" class="card bg-base-100 shadow-md text-3xl">
                    <div class="card-body flex flex-col gap-2">
                        <h3 class="card-title flex items-center gap-2 text-3xl">
                            <Home class="w-5 h-5 text-accent" />
                            Tarefa de Casa
                        </h3>
                        <p class="mt-3 leading-relaxed">{{ plan.homework }}</p>
                    </div>
                </section>

                <!-- Rodapé -->
                <footer class="flex flex-col sm:flex-row gap-4 pt-6">
                    <button class="btn btn-error gap-2" @click="deletePlan">
                        <Trash2 class="w-4 h-4" />
                        Deletar
                    </button>
                </footer>
            </div>
        </main>
    </div>
</template>
