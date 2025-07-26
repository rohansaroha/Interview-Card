'use client';
import InterviewCard from '@/components/interview-card';
import { InterviewData } from '@/types/interview';

export default function Home() {
  const handleInterviewSelect = (interview: string) => {
    console.log('Interview type selected:', interview);
  };

  const handleInterviewEmailChange = (email: string) => {
    console.log('Interviewer email changed:', email);
  };

  const handleScheduleInterview = (data: InterviewData) => {
    console.log('Interview scheduled:', data);
    alert('Interview scheduled successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interview Card Component
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive interview scheduling component built with Next.js, TypeScript, and Tailwind CSS. 
            Features a multi-step form with timezone selection, interview type configuration, and file attachments.
          </p>
        </div>
        
        <InterviewCard
          candidateEmail="john.doe@example.com"
          currentStage="Technical Interview"
          onInterviewSelect={handleInterviewSelect}
          onInterviewEmailChange={handleInterviewEmailChange}
          onScheduleInterview={handleScheduleInterview}
        />
      </div>
    </div>
  );
}
