
<script setup lang="ts">
//@ts-nocheck
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowLeft, Save, FileText, Clock, Users } from "lucide-vue-next";
import storage from "@/services/storage";

const router = useRouter();
const route = useRoute();

const isEditing = ref(false);
const editingId = ref<string | null>(null);

const formData = reactive({
  title: "",
  subject: "",
  grade: "",
  duration: "",
  date: "",
  objectives: [""],
  content: "",
  methodology: "",
  resources: "",
  evaluation: "",
  homework: "",
});

// ------------------------------
// Carregar plano se for edição
// ------------------------------
onMounted(async () => {
  const id = route.params.id as string;

  if (!id) return;

  const existing = await storage.get(id);

  if (!existing) {
    router.push("/");
    return;
  }

  isEditing.value = true;
  editingId.value = id;


  Object.assign(formData, {
    title: existing.title,
    subject: existing.subject,
    grade: existing.grade,
    duration: existing.duration,
    date: existing.date,
    objectives: existing.objectives.length ? existing.objectives : [""],
    content: existing.content,
    methodology: existing.methodology,
    resources: existing.resources,
    evaluation: existing.evaluation,
    homework: existing.homework,
  });
});

// ------------------------------
// Objetivos
// ------------------------------
function addObjective() {
  formData.objectives.push("");
}

function removeObjective(index: number) {
  if (formData.objectives.length > 1) {
    formData.objectives.splice(index, 1);
  }
}

// ------------------------------
// Toast
// ------------------------------
type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "destructive";
};
const toasts = ref<Toast[]>([]);
let toastId = 1;

function toast(opts: { title: string; description?: string; variant?: "success" | "destructive" }) {
  const id = toastId++;
  toasts.value.push({ id, ...opts });
  setTimeout(() => dismissToast(id), 4000);
}

function dismissToast(id: number) {
  const idx = toasts.value.findIndex((t) => t.id === id);
  if (idx !== -1) toasts.value.splice(idx, 1);
}

// ------------------------------
// Navegação
// ------------------------------
function goBack() {
  if (window.history.length > 1) router.back();
  else router.push("/");
}

