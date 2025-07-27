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
    <div>
        <InterviewCard
          candidateEmail="john.doe@example.com"
          currentStage="Technical Interview"
          onInterviewSelect={handleInterviewSelect}
          onInterviewEmailChange={handleInterviewEmailChange}
          onScheduleInterview={handleScheduleInterview}
        />
    </div>
  );
}
