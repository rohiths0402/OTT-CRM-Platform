const DEMO_USERS = [
  {
    id: 1,
    name: 'Loop Super Admin',
    email: 'superadmin@loop.com',
    password: 'Super@123',
    role: 'super_admin',
  },
  {
    id: 2,
    name: 'Loop Admin',
    email: 'admin@loop.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 3,
    name: 'Loop Employee',
    email: 'employee@loop.com',
    password: 'Employee@123',
    role: 'employee',
  },
]

export async function mockLogin({ email, password }) {

  await new Promise((resolve) => setTimeout(resolve, 500))
  const user = DEMO_USERS.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password
  )

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const { password: ignoredPassword, ...safeUser } = user

  return {
    success: true,
    user: safeUser,
    access: 'demo-access-token',
    refresh: 'demo-refresh-token',
  }
}
