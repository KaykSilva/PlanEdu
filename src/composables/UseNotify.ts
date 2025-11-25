import { useToast, TYPE, POSITION } from "vue-toastification"

export function useNotify() {
    const toast = useToast()

    function notify(message: string, options: any = {}) {
        const {
            closeOnClick = true,
            draggable = true,
            toastClass = "",
            pauseOnHover = true,
            position = POSITION.TOP_RIGHT,
            timeout = 4000,
            type = TYPE.DEFAULT,
            ...rest
        } = options

        return toast(message, {
            closeOnClick,
            draggable,
            pauseOnHover,
            position,
            timeout,
            toastClassName: `${toastClass}`,
            type,
            ...rest,
        })
    }

    return { notify }
}
