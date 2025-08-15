import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Building2, Star, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TeacherDashboardData {
  sections: Array<{
    id: number;
    name: string;
    gradeLevel: number;
    isAdvisory: boolean;
  }>;
  subjects: Array<{
    id: number;
    name: string;
    gradeLevel: number;
  }>;
  students: Array<{
    id: number;
    name: string;
    email: string;
    sectionId: number;
  }>;
  advisory: Array<{
    id: number;
    name: string;
    gradeLevel: number;
  }>;
}

export function EnhancedTeacherDashboard() {
  const { user } = useAuth();

  // Fetch teacher dashboard data
  const { data: dashboardData, isLoading } = useQuery<TeacherDashboardData>({
    queryKey: [`/api/teacher-dashboard/${user?.id}`],
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your assignments...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No assignments found.</div>
        <div className="text-sm text-gray-400 mt-2">
          Contact your Academic Coordinator to get assigned to sections and subjects.
        </div>
      </div>
    );
  }

  const { sections, subjects, students, advisory } = dashboardData;

  // Group students by section
  const studentsBySection = students.reduce((acc, student) => {
    if (!acc[student.sectionId]) {
      acc[student.sectionId] = [];
    }
    acc[student.sectionId].push(student);
    return acc;
  }, {} as Record<number, typeof students>);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned Sections</p>
                <p className="text-2xl font-bold text-blue-700">{sections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned Subjects</p>
                <p className="text-2xl font-bold text-green-700">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-purple-700">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Advisory Section</p>
                <p className="text-lg font-bold text-yellow-700">
                  {advisory.length > 0 ? advisory[0].name : 'None'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advisory Section */}
      {advisory.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Star className="h-5 w-5" />
              Advisory Section
            </CardTitle>
            <CardDescription>
              You are the adviser for this section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                {advisory[0].name}
              </Badge>
              <span className="text-sm text-gray-600">Grade {advisory[0].gradeLevel}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Information */}
      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Sections</CardTitle>
              <CardDescription>
                Sections you are assigned to teach
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No sections assigned yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-sm text-gray-600">Grade {section.gradeLevel}</div>
                        </div>
                      </div>
                      {section.isAdvisory && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                          <Star className="h-3 w-3 mr-1" />
                          Advisory
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Subjects</CardTitle>
              <CardDescription>
                Subjects you are assigned to teach
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No subjects assigned yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-gray-600">Grade {subject.gradeLevel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {Object.keys(studentsBySection).length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  No students assigned yet.
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(studentsBySection).map(([sectionId, sectionStudents]) => {
              const section = sections.find(s => s.id === parseInt(sectionId));
              return (
                <Card key={sectionId}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      {section?.name || `Section ${sectionId}`}
                    </CardTitle>
                    <CardDescription>
                      {sectionStudents.length} student{sectionStudents.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {sectionStudents.map((student) => (
                        <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}