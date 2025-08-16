import React, { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector or data-testid
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'none';
  highlight?: boolean;
}

export interface TourConfig {
  tourId: string;
  title: string;
  description: string;
  steps: TourStep[];
}

interface GuidedTourProps {
  config: TourConfig;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function GuidedTour({ config, isActive, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);

  const currentStepData = config.steps[currentStep];
  const isLastStep = currentStep === config.steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (isActive && currentStepData) {
      const timer = setTimeout(() => {
        updateTargetPosition();
        setIsVisible(true);
      }, 500); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive, currentStep, currentStepData]);

  const updateTargetPosition = () => {
    if (!currentStepData?.target) return;

    const targetElement = document.querySelector(
      `[data-testid="${currentStepData.target}"], ${currentStepData.target}`
    ) as HTMLElement;

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });

      // Scroll target into view
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  const getTooltipPosition = (): React.CSSProperties => {
    const position = currentStepData?.position || 'bottom';
    const offset = 20;

    switch (position) {
      case 'top':
        return {
          top: targetPosition.top - offset,
          left: targetPosition.left + targetPosition.width / 2,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: targetPosition.top + targetPosition.height + offset,
          left: targetPosition.left + targetPosition.width / 2,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left - offset,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: targetPosition.top + targetPosition.height / 2,
          left: targetPosition.left + targetPosition.width + offset,
          transform: 'translate(0, -50%)',
        };
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        return {
          top: targetPosition.top + targetPosition.height + offset,
          left: targetPosition.left + targetPosition.width / 2,
          transform: 'translate(-50%, 0)',
        };
    }
  };

  if (!isActive || !isVisible || !currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={handleSkip} />
      
      {/* Highlight spotlight */}
      {currentStepData.highlight && targetPosition.width > 0 && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: targetPosition.top - 4,
            left: targetPosition.left - 4,
            width: targetPosition.width + 8,
            height: targetPosition.height + 8,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
          }}
        />
      )}

      {/* Tour tooltip */}
      <AnimatePresence>
        <motion.div
          ref={tourRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-[10000] max-w-sm"
          style={getTooltipPosition()}
        >
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {currentStep + 1} of {config.steps.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                {currentStepData.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="flex items-center gap-1"
                  >
                    {isLastStep ? 'Finish' : 'Next'}
                    {!isLastStep && <ArrowRight className="h-3 w-3" />}
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <SkipForward className="h-3 w-3" />
                  Skip Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Tour configurations for different user roles
export const TOUR_CONFIGS: Record<string, TourConfig> = {
  admin: {
    tourId: 'admin-dashboard-tour',
    title: 'Admin Dashboard Tour',
    description: 'Welcome! Let\'s explore the admin dashboard features.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Admin Dashboard',
        content: 'As an administrator, you have full control over the school management system. This tour will guide you through the key features.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'stats-overview',
        title: 'System Statistics',
        content: 'These cards show important system metrics like total users, enrollments, and pending approvals at a glance.',
        target: '[data-testid*="stat"]',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'user-management',
        title: 'User Management',
        content: 'Click here to manage all system users - create accounts, assign roles, and handle permissions.',
        target: 'nav-user-management',
        position: 'right',
        highlight: true,
      },
      {
        id: 'system-monitoring',
        title: 'System Health',
        content: 'Monitor server performance, database health, and system usage in real-time.',
        target: 'system-monitoring',
        position: 'top',
        highlight: true,
      }
    ],
  },
  
  student: {
    tourId: 'student-dashboard-tour',
    title: 'Student Dashboard Tour',
    description: 'Welcome! Let\'s explore your student portal.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Your Student Portal',
        content: 'This is your personal dashboard where you can track grades, submit assignments, and access learning materials.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'gpa-stat',
        title: 'Your Academic Performance',
        content: 'Here you can see your current GPA and overall academic standing with trend indicators.',
        target: 'gpa-stat',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        content: 'Use these buttons to quickly access your most-used features like viewing grades and submitting assignments.',
        target: 'quick-grade',
        position: 'top',
        highlight: true,
      },
      {
        id: 'assignments',
        title: 'Track Your Assignments',
        content: 'Keep track of upcoming assignments and their due dates to stay organized.',
        target: 'assignments-stat',
        position: 'bottom',
        highlight: true,
      }
    ],
  },
  
  teacher: {
    tourId: 'teacher-dashboard-tour',
    title: 'Teacher Dashboard Tour',
    description: 'Welcome! Let\'s explore your teaching tools.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Your Teaching Dashboard',
        content: 'This is your command center for managing classes, grading students, and sharing educational content.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'quick-grade',
        title: 'Grade Management',
        content: 'Click here to quickly input and manage student grades for all your classes.',
        target: 'quick-grade',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'upload-module',
        title: 'Share Learning Materials',
        content: 'Upload and organize learning modules, assignments, and educational resources for your students.',
        target: 'quick-module',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'class-management',
        title: 'Manage Your Classes',
        content: 'View your assigned classes, track student progress, and manage attendance.',
        target: 'teacher-classes',
        position: 'top',
        highlight: true,
      }
    ],
  },
  
  parent: {
    tourId: 'parent-dashboard-tour',
    title: 'Parent Dashboard Tour',
    description: 'Welcome! Monitor your child\'s academic progress.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Parent Portal',
        content: 'Stay connected with your child\'s education through real-time updates and communication tools.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'children-stat',
        title: 'Your Children',
        content: 'View information about all your children enrolled in the school system.',
        target: 'children-stat',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'communication',
        title: 'Stay Informed',
        content: 'Keep track of school announcements, events, and important updates.',
        target: 'announcements-stat',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'academic-monitoring',
        title: 'Monitor Academic Progress',
        content: 'Access your child\'s grades, attendance, and teacher feedback.',
        target: 'quick-grades',
        position: 'top',
        highlight: true,
      }
    ],
  },
  
  academic_coordinator: {
    tourId: 'academic-coordinator-tour',
    title: 'Academic Coordinator Dashboard Tour',
    description: 'Welcome! Manage curriculum and teacher assignments.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Academic Coordination',
        content: 'Oversee curriculum implementation, assign teachers, and ensure academic excellence across the institution.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'teacher-assignment',
        title: 'Teacher Assignment System',
        content: 'The core of your role - assign teachers to sections and subjects. Assignments appear immediately and are tracked in real-time.',
        target: 'button-assign-teacher',
        position: 'left',
        highlight: true,
      },
      {
        id: 'assignment-tracking',
        title: 'Assignment Visibility',
        content: 'All teacher assignments are displayed here with section advisers clearly marked. You can see the complete assignment history.',
        target: 'assignments-tab',
        position: 'top',
        highlight: true,
      },
      {
        id: 'curriculum-management',
        title: 'Curriculum Overview',
        content: 'Monitor curriculum progress across grade levels and track academic performance metrics.',
        target: 'curriculum-tab',
        position: 'top',
        highlight: true,
      }
    ],
  },
  
  registrar: {
    tourId: 'registrar-dashboard-tour',
    title: 'Registrar Dashboard Tour',
    description: 'Welcome! Manage student records and enrollments.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Student Records Management',
        content: 'Handle enrollment processes, maintain student records, and ensure accurate academic documentation.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'enrollment-processing',
        title: 'Enrollment Management',
        content: 'Process new student applications, verify documents, and approve or reject enrollments.',
        target: 'pending-enrollments',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'student-records',
        title: 'Student Records',
        content: 'Maintain comprehensive student records including transcripts, personal information, and academic history.',
        target: 'student-records',
        position: 'top',
        highlight: true,
      }
    ],
  },
  
  guidance: {
    tourId: 'guidance-dashboard-tour',
    title: 'Guidance Counselor Dashboard Tour',
    description: 'Welcome! Support student development and wellbeing.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Student Guidance',
        content: 'Provide counseling services, support student development, and ensure student wellbeing throughout their academic journey.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'student-support',
        title: 'Student Support Services',
        content: 'Track students under your guidance and manage active counseling cases.',
        target: 'students-stat',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'counseling-sessions',
        title: 'Counseling Management',
        content: 'Schedule and track individual and group counseling sessions.',
        target: 'counseling-sessions',
        position: 'top',
        highlight: true,
      }
    ],
  },
  
  accounting: {
    tourId: 'accounting-dashboard-tour',
    title: 'Accounting Dashboard Tour',
    description: 'Welcome! Manage school finances and payments.',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Financial Management',
        content: 'Handle tuition payments, track revenue, manage student accounts, and generate financial reports.',
        target: 'welcome-header',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'revenue-tracking',
        title: 'Revenue Overview',
        content: 'Monitor total revenue, payment status, and outstanding balances in real-time.',
        target: 'revenue-stat',
        position: 'bottom',
        highlight: true,
      },
      {
        id: 'payment-management',
        title: 'Payment Processing',
        content: 'Process tuition payments, handle refunds, and manage student account balances.',
        target: 'payment-processing',
        position: 'top',
        highlight: true,
      }
    ],
  },
};

// Hook to manage tour state
export function useTour(userRole: string) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour for their role
    const tourKey = `tour-completed-${userRole}`;
    const tourCompleted = localStorage.getItem(tourKey);
    
    if (!tourCompleted) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsTourActive(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setHasSeenTour(true);
    }
  }, [userRole]);

  const completeTour = () => {
    const tourKey = `tour-completed-${userRole}`;
    localStorage.setItem(tourKey, 'true');
    setIsTourActive(false);
    setHasSeenTour(true);
  };

  const skipTour = () => {
    completeTour(); // Same as completing for now
  };

  const restartTour = () => {
    setIsTourActive(true);
  };

  return {
    isTourActive,
    hasSeenTour,
    completeTour,
    skipTour,
    restartTour,
  };
}