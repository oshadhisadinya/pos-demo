import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'cashier'
  const name = profile?.full_name || 'User'

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: '📊', roles: ['admin', 'manager', 'cashier'] },
    { name: 'POS Terminal', href: '/pos', icon: '🛒', roles: ['admin', 'manager', 'cashier'] },
    { name: 'Products', href: '/products', icon: '📦', roles: ['admin', 'manager'] },
    { name: 'Sales History', href: '/sales', icon: '📜', roles: ['admin', 'manager'] },
    { name: 'User Management', href: '/users', icon: '👥', roles: ['admin'] },
  ]

  const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="flex min-h-screen">
        
        {/* SIDEBAR - Added print:hidden */}
        <aside className="w-64 bg-gradient-to-b from-purple-900 to-pink-900 text-white flex flex-col shadow-2xl print:hidden">
          <div className="p-6 border-b border-purple-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Roy&Joy</h1>
                <p className="text-xs text-purple-200">Fabric Store</p>
              </div>
            </div>
            <div className="mt-4 px-3 py-2 bg-purple-800/50 rounded-lg">
              <p className="text-xs font-medium text-purple-200 capitalize">{role}</p>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navLinks.map((link) => (
              link.roles.includes(role) && (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 bg-gradient-to-r from-purple-800/50 to-pink-800/50 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:translate-x-1 text-sm font-medium group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          <div className="p-4 border-t border-purple-700">
            <div className="mb-4 px-3 py-2 bg-purple-800/30 rounded-lg">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-purple-300 truncate">{user.email}</p>
            </div>
            <form action={handleLogout}>
              <button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-lg">
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto print:w-full">
          {/* HEADER - Added print:hidden */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 px-8 py-6 shadow-sm print:hidden">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  Welcome back, {name.split(' ')[0]}!
                </h2>
                <p className="text-gray-500 text-sm mt-1">Manage your store operations</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 font-medium">Role: <span className="capitalize font-bold">{role}</span></p>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page Content - Added print:p-0 */}
          <div className="p-8 print:p-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}