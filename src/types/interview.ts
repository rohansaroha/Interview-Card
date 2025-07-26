export interface InterviewCardProps {
  candidateEmail?: string;
  currentStage?: string;
  onInterviewSelect?: (interview: string) => void;
  onInterviewEmailChange?: (email: string) => void;
  onScheduleInterview?: (data: InterviewData) => void;
}

export interface InterviewData {
  type: string;
  email: string;
  date: string;
  time: string;
  timezone: string;
  meetingLink: string;
  description: string;
  attachments: File[];
}

export interface InterviewType {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export interface TimeSlot {
  value: string;
  label: string;
}
