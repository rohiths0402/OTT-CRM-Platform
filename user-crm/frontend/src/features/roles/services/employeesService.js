
import { api } from '../../../services/api/apiClient'

const ENDPOINT = '/admin/employees/'

export const employeesService = {
  list: async () => {
    return api.getAll(ENDPOINT)
  },

  create: async (employee) => {
    return api.post(ENDPOINT, employee)
  },

  update: async (id, employee) => {
    return api.patch(
      `${ENDPOINT}${encodeURIComponent(id)}/`,
      employee
    )
  },

  remove: async (id) => {
    return api.delete(
      `${ENDPOINT}${encodeURIComponent(id)}/`
    )
  },
}
