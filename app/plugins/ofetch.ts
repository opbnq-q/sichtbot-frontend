import { toast } from "vue-sonner"

export default defineNuxtPlugin((nuxtApp) => {
    const { public: {baseUrl} } = useRuntimeConfig()

    const ofetch = $fetch.create({
        baseURL: baseUrl,
        onRequestError({ request, options, error }) {
            toast.error("Ошибка", {
                description: error
            })
        },
        onResponseError({ request, response, options }) {
            toast.error("Ошибка", {
                description: response.statusText
            })
            if (response.status == 401) nuxtApp.runWithContext(() => navigateTo('/auth'));
        }
    })

    return {
        'provide': {
            ofetch
        }
    }
})
