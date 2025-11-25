<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <main class="flex-1 overflow-y-auto" role="main">
      <RouterView />
    </main>
  </div>
</template>