// ------------------------------
// Salvar (Create + Update)
// ------------------------------
async function handleSave() {
  if (!formData.title || !formData.subject || !formData.grade) {
    toast({
      title: "Campos obrigatórios",
      description: "Preencha título, disciplina e série.",
      variant: "destructive",
    });
    return;
  }

  const payload = JSON.parse(
    JSON.stringify({
      ...formData,
      id: editingId.value ?? Date.now().toString(),
      updated_at: new Date().toISOString(),
    })
  );

  try {
    await storage.save(payload.id, payload);

    toast({
      title: isEditing.value ? "Plano atualizado!" : "Plano criado!",
      description: isEditing.value
        ? "O plano foi atualizado no banco local."
        : "O plano foi salvo no banco local.",
      variant: "success",
    });

    router.push("/");
  } catch (error) {
    console.log(error);
    toast({
      title: "Erro ao salvar",
      description: "Não foi possível salvar o plano.",
      variant: "destructive",
    });
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="w-full">
      <div class="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
        <button class="btn btn-soft gap-2" @click="goBack" type="button" aria-label="Voltar">
          <ArrowLeft class="w-4 h-4" />
          Voltar
        </button>

        <div class="text-right">
          <h1 class="text-2xl font-bold">Novo Plano de Aula</h1>
          <p class="text-sm text-base-content/60">Crie um plano de aula detalhado e organizado</p>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 max-w-4xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card shadow">
            <div class="card-body space-y-4">
              <div class="flex items-center gap-2">
                <FileText class="w-5 h-5 text-primary" />
                <h3 class="card-title m-0 text-2xl">Informações Básicas</h3>
              </div>

              <div>
                <label class="label" for="title"
                  ><span class="label-text">Título do Plano *</span></label
                >
                <input
                  id="title"
                  required
                  class="input input-bordered w-full shadow"
                  placeholder="Ex: Introdução à Matemática..."
                  v-model="formData.title"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label" required for="subject"
                    ><span class="label-text">Disciplina *</span></label
                  >
                  <select
                    id="subject"
                    class="select select-bordered w-full shadow"
                    v-model="formData.subject"
                  >
                    <option value="" disabled selected>Selecione a disciplina</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Português">Português</option>
                    <option value="História">História</option>
                    <option value="Geografia">Geografia</option>
                    <option value="Ciências">Ciências</option>
                    <option value="Educação Física">Educação Física</option>
                    <option value="Artes">Artes</option>
                    <option value="Inglês">Inglês</option>
                  </select>
                </div>

                <div>
                  <label class="label" required for="grade"
                    ><span class="label-text">Série/Ano *</span></label
                  >
                  <select
                    id="grade"
                    class="select select-bordered w-full shadow"
                    v-model="formData.grade"
                  >
                    <option value="" disabled selected>Selecione a série</option>
                    <option value="1-ano">1º Ano</option>
                    <option value="2-ano">2º Ano</option>
                    <option value="3-ano">3º Ano</option>
                    <option value="4-ano">4º Ano</option>
                    <option value="5-ano">5º Ano</option>
                    <option value="6-ano">6º Ano</option>
                    <option value="7-ano">7º Ano</option>
                    <option value="8-ano">8º Ano</option>
                    <option value="9-ano">9º Ano</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="label" for="duration"
                    ><span class="label-text">Duração</span></label
                  >
                  <select
                    id="duration"
                    class="select select-bordered w-full shadow"
                    v-model="formData.duration"
                  >
                    <option value="" disabled selected>Duração da aula</option>
                    <option value="30min">30 minutos</option>
                    <option value="40min">40 minutos</option>
                    <option value="45min">45 minutos</option>
                    <option value="50min">50 minutos</option>
                    <option value="60min">60 minutos</option>
                    <option value="90min">90 minutos</option>
                  </select>
                </div>

                <div>
                  <label class="label" for="date"><span class="label-text">Data</span></label>
                  <input
                    id="date"
                    type="date"
                    class="input input-bordered w-full shadow"
                    v-model="formData.date"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow">
            <div class="card-body space-y-4">
              <div class="flex items-center gap-2">
                <Users class="w-5 h-5 text-secondary" />
                <h3 class="card-title m-0 text-2xl">Objetivos de Aprendizagem</h3>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(objective, index) in formData.objectives"
                  :key="index"
                  class="flex gap-2"
                >
                  <input
                    :placeholder="`Objetivo ${index + 1}`"
                    class="input input-bordered flex-1 shadow"
                    v-model="formData.objectives[index]"
                  />
                  <button
                    v-if="formData.objectives.length > 1"
                    type="button"
                    class="btn btn-outline btn-sm px-3"
                    @click="removeObjective(index)"
                    aria-label="Remover objetivo"
                  >
                    ×
                  </button>
                </div>

                <button type="button" class="btn btn-primary w-full" @click="addObjective">
                  Adicionar Objetivo
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="card shadow">
              <div class="card-body">
                <h3 class="card-title text-2xl">Conteúdo da Aula</h3>
                <textarea
                  class="textarea textarea-bordered w-full min-h-[120px] shadow mt-2"
                  placeholder="Descreva o conteúdo que será abordado na aula..."
                  v-model="formData.content"
                ></textarea>
              </div>
            </div>

            <div class="card shadow">
              <div class="card-body">
                <h3 class="card-title text-2xl">Metodologia</h3>
                <textarea
                  class="textarea textarea-bordered w-full min-h-[120px] shadow mt-2"
                  placeholder="Descreva as estratégias e métodos que serão utilizados..."
                  v-model="formData.methodology"
                ></textarea>
              </div>
            </div>

            <div class="card shadow">
              <div class="card-body">
                <h3 class="card-title text-2xl">Recursos Necessários</h3>
                <textarea
                  class="textarea textarea-bordered w-full min-h-[100px] shadow mt-2"
                  placeholder="Liste os materiais e recursos necessários para a aula..."
                  v-model="formData.resources"
                ></textarea>
              </div>
            </div>

            <div class="card shadow">
              <div class="card-body">
                <h3 class="card-title text-2xl">Avaliação</h3>
                <textarea
                  class="textarea textarea-bordered w-full min-h-[100px] shadow mt-2"
                  placeholder="Como será avaliada a aprendizagem dos alunos..."
                  v-model="formData.evaluation"
                ></textarea>
              </div>
            </div>

            <div class="card shadow">
              <div class="card-body">
                <h3 class="card-title text-2xl">Tarefa de Casa</h3>
                <textarea
                  class="textarea textarea-bordered w-full min-h-[80px] shadow mt-2"
                  placeholder="Atividades para casa (opcional)..."
                  v-model="formData.homework"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="card sticky top-24 shadow">
            <div class="card-body space-y-4">
              <div class="flex items-center gap-2">
                <Clock class="w-5 h-5 text-accent" />
                <h3 class="card-title m-0">Ações</h3>
              </div>

              <button
                class="btn w-full gap-2 bg-gradient-to-r from-primary to-secondary text-white"
                @click="handleSave"
              >
                <Save class="w-4 h-4" />
                Salvar Plano
              </button>

              <div class="text-sm text-base-content/60 space-y-2">
                <p class="font-medium">Dicas:</p>
                <ul class="list-disc ml-4 text-xs space-y-1">
                  <li>Use objetivos claros e mensuráveis</li>
                  <li>Descreva atividades práticas</li>
                  <li>Inclua diferentes tipos de avaliação</li>
                  <li>Considere recursos disponíveis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed right-4 top-6 z-50 flex flex-col gap-3">
        <div v-for="t in toasts" :key="t.id" class="max-w-sm">
          <div
            class="alert shadow-lg"
            :class="t.variant === 'destructive' ? 'alert-error' : 'alert-success'"
          >
            <div class="flex-1">
              <h4 class="font-bold">{{ t.title }}</h4>
              <div class="text-sm">{{ t.description }}</div>
            </div>
            <div class="flex-none">
              <button class="btn btn-square btn-ghost btn-sm" @click="dismissToast(t.id)">✕</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
