import { createClient } from '@/lib/supabase/server'
import StatusFilters from '@/components/dashboard/status-filters'
import RealtimeApplicationsWrapper from '@/components/dashboard/realtime-applications-wrapper'
import AddApplicationFAB from '@/components/dashboard/add-application-fab'

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { status?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch applications and calculate stats
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  // Calculate stats
  const stats = {
    total: applications?.length || 0,
    active: applications?.filter(app => 
      ['applied', 'screening', 'interview', 'technical', 'final'].includes(app.status)
    ).length || 0,
    responseRate: applications && applications.length > 0
      ? Math.round((applications.filter(app => app.status !== 'applied').length / applications.length) * 100)
      : 0,
    avgTime: calculateAvgTime(applications || [])
  }

  return (
    <div className="p-6 space-y-6 pb-24 md:pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Track your job application journey</p>
      </div>
      
      {/* Filters */}
      <StatusFilters applications={applications || []} />
      
      {/* Applications Table with Realtime Updates */}
      <RealtimeApplicationsWrapper 
        initialApplications={applications || []} 
        statusFilter={searchParams.status}
      />
      
      {/* Floating Action Button */}
      <AddApplicationFAB />
    </div>
  )
}

function calculateAvgTime(applications: any[]): string {
  if (!applications.length) return '0 days'
  
  const responded = applications.filter(app => app.status !== 'applied')
  if (!responded.length) return '0 days'
  
  const totalDays = responded.reduce((sum, app) => {
    const applied = new Date(app.created_at)
    const updated = new Date(app.updated_at)
    const days = Math.floor((updated.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24))
    return sum + days
  }, 0)
  
  const avg = Math.round(totalDays / responded.length)
  return `${avg} days`
}