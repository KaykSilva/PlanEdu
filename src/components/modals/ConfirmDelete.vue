<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
} from "@headlessui/vue"

// Props
const props = defineProps<{
    open: boolean
    item: any | null
}>()

const emit = defineEmits(["close"])
function close(confirmed: boolean) {
    emit("close", confirmed)
}
</script>

<template>
    <!-- Modal wrapper -->
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-50" @close="close(false)">

            <!-- Backdrop escurecido -->
            <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </TransitionChild>

            <!-- Modal -->
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100" leave="ease-in duration-150" leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95">
                    <DialogPanel class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl text-gray-900">

                        <!-- Título -->
                        <DialogTitle class="text-lg font-semibold">
                            Confirmar exclusão
                        </DialogTitle>

                        <!-- Mensagem -->
                        <p class="mt-2 text-sm text-gray-700">
                            Tem certeza que deseja deletar o plano:
                            <strong>{{ item?.title }}</strong>?
                            Esta ação não poderá ser desfeita.
                        </p>

                        <!-- Botões -->
                        <div class="mt-6 flex justify-end gap-2">
                            <!-- Cancelar -->
                            <button @click="close(false)"
                                class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900">
                                Cancelar
                            </button>

                            <!-- Deletar -->
                            <button @click="close(true)"
                                class="px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-50">
                                Deletar
                            </button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
