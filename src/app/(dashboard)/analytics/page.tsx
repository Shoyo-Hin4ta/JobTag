import { createClient } from '@/lib/supabase/server'
import StatsCard from '@/components/dashboard/stats-card'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch applications for stats
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user?.id)

  // Calculate stats
  const stats = {
    total: applications?.length || 0,
    active: applications?.filter(app => 
      ['applied', 'screening', 'interview', 'technical', 'final'].includes(app.status)
    ).length || 0,
    responseRate: applications && applications.length > 0
      ? Math.round((applications.filter(app => app.status !== 'applied').length / applications.length) * 100)
      : 0,
    avgTime: calculateAvgTime(applications || []),
    offers: applications?.filter(app => app.status === 'offer').length || 0,
    rejected: applications?.filter(app => app.status === 'rejected').length || 0,
  }

  return (
    <div className="p-6 space-y-6 pb-24 md:pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Insights into your job search journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Applications" 
          value={stats.total} 
          icon="📊"
        />
        <StatsCard 
          title="Active Applications" 
          value={stats.active} 
          icon="🚀"
        />
        <StatsCard 
          title="Response Rate" 
          value={`${stats.responseRate}%`} 
          icon="📈"
        />
        <StatsCard 
          title="Avg. Response Time" 
          value={stats.avgTime} 
          icon="⏱️"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard 
          title="Offers Received" 
          value={stats.offers} 
          icon="🎉"
        />
        <StatsCard 
          title="Applications Rejected" 
          value={stats.rejected} 
          icon="❌"
        />
      </div>

      {/* Coming Soon */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-white mb-2">More Analytics Coming Soon</h3>
        <p className="text-gray-400">We're working on charts, trends, and deeper insights into your job search patterns.</p>
      </div>
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