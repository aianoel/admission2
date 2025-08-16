import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  onLoginClick?: () => void;
  onEnrollmentClick?: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ onLoginClick, onEnrollmentClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m EduBot, your virtual assistant. I can help you with information about our school, enrollment process, features, and more. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on keywords
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Enrollment related
    if (message.includes('enroll') || message.includes('admission') || message.includes('apply')) {
      return 'Our enrollment process is simple! Just click the "Start Enrollment" button on our website. You\'ll need to: 1) Fill out the online application form, 2) Upload required documents, 3) Process enrollment fees, 4) Wait for application review. The whole process typically takes 3-5 business days.';
    }
    
    // Login related
    if (message.includes('login') || message.includes('access') || message.includes('portal')) {
      return 'To access your portal, click the "Login" button at the top of the page. Each role (student, teacher, parent, admin) has their own dedicated portal with specific features. If you forgot your password, use the "Forgot Password" link on the login page.';
    }
    
    // Tuition/fees
    if (message.includes('tuition') || message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('payment')) {
      return 'Our tuition fees vary by grade level and program. We offer flexible payment plans and accept various payment methods including online payments through our student portal. For detailed fee information, please contact our accounting office at accounting@edumanage.school or call +1 (555) 123-4567.';
    }
    
    // Contact information
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('address')) {
      return 'You can reach us at:\n📞 Phone: +1 (555) 123-4567\n✉️ Email: info@edumanage.school\n📍 Address: 123 Education Street, Learning City, LC 12345\n\nOur office hours are Monday-Friday, 8:00 AM - 5:00 PM.';
    }
    
    // Features
    if (message.includes('features') || message.includes('what can') || message.includes('capabilities')) {
      return 'EduManage offers: Multi-role portals for students, teachers, parents & staff • Advanced enrollment system • Real-time grades & assignments • Integrated chat & meetings • Document sharing & learning modules • Automated payment processing • Comprehensive reporting tools.';
    }
    
    // Schedule/classes
    if (message.includes('schedule') || message.includes('class') || message.includes('time')) {
      return 'Class schedules are managed through our system and can be viewed in your respective portal. Students and parents can view schedules in real-time, while teachers can manage their class schedules and room assignments. The system supports Monday through Saturday scheduling.';
    }
    
    // Grades
    if (message.includes('grade') || message.includes('report') || message.includes('progress')) {
      return 'Grades and progress reports are available in real-time through our student and parent portals. Teachers can input grades immediately, and parents receive automatic notifications about their child\'s academic progress. Report cards are generated automatically each quarter.';
    }
    
    // Staff/teachers
    if (message.includes('teacher') || message.includes('staff') || message.includes('faculty')) {
      return 'Our dedicated faculty and staff are committed to providing quality education. Teachers can manage their classes, assignments, and communicate with students and parents through our integrated platform. We have experienced staff in academic affairs and administration.';
    }
    
    // Technology/support
    if (message.includes('tech') || message.includes('support') || message.includes('help') || message.includes('problem')) {
      return 'Our IT support team is available to help with any technical issues. For immediate assistance, contact our support team through your portal\'s help section or email support@edumanage.school. We provide training and support for all platform features.';
    }
    
    // Hours/when
    if (message.includes('hour') || message.includes('when') || message.includes('time') || message.includes('open')) {
      return 'School office hours: Monday-Friday, 8:00 AM - 5:00 PM. Academic year typically runs from August to June. The online portal is available 24/7 for your convenience. For specific department hours, please check your portal or contact the main office.';
    }
    
    // General greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! Welcome to EduManage. I\'m here to help you with any questions about our school management system, enrollment, or services. What would you like to know?';
    }
    
    // Thank you
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! I\'m happy to help. Is there anything else you\'d like to know about EduManage?';
    }
    
    // Default response
    return 'I understand you\'re asking about "' + userMessage + '". I can help you with information about enrollment, login access, school features, contact details, schedules, grades, tuition fees, and technical support. Could you please rephrase your question or ask about one of these topics?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: 'How to enroll?', action: () => setInputValue('How to enroll?') },
    { text: 'Contact information', action: () => setInputValue('Contact information') },
    { text: 'Portal access', action: () => setInputValue('How to login to portal?') },
    { text: 'Tuition fees', action: () => setInputValue('What are the tuition fees?') }
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
          data-testid="chat-toggle-button"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-40 shadow-2xl">
          <Card className="h-full flex flex-col">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                EduBot - Virtual Assistant
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="text-xs h-8"
                      >
                        {action.text}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                    data-testid="chat-input"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    data-testid="chat-send-button"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};