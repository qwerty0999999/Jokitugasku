import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables (URL or Service Role Key) are missing.')
  }

  return createClient(url, key)
}

async function checkIsSuperAdmin(req) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.warn('Auth check failed: No Authorization header')
      return false
    }
    const token = authHeader.replace('Bearer ', '')
    
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      console.warn('Auth check failed: Invalid token or user not found', error?.message)
      return false
    }

    const adminEmail = process.env.SUPER_ADMIN_EMAIL || process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL
    const isSuperAdminEmail = user.email.toLowerCase() === adminEmail?.toLowerCase()
    const hasAdminRole = user.app_metadata?.role === 'admin'

    // Log auth attempt tanpa mengekspos email (gunakan user ID saja)
    console.log(`Auth attempt uid:${user.id} | isSuper: ${isSuperAdminEmail} | hasRole: ${hasAdminRole}`)

    return isSuperAdminEmail || hasAdminRole
  } catch (err) {
    console.error('Auth check critical error:', err.message)
    return false
  }
}

export async function GET(req) {
  try {
    if (!(await checkIsSuperAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ users })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    if (!(await checkIsSuperAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, password, name, action, userId } = await req.json()
    const supabaseAdmin = getSupabaseAdmin()

    if (action === 'create') {
      const { error } = await supabaseAdmin.auth.admin.createUser({
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
