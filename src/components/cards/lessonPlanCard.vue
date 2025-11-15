<template>
  <div
    class="card bg-base-100 shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
    @click="goToPlan"
  >
    <!-- Header -->
    <div class="card-body pb-3">
      <div class="flex justify-between items-start mb-2">
        <div class="badge badge-secondary text-xs font-medium">
          {{ plan.subject }}
        </div>

        <div class="badge badge-outline text-xs">
          {{ plan.grade }}
        </div>
      </div>

      <h3
        class="text-lg font-semibold line-clamp-2 transition-colors group-hover:text-primary"
      >
        {{ plan.title }}
      </h3>

      <div class="flex items-center gap-4 text-sm opacity-70 mt-3">
        <div class="flex items-center gap-1">
          <Calendar class="w-4 h-4" />
          <span>{{ plan.date }}</span>
        </div>

        <div class="flex items-center gap-1">
          <Clock class="w-4 h-4" />
          <span>{{ plan.duration }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 pb-4 pt-0">
      <p class="text-sm opacity-70 mb-2">Objetivos:</p>

      <ul class="text-sm space-y-1">
        <li
          v-for="(objective, idx) in plan.objectives.slice(0, 2)"
          :key="idx"
          class="flex items-start gap-2"
        >
          <FileText class="w-3 h-3 mt-1 text-primary flex-shrink-0" />
          <span class="line-clamp-1">{{ objective }}</span>
        </li>

        <li
          v-if="plan.objectives.length > 2"
          class="text-xs opacity-70 pl-5"
        >
          +{{ plan.objectives.length - 2 }} objetivos...
        </li>
      </ul>

      <div class="flex gap-2 pt-3 mt-4 border-t border-base-300">
        <button
          class="btn btn-ghost btn-sm flex-1 gap-2 text-xs"
          @click.stop="handleShare"
        >
          <Share2 class="w-4 h-4" />
          Compartilhar
        </button>

        <button
          class="btn btn-ghost btn-sm flex-1 gap-2 text-xs"
          @click.stop="handleDownload"
        >
          <Download class="w-4 h-4" />
          PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Calendar, Clock, FileText, Share2, Download } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { inject } from "vue";

// Props
const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
});

// Router
const router = useRouter();

// Toast (injeção padrão — adaptar para o teu sistema)
const toast = inject("toast");

// Navegar para página do plano
const goToPlan = () => {
  router.push(`/plano/${props.plan.id}`);
};

// Compartilhar
const handleShare = () => {
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: props.plan.title,
      text: `Plano de aula: ${props.plan.title} - ${props.plan.subject}`,
      url,
    });
  } else {
    navigator.clipboard.writeText(url);
    toast?.({
      title: "Link copiado!",
      description: "O link do plano foi copiado para a área de transferência.",
    });
  }
};

// Download
const handleDownload = () => {
  toast?.({
    title: "Download iniciado",
    description: "O PDF do seu plano de aula está sendo preparado...",
  });
};
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
