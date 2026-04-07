import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkIsSuperAdmin(req) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return false
  return user.email === process.env.SUPER_ADMIN_EMAIL
}

export async function GET(req) {
  if (!(await checkIsSuperAdmin(req))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users })
}

export async function POST(req) {
  if (!(await checkIsSuperAdmin(req))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { email, password, name, action, userId } = await req.json()

    if (action === 'create') {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { full_name: name },
        email_confirm: true
      })
      if (error) throw error
      return NextResponse.json({ message: 'Admin baru berhasil dibuat' })
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error) throw error
      return NextResponse.json({ message: 'Admin berhasil dihapus' })
    }

    if (action === 'update-user') {
      const updateData = {}
      if (email) updateData.email = email
      if (password) updateData.password = password
      if (name) updateData.user_metadata = { full_name: name }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, updateData)
      if (error) throw error
      return NextResponse.json({ message: 'Data admin berhasil diperbarui' })
    }

    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
