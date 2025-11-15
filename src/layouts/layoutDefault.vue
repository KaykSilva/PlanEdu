<template>
  <!-- Layout principal -->
  <div class="flex">
    <!-- Conteúdo Principal -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Navbar Superior -->
      <HomeHeader />

      <!-- Área de Conteúdo (Rotas) -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import HomeHeader from "@/components/header/homeHeader.vue";
import { RouterView } from "vue-router";
</script>

<style lang="scss" scoped></style>
