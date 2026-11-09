import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Server Action to update a user's role
async function updateRole(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const userId = formData.get('userId') as string
  const newRole = formData.get('role') as string

  await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  // Refresh the page to show new data
  revalidatePath('/users')
}

export default async function UsersPage() {
  const supabase = await createClient()

  // Fetch all user profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error loading users: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
          User Management
        </h2>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium border border-purple-200">
          Only Admins can manage users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50/50 border-b border-purple-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">User Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">User ID (Auth)</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">Current Role</th>
              <th className="px-6 py-4 text-sm font-semibold text-purple-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {profiles && profiles.length > 0 ? (
              profiles.map((profile: any) => (
                <tr key={profile.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {profile.full_name || 'Unnamed User'}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500 truncate max-w-[200px]">
                    {profile.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      profile.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      profile.role === 'manager' ? 'bg-pink-100 text-pink-800 border-pink-200' :
                      'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {/* Form to change role */}
                    <form action={updateRole} className="flex gap-2">
                      <input type="hidden" name="userId" value={profile.id} />
                      <select 
                        name="role" 
                        defaultValue={profile.role}
                        className="px-3 py-1.5 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="cashier">Cashier</option>
                      </select>
                      <button 
                        type="submit" 
                        className="px-4 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm font-medium"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <strong>Note:</strong> When you change a user's role, they must <strong>Sign Out and Sign In</strong> again for the new permissions to take effect in the sidebar.
      </div>
    </div>
  )
}