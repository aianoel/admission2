import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Building2, UserCheck, Plus, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeacherAssignment {
  id: number;
  teacherId: number;
  teacherName: string;
  sectionId: number;
  sectionName: string;
  gradeLevel: number;
  subjectId: number;
  subjectName: string;
  isAdvisory: boolean;
  schoolYear: string;
  assignedAt: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Section {
  id: number;
  name: string;
  gradeLevel: number;
}

interface Subject {
  id: number;
  name: string;
  gradeLevel: number;
}

export function TeacherAssignments() {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [isAdvisory, setIsAdvisory] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch teachers
  const { data: teachers = [] } = useQuery<Teacher[]>({
    queryKey: ['/api/admin/users'],
    select: (users: any[]) => users.filter(user => user.role === 4).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }))
  });

  // Fetch sections
  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: ['/api/admin/sections']
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['/api/admin/subjects']
  });

  // Fetch teacher assignments
  const { data: assignments = [], isLoading } = useQuery<TeacherAssignment[]>({
    queryKey: ['/api/academic/my-assignments']
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (data: {
      teacherId: number;
      sectionId: number;
      subjectId: number;
      isAdvisory: boolean;
    }) => {
      const response = await fetch('/api/academic/assign-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create assignment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/academic/my-assignments'] });
      toast({
        title: "Success",
        description: "Teacher assignment created successfully!"
      });
      // Reset form
      setSelectedTeacher(null);
      setSelectedSection(null);
      setSelectedSubject(null);
      setIsAdvisory(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: number) => {
      const response = await fetch(`/api/academic/assignments/${assignmentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete assignment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/academic/my-assignments'] });
      toast({
        title: "Success",
        description: "Assignment removed successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove assignment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreateAssignment = () => {
    if (!selectedTeacher || !selectedSection || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select teacher, section, and subject.",
        variant: "destructive"
      });
      return;
    }

    createAssignmentMutation.mutate({
      teacherId: selectedTeacher,
      sectionId: selectedSection,
      subjectId: selectedSubject,
      isAdvisory
    });
  };

  const handleDeleteAssignment = (assignmentId: number) => {
    deleteAssignmentMutation.mutate(assignmentId);
  };

  // Group assignments by teacher
  const assignmentsByTeacher = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.teacherId]) {
      acc[assignment.teacherId] = {
        teacherName: assignment.teacherName,
        assignments: []
      };
    }
    acc[assignment.teacherId].assignments.push(assignment);
    return acc;
  }, {} as Record<number, { teacherName: string; assignments: TeacherAssignment[] }>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Teacher Assignment Management
          </CardTitle>
          <CardDescription>
            Assign teachers to sections and subjects. Elementary school assignment system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Assignment</TabsTrigger>
              <TabsTrigger value="manage">Manage Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Select Teacher</Label>
                  <Select 
                    value={selectedTeacher?.toString() || ""} 
                    onValueChange={(value) => setSelectedTeacher(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose teacher..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Section</Label>
                  <Select 
                    value={selectedSection?.toString() || ""} 
                    onValueChange={(value) => setSelectedSection(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose section..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id.toString()}>
                          {section.name} (Grade {section.gradeLevel})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Subject</Label>
                  <Select 
                    value={selectedSubject?.toString() || ""} 
                    onValueChange={(value) => setSelectedSubject(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Advisory Role</Label>
                  <Select 
                    value={isAdvisory ? "true" : "false"} 
                    onValueChange={(value) => setIsAdvisory(value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Regular Assignment</SelectItem>
                      <SelectItem value="true">Advisory Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCreateAssignment}
                disabled={createAssignmentMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createAssignmentMutation.isPending ? 'Creating...' : 'Create Assignment'}
              </Button>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">Loading assignments...</div>
              ) : Object.keys(assignmentsByTeacher).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No assignments found. Create your first assignment in the "Create Assignment" tab.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(assignmentsByTeacher).map(([teacherId, { teacherName, assignments }]) => (
                    <Card key={teacherId}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          {teacherName}
                        </CardTitle>
                        <CardDescription>
                          {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {assignments.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="font-medium">{assignment.sectionName} - {assignment.subjectName}</div>
                                  <div className="text-sm text-gray-600">Grade {assignment.gradeLevel}</div>
                                </div>
                                {assignment.isAdvisory && (
                                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                    <Star className="h-3 w-3 mr-1" />
                                    Advisory
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                disabled={deleteAssignmentMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}