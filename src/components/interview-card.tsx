'use client';
import React, { useState } from 'react';
import { InterviewCardProps, InterviewData, InterviewType, TimeSlot } from '@/types/interview';

const InterviewCard: React.FC<InterviewCardProps> = ({
  candidateEmail = "candidate@example.com",
  onInterviewSelect,
  onInterviewEmailChange,
  onScheduleInterview
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterview, setSelectedInterview] = useState('');
  const [interviewEmail, setInterviewEmail] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC+5:30 (IST)');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const timezones = [
    'UTC-8 (PST)',
    'UTC-7 (MST)',
    'UTC-6 (CST)',
    'UTC-5 (EST)',
    'UTC+0 (GMT)',
    'UTC+1 (CET)',
    'UTC+5:30 (IST)',
    'UTC+8 (CST)',
    'UTC+9 (JST)'
  ];

  const interviewTypes: InterviewType[] = [
    { value: 'phone', label: 'Phone Interview', icon: '📞', color: 'from-emerald-500 to-teal-600' },
    { value: 'video', label: 'Video Interview', icon: '📹', color: 'from-blue-500 to-indigo-600' },
    { value: 'technical', label: 'Technical Interview', icon: '💻', color: 'from-purple-500 to-violet-600' },
    { value: 'final', label: 'Final Interview', icon: '🎯', color: 'from-rose-500 to-pink-600' }
  ];

  const generateTimeSlots = (): TimeSlot[] => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const startTime = hour;
      const endTime = hour + 1;

      const formatHour = (h: number) => {
        if (h === 12) return '12 PM';
        if (h > 12) return `${h - 12} PM`;
        return `${h} AM`;
      };

      const value = `${hour.toString().padStart(2, '0')}:00`;
      const label = `${formatHour(startTime)} - ${formatHour(endTime)}`;

      slots.push({ value, label });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimezoneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timezone = e.target.value;
    setSelectedTimezone(timezone);
  };

  const handleInterviewSelect = (type: string) => {
    setSelectedInterview(type);
    onInterviewSelect?.(type);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInterviewEmail(value);
    onInterviewEmailChange?.(value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDate(value);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNextStep = () => {
    if (canProceedToNext()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedInterview !== '';
      case 2:
        return interviewEmail !== '' && selectedDate !== '' && selectedTime !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSchedule = () => {
    const interviewData: InterviewData = {
      type: selectedInterview,
      email: interviewEmail,
      date: selectedDate,
      time: selectedTime,
      timezone: selectedTimezone,
      meetingLink,
      description,
      attachments
    };
    onScheduleInterview?.(interviewData);
  };

  const stepTitles = [
    'Interview Type',
    'Schedule Details',
    'Review & Confirm'
  ];

  const isStepCompleted = (step: number) => currentStep > step;
  const isStepActive = (step: number) => currentStep === step;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="mb-12 flex items-start justify-between">
              <div className="text-left">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  Select Interview Type
                </h2>
                <p className="text-gray-600 text-xl">Choose the type of interview you&apos;d like to schedule</p>
              </div>
              {currentStep < 3 && (
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                  className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {interviewTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInterviewSelect(type.value)}
                  className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1 ${
                    selectedInterview === type.value
                      ? 'border-transparent bg-gradient-to-br from-white to-blue-50 shadow-2xl shadow-blue-500/20'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-xl hover:shadow-blue-500/10'
                  }`}
                >
                  {selectedInterview === type.value && (
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${type.color} opacity-10 blur-sm`}></div>
                  )}
                  <div className="relative z-10 flex items-center space-x-6">
                    <div className={`relative text-4xl transition-all duration-500 ${
                      selectedInterview === type.value ? 'scale-125 rotate-12' : 'group-hover:scale-110 group-hover:rotate-6'
                    }`}>
                      {type.icon}
                      {selectedInterview === type.value && (
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-gray-900 text-xl mb-2">{type.label}</div>
                      <div className={`h-1 w-0 transition-all duration-700 rounded-full ${
                        selectedInterview === type.value
                          ? `w-full bg-gradient-to-r ${type.color}`
                          : 'group-hover:w-3/4 bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`} />
                    </div>
                  </div>
                  {selectedInterview === type.value && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-12 flex items-start justify-between">
              <div className="text-left">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  Schedule Details
                </h2>
                <p className="text-gray-600 text-xl">Set up the interview timing and logistics</p>
              </div>
              {currentStep < 3 && (
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                  className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Interviewer Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={interviewEmail}
                      onChange={handleEmailChange}
                      placeholder="interviewer@company.com"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Meeting Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/xyz"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Duration
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 appearance-none text-gray-900" defaultValue="1 hour">
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>1 hour</option>
                      <option>1.5 hours</option>
                      <option>2 hours</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      onClick={() => handleTimeSelect(slot.value)}
                      className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedTime === slot.value
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20'
                          : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          selectedTime === slot.value
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : 'bg-gray-300 group-hover:bg-blue-400'
                        }`} />
                        <span className={`font-semibold text-sm transition-all duration-300 ${
                          selectedTime === slot.value
                            ? 'text-blue-700'
                            : 'text-gray-700 group-hover:text-blue-600'
                        }`}>
                          {slot.label}
                        </span>
                      </div>
                      {selectedTime === slot.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="mb-12 flex items-start justify-between">
              <div className="text-left">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  Review & Confirm
                </h2>
                <p className="text-gray-600 text-xl mt-2">Verify all details before scheduling your interview</p>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Ready to schedule</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="group px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-300 hover:text-blue-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                <button
                  onClick={handleSchedule}
                  className="group px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Schedule Interview</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Interview Summary Card */}
              <div className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50 border-2 border-white/60 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                        Interview Summary
                      </h4>
                      <p className="text-gray-600 mt-1">All your interview details at a glance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Candidate Info */}
                    <div className="group bg-gradient-to-br from-white to-emerald-50/50 p-6 rounded-2xl border-2 border-emerald-100/60 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Candidate</span>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-1"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{candidateEmail}</span>
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          ✓ Confirmed
                        </div>
                      </div>
                    </div>

                    {/* Interview Type */}
                    {selectedInterview && (
                      <div className="group bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl border-2 border-blue-100/60 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <span className="text-lg">
                              {interviewTypes.find(t => t.value === selectedInterview)?.icon}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Interview Type</span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {interviewTypes.find(t => t.value === selectedInterview)?.label}
                          </span>
                          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Selected
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interviewer */}
                    {interviewEmail && (
                      <div className="group bg-gradient-to-br from-white to-orange-50/50 p-6 rounded-2xl border-2 border-orange-100/60 hover:border-orange-200 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Interviewer</span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mt-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900 break-all">{interviewEmail}</span>
                          <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            Assigned
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date & Time Combined */}
                    {selectedDate && selectedTime && (
                      <div className="group bg-gradient-to-br from-white to-purple-50/50 p-6 rounded-2xl border-2 border-purple-100/60 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Date & Time</span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mt-1"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">
                              {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-md font-semibold text-purple-700">
                              {timeSlots.find(slot => slot.value === selectedTime)?.label}
                            </span>
                            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              Scheduled
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timezone */}
                    <div className="group bg-gradient-to-br from-white to-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100/60 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Timezone</span>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-1"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{selectedTimezone}</span>
                        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          Set
                        </div>
                      </div>
                    </div>

                    {/* Meeting Link */}
                    {meetingLink && (
                      <div className="group bg-gradient-to-br from-white to-green-50/50 p-6 rounded-2xl border-2 border-green-100/60 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Meeting Link</span>
                            <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mt-1"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{meetingLink}</span>
                          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            ✓ Added
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 border-2 border-white/60 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Additional Notes</h4>
                    <p className="text-gray-600 text-sm">Optional details for the interview</p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Any special instructions, agenda items, or notes for the interview..."
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {description.length}/500
                  </div>
                </div>
              </div>

              {/* Final Check Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/60 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-green-800 mb-2">Ready to Schedule!</h5>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Please review all the details above. Once you click &ldquo;Schedule Interview&rdquo;,
                      both the candidate and interviewer will receive confirmation emails with the meeting details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 p-8 max-w-7xl mx-auto">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Schedule Interview
              </h1>
              <p className="text-gray-300 text-lg">
                Setting up interview for{' '}
                <span className="font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                  {candidateEmail}
                </span>
              </p>
            </div>
            <div className="flex items-end gap-4">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedInterview('');
                  setInterviewEmail('');
                  setSelectedDate('');
                  setSelectedTime('');
                  setSelectedTimezone('UTC+5:30 (IST)');
                  setMeetingLink('');
                  setDescription('');
                  setAttachments([]);
                }}
                className="group px-6 py-2 border-2 border-white/30 text-white rounded-xl hover:border-white/60 hover:bg-white/10 transition-all duration-300 font-semibold flex items-center space-x-3 shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Timezone
                </label>
                <select
                  value={selectedTimezone}
                  onChange={handleTimezoneSelect}
                  className="px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-[160px] bg-gray-800 text-white"
                >
                  {timezones.map((timezone) => (
                    <option key={timezone} value={timezone} className="bg-gray-800">
                      {timezone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Steps - Vertical Layout */}
        <div className="flex mb-16 justify-center">
          <div className="bg-white/50 rounded-2xl py-6 border border-white/60 w-64 h-fit sticky top-8">
            <div className="flex flex-col space-y-24 mt-16">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="relative flex items-center">
                  <div className="flex items-center space-x-4 w-full">
                    <div className={`relative flex items-center justify-center w-14 h-14 rounded-full font-bold text-sm transition-all duration-500 transform ${
                      isStepCompleted(step) ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-110 shadow-lg shadow-green-500/30' :
                      isStepActive(step) ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-110 shadow-lg shadow-blue-500/30' :
                      'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}>
                      {isStepCompleted(step) ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step}
                      {(isStepActive(step) || isStepCompleted(step)) && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-30 animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-base transition-all duration-500 ${
                        isStepActive(step) || isStepCompleted(step) ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {stepTitles[index]}
                      </p>
                      <p className={`text-sm transition-all duration-500 ${
                        isStepActive(step) ? 'text-blue-600' :
                        isStepCompleted(step) ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {isStepCompleted(step) ? 'Completed' :
                         isStepActive(step) ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="absolute left-7 top-16 w-0.5 h-32 bg-gray-200 transition-all duration-700">
                      <div className={`w-full transition-all duration-700 ${
                        isStepCompleted(step + 1) ? 'h-full bg-gradient-to-b from-green-500 to-emerald-600' :
                        isStepActive(step + 1) ? 'h-full bg-gradient-to-b from-blue-500 to-indigo-600' :
                        isStepActive(step) ? 'h-2/3 bg-gradient-to-b from-blue-500 to-indigo-600' : 'h-0'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-4xl">
            {/* Main Content */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm rounded-3xl p-10 border border-white/60 shadow-xl min-h-[650px]">
              {renderCurrentStep()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
