<template>
    <div class="min-h-screen flex items-center justify-center bg-white p-6">
        <div class="card w-full max-w-lg bg-white shadow-xl p-8 border-l-4 transition-all" :class="{
            'border-green-500': isValid,
            'border-red-500': !isValid && checked
        }">

            <!-- Ícone -->
            <div class="text-center mb-6">
                <CheckCircle v-if="isValid" class="w-16 h-16 text-green-500 mx-auto" />
                <XCircle v-else-if="checked" class="w-16 h-16 text-red-500 mx-auto" />
                <Loader2 v-else class="w-14 h-14 text-gray-400 mx-auto animate-spin" />
            </div>

            <!-- Título -->
            <h1 class="text-2xl font-bold text-center mb-6 text-gray-800">
                <span v-if="isValid">Documento Autêntico</span>
                <span v-else-if="checked">Documento Não Encontrado</span>
                <span v-else>Verificando...</span>
            </h1>

            <!-- Informações do Documento -->
            <div v-if="documentData" class="bg-base-200 p-5 rounded-lg mb-6">
                <h3 class="font-semibold text-lg mb-3 border-b pb-1 border-indigo-400">
                    Informações do Documento
                </h3>

                <p class="mb-1"><strong>Título:</strong> {{ documentData.title }}</p>
                <p class="mb-1"><strong>Disciplina:</strong> {{ documentData.subject }}</p>
                <p class="mb-1"><strong>Série/Ano:</strong> {{ documentData.grade }}</p>
                <p class="mb-1"><strong>Data:</strong> {{ formatDate(documentData.date) }}</p>
                <p class="mb-1"><strong>ID:</strong> {{ documentId }}</p>
            </div>

            <!-- Detalhes -->
            <div v-if="checked">
                <div class="alert" :class="isValid ? 'alert-success' : 'alert-error'">
                    <div>
                        <span v-if="isValid">
                            Este documento foi verificado e confirmado como autêntico no sistema PlanEdu.
                        </span>
                        <span v-else>
                            O documento com ID {{ documentId }} não foi encontrado. Pode ser inválido ou ter sido
                            removido.
                        </span>
                    </div>
                </div>
            </div>

            <!-- Botão -->
            <div class="mt-6 text-center">
                <button @click="goBack" class="btn btn-primary px-8 rounded-full">
                    Voltar
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import { CheckCircle, XCircle, Loader2 } from "lucide-vue-next";

export default {
    name: "VerifyDocument",

    components: { CheckCircle, XCircle, Loader2 },

    data() {
        return {
            documentId: null,
            isValid: false,
            checked: false,
            documentData: null,
        };
    },

    async mounted() {
        const path = window.location.pathname;
        const match = path.match(/\/verify\/(.+)/);

        if (match && match[1]) {
            this.documentId = match[1];

            setTimeout(() => {
                this.verifyDocument();
            }, 900);
        } else {
            this.checked = true;
        }
    },

    methods: {
        async verifyDocument() {
            try {
                const storedDocuments = JSON.parse(
                    localStorage.getItem("planEdu_documents") || "[]"
                );

                this.documentData = storedDocuments.find(
                    (doc) => doc.id === this.documentId
                );

                this.isValid = !!this.documentData;
                this.checked = true;
            } catch (err) {
                console.error("Erro ao verificar documento:", err);
                this.checked = true;
            }
        },

        formatDate(dateString) {
            return dateString
                ? new Date(dateString).toLocaleDateString("pt-BR")
                : "-";
        },

        goBack() {
            window.history.back();
        },
    },
};
</script>

<style scoped>
.card {
    animation: fadeIn 0.35s ease-out;
}

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
</style>
