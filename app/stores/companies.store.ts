import { CompaniesRepository } from '~/repositories/companies.repository'
import { defineStore } from 'pinia'

export type Company = {
  id: string
  title: string
  description: string
  summary: string
}

export const useCompaniesStore = defineStore('companies', () => {
  const companies = ref<Company[]>([])
  const isLoading = ref(false)
  const hasFetched = ref(false)
  const isCreating = ref(false)
  const deletingIds = ref<string[]>([])

  const { $ofetch } = useNuxtApp()
  const repository = new CompaniesRepository($ofetch)

  const isDeleting = (id: string) => deletingIds.value.includes(id)

  const fetchCompanies = async () => {
    isLoading.value = true

    try {
      const response = await repository.getAll()

      if (response.status !== 'success') {
        return
      }

      companies.value = response.data.map((company) => ({
        id: String(company.id),
        title: company.name,
        description: company.description,
        summary: company.description,
      }))
    } finally {
      hasFetched.value = true
      isLoading.value = false
    }
  }

  const deleteCompany = async (id: string) => {
    if (isDeleting(id)) {
      return
    }

    deletingIds.value.push(id)

    try {
      const response = await repository.delete(id)

      if (response.status !== 'success') {
        return
      }

      companies.value = companies.value.filter((company) => company.id !== id)
    } finally {
      deletingIds.value = deletingIds.value.filter((deletingId) => deletingId !== id)
    }
  }

  const createCompany = async (payload: { title: string, description: string }) => {
    if (isCreating.value) {
      return
    }

    isCreating.value = true

    try {
      await repository.create({
        name: payload.title,
        description: payload.description,
      })

      await fetchCompanies()
    } finally {
      isCreating.value = false
    }
  }

  return {
    companies,
    isLoading,
    hasFetched,
    isCreating,
    isDeleting,
    fetchCompanies,
    deleteCompany,
    createCompany,
  }
})
