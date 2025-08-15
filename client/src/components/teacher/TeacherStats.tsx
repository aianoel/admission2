import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../ui/card';
import { StatCard } from '../ui/enhanced-card';
import { Users, BookOpen, ClipboardCheck, FileText } from 'lucide-react';

interface TeacherStatsData {
  totalSections: number;
  totalStudents: number;
  totalSubjects: number;
  totalGrades: number;
}

export const TeacherStats: React.FC = () => {
  const { data: assignments } = useQuery({
    queryKey: ['/api/teacher/assignments'],
  });

  const { data: allStudents } = useQuery({
    queryKey: ['/api/teacher/all-students'],
  });

  // Calculate stats from real data - show 0 if no assignments by Academic Coordinator
  const stats = React.useMemo(() => {
    if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
      return {
        totalSections: 0,
        totalStudents: 0,
        totalSubjects: 0,
        totalGrades: 0,
      };
    }

    const uniqueSections = new Set(assignments.map((a: any) => a.section_id));
    const uniqueSubjects = new Set(assignments.map((a: any) => a.subject_id));
    
    return {
      totalSections: uniqueSections.size,
      totalStudents: Array.isArray(allStudents) ? allStudents.length : 0,
      totalSubjects: uniqueSubjects.size,
      totalGrades: 0, // This would need another API call to count grades
    };
  }, [assignments, allStudents]);

  // Check if teacher has no assignments (clear dashboard state)
  const hasNoAssignments = !assignments || !Array.isArray(assignments) || assignments.length === 0;

  // Show message if no assignments from Academic Coordinator
  if (hasNoAssignments) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Assignments Yet</h3>
          <p className="text-sm text-gray-500">
            Your Academic Coordinator hasn't assigned any sections, subjects, or students to you yet.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Contact your Academic Coordinator to get assigned to classes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Teaching Sections"
        value={stats.totalSections}
        description="Active sections"
        icon={BookOpen}
        iconColor="text-blue-600"
        trend={{ value: 0, label: "sections", isPositive: true }}
        data-testid="stat-sections"
      />
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        description="Across all sections"
        icon={Users}
        iconColor="text-green-600"
        trend={{ value: 0, label: "students", isPositive: true }}
        data-testid="stat-students"
      />
      <StatCard
        title="Teaching Subjects"
        value={stats.totalSubjects}
        description="Different subjects"
        icon={FileText}
        iconColor="text-purple-600"
        trend={{ value: 0, label: "subjects", isPositive: true }}
        data-testid="stat-subjects"
      />
      <StatCard
        title="Grades Encoded"
        value={stats.totalGrades}
        description="This quarter"
        icon={ClipboardCheck}
        iconColor="text-orange-600"
        trend={{ value: 0, label: "grades", isPositive: true }}
        data-testid="stat-grades"
      />
    </div>
  );
};