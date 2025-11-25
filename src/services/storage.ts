import localforage from 'localforage'

localforage.config({
    name: 'teaching-plan-app',
    storeName: 'plans_storage',
    description: 'Armazena planos de ensino no navegador'
})

export default {
    async save(key: string, data: any) {
        return await localforage.setItem(key, data)
    },

    async get(key: string) {
        return await localforage.getItem(key)
    },

    async all() {
        const items: {
            key: string, value: any
        }[] = []
        await localforage.iterate((value, key) => {
            items.push({ key, value })
        })
        return items
    },

    async remove(key: string) {
        return await localforage.removeItem(key)
    }
}
