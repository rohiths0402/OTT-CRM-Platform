
import { api, unwrapList } from '../../../services/api/apiClient'

const ENDPOINT = '/admin/roles/'

const normalize = (role) => ({
  id: role.id,
  code: role.code,
  name: role.name,
  members: role.members ?? 0,
  description: role.description || '',
  permissions:
    role.code === 'super_admin'
      ? 'All permissions'
      : role.code === 'admin'
        ? 'CRM administration'
        : role.code === 'analyst'
          ? 'Read analytics'
          : 'Support access',
  status: role.is_active ? 'Active' : 'Inactive',
  is_active: Boolean(role.is_active),
})

export const rolesService = {
  list: async () => {
    const [rolesResponse, assignmentsResponse] = await Promise.all([
      api.getAll(ENDPOINT),
      api.get('/admin/employee-roles/'),
    ])

    const roles = unwrapList(rolesResponse)

    const assignments = Array.isArray(assignmentsResponse)
      ? assignmentsResponse
      : assignmentsResponse?.results ||
        assignmentsResponse?.data?.results ||
        []

    const members = {}

    assignments.forEach((employee) => {
      ;(employee.roles || []).forEach((role) => {
        members[role.id] = (members[role.id] || 0) + 1
      })
    })

    return roles.map((role) =>
      normalize({
        ...role,
        members: members[role.id] || 0,
      })
    )
  },

  create: async (data) => {
    const code = String(data.code || data.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')

    const response = await api.post(ENDPOINT, {
      code,
      name: data.name,
      description: data.description || '',
      is_active: data.is_active ?? true,
    })

    return normalize(response?.data ?? response)
  },

  update: async (id, data) => {
    const response = await api.patch(
      `${ENDPOINT}${encodeURIComponent(id)}/`,
      {
        name: data.name,
        description: data.description,
        is_active: data.is_active,
      }
    )

    return normalize(response?.data ?? response)
  },

  toggleStatus: async (id, isActive) => {
    const response = await api.patch(
      `${ENDPOINT}${encodeURIComponent(id)}/`,
      { is_active: isActive }
    )

    return normalize(response?.data ?? response)
  },

  remove: async (id) => {
    return api.delete(`${ENDPOINT}${encodeURIComponent(id)}/`)
  },
}
