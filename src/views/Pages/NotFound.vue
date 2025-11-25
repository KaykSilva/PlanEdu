<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import { watch } from "vue";

const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    console.error("404 Error: Usuário tentou acessar rota inexistente:", newPath);
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 px-6">
    <!-- Card central -->
    <div
      class="p-10 rounded-2xl max-w-lg w-full text-center border-gray-200 animate-fade-in"
    >
      <h1 class="text-6xl font-extrabold text-gray-800 drop-shadow-sm mb-4 tracking-tight">
        404
      </h1>

      <p class="text-lg text-gray-600 mb-6">
        O caminho que você tentou acessar não existe.
      </p>

      <img
        src="/owl.gif"
        alt="404 Owl"
        class="mx-auto mb-6 w-48 h-48 rounded-full shadow-inner"
      />

      <RouterLink
        to="/"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
      >
        Voltar para a Home
      </RouterLink>
    </div>

    <!-- Texto extra -->
    <p class="mt-6 text-gray-500 text-sm opacity-80">
      Caso você ache que isso deveria existir, revise a URL ou entre em contato.
    </p>
  </div>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
