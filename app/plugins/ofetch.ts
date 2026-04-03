export default defineNuxtPlugin((nuxtApp) => {
    const { public: {baseUrl} } = useRuntimeConfig()

    const ofetch = $fetch.create({
        baseURL: baseUrl
    })

    return {
        'provide': {
            ofetch
        }
    }
})
