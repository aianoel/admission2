import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { DashboardBackground } from '@/components/ui/dashboard-background';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Heart, Users, ClipboardList, UserCheck } from 'lucide-react';
import { GuidedTour, useTour, TOUR_CONFIGS } from '@/components/ui/guided-tour';

export const GuidanceDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Tour functionality
  const { isTourActive, completeTour, skipTour, restartTour } = useTour('guidance');

  const { data: students = [] } = useQuery({
    queryKey: ['/api/users', 'students'],
    queryFn: () => apiRequest('/api/users')
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['/api/enrollments'],
    queryFn: () => apiRequest('/api/enrollments')
  });

  if (!user || user.role !== 'guidance') {
    return <div className="text-center py-8">Access denied. Guidance role required.</div>;
  }

  const allStudents = students.filter((s: any) => s.role === 'student');
  const activeEnrollments = enrollments.filter((e: any) => e.status === 'approved');
  const pendingCounseling = Math.floor(allStudents.length * 0.1); // Simulated pending counseling sessions

  return (
    <DashboardBackground userRole="guidance" className="p-6">
      <div className="space-y-6">
        {/* Guided Tour */}
        <GuidedTour
          config={TOUR_CONFIGS.guidance}
          isActive={isTourActive}
          onComplete={completeTour}
          onSkip={skipTour}
        />
        {/* Welcome Header */}
        <EnhancedCard 
          variant="gradient" 
          className="bg-gradient-to-r from-teal-600 to-teal-700 text-white border-0"
          data-testid="welcome-header"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2" data-testid="welcome-message">
                Welcome back, {user.name}!
              </h2>
              <p className="opacity-90">Ready to guide and support our students today?</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={restartTour}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                📚 Take Tour
              </Button>
              <Heart className="h-16 w-16 opacity-20" />
            </div>
          </div>
        </EnhancedCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <EnhancedCard className="hover:shadow-lg transition-all duration-200" data-testid="students-stat">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allStudents.length}</div>
              <p className="text-xs text-muted-foreground">Under guidance</p>
            </CardContent>
          </EnhancedCard>

          <EnhancedCard className="hover:shadow-lg transition-all duration-200" data-testid="counseling-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <ClipboardList className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCounseling}</div>
              <p className="text-xs text-muted-foreground">Pending counseling</p>
            </CardContent>
          </EnhancedCard>

          <EnhancedCard className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEnrollments.length}</div>
              <p className="text-xs text-muted-foreground">Successfully enrolled</p>
            </CardContent>
          </EnhancedCard>

          <EnhancedCard className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wellness Programs</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Active programs</p>
            </CardContent>
          </EnhancedCard>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 bg-teal-600 hover:bg-teal-700 flex-col space-y-2" data-testid="counseling-schedule">
            <i className="fas fa-calendar text-xl"></i>
            <span>Schedule Sessions</span>
          </Button>
          <Button className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex-col space-y-2" data-testid="student-assessment">
            <i className="fas fa-clipboard text-xl"></i>
            <span>Student Assessment</span>
          </Button>
          <Button className="h-20 bg-green-600 hover:bg-green-700 text-white flex-col space-y-2" data-testid="wellness-programs">
            <i className="fas fa-heart text-xl"></i>
            <span>Wellness Programs</span>
          </Button>
          <Button className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex-col space-y-2" data-testid="guidance-reports">
            <i className="fas fa-chart-bar text-xl"></i>
            <span>Guidance Reports</span>
          </Button>
        </div>
      </div>
    </DashboardBackground>
  );
};