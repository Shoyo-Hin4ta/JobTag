import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="p-6 space-y-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
        {/* User Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.email?.split('@')[0]}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">User ID</p>
              <p className="text-white font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Provider</p>
              <p className="text-white">{user.app_metadata.provider || 'Email'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Created</p>
              <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="border-t border-white/10 pt-6">
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}