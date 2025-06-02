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

  // Fetch applications
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

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