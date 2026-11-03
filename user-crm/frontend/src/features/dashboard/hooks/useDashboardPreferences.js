import { useEffect, useState } from 'react'

const STORAGE_KEY = 'loop-super-admin-dashboard-preferences'

function createDefaultPreferences(sections) {
  return {
    order: sections.map(section => section.id),
    visible: Object.fromEntries(sections.map(section => [section.id, true])),
    collapsed: Object.fromEntries(sections.map(section => [section.id, false])),
  }
}

export function useDashboardPreferences(sections) {
  const [preferences, setPreferences] = useState(() => {
    const defaults = createDefaultPreferences(sections)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return defaults
      const parsed = JSON.parse(saved)
      const validIds = new Set(sections.map(section => section.id))
      const savedOrder = Array.isArray(parsed.order)
        ? parsed.order.filter(id => validIds.has(id))
        : []
      const missingIds = sections.map(section => section.id).filter(id => !savedOrder.includes(id))
      return {
        order: [...savedOrder, ...missingIds],
        visible: { ...defaults.visible, ...(parsed.visible || {}) },
        collapsed: { ...defaults.collapsed, ...(parsed.collapsed || {}) },
      }
    } catch {
      return defaults
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences])

  const toggleVisibility = id => {
    setPreferences(current => ({
      ...current,
      visible: { ...current.visible, [id]: !current.visible[id] },
    }))
  }

  const toggleCollapsed = id => {
    setPreferences(current => ({
      ...current,
      collapsed: { ...current.collapsed, [id]: !current.collapsed[id] },
    }))
  }

  const moveSection = (id, direction) => {
    setPreferences(current => {
      const index = current.order.indexOf(id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= current.order.length) return current
      const order = [...current.order]
      ;[order[index], order[target]] = [order[target], order[index]]
      return { ...current, order }
    })
  }

  const resetPreferences = () => setPreferences(createDefaultPreferences(sections))

  return { preferences, toggleVisibility, toggleCollapsed, moveSection, resetPreferences }
}
