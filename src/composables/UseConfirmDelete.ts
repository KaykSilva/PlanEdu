import { ref } from "vue"
import DeleteConfirmModal from "@/components/modals/ConfirmDelete.vue"

export function useConfirmDelete() {
    const isOpen = ref(false)
    const resolver = ref<(v: boolean) => void>()

    function open(): Promise<boolean> {
        isOpen.value = true

        return new Promise(resolve => {
            resolver.value = resolve
        })
    }

    function close(result: boolean) {
        isOpen.value = false
        resolver.value?.(result)
    }

    return {
        isOpen,
        open,
        close,
        DeleteConfirmModal,
    }
}
