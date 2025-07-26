'use client';
import React, { useState } from 'react';
import { InterviewCardProps, InterviewData, InterviewType, TimeSlot } from '@/types/interview';

const InterviewCard: React.FC<InterviewCardProps> = ({
  candidateEmail = "candidate@example.com",
  currentStage = "Technical Interview",
  onInterviewSelect,
  onInterviewEmailChange,
  onScheduleInterview
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterview, setSelectedInterview] = useState('');
  const [interviewEmail, setInterviewEmail] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
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
    { value: 'phone', label: 'Phone Interview', icon: '📞', color: 'bg-green-100 border-green-200 text-green-800' },
    { value: 'video', label: 'Video Interview', icon: '📹', color: 'bg-blue-100 border-blue-200 text-blue-800' },
    { value: 'in-person', label: 'In-Person Interview', icon: '🏢', color: 'bg-purple-100 border-purple-200 text-purple-800' },
    { value: 'technical', label: 'Technical Interview', icon: '💻', color: 'bg-orange-100 border-orange-200 text-orange-800' },
    { value: 'behavioral', label: 'Behavioral Interview', icon: '🗣️', color: 'bg-pink-100 border-pink-200 text-pink-800' },
    { value: 'final', label: 'Final Interview', icon: '🎯', color: 'bg-red-100 border-red-200 text-red-800' }
  ];

  // Generate time slots for the day (9 AM to 6 PM)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      const time12 = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
      if (hour === 12) slots.push({ value: time24, label: '12:00 PM' });
      else slots.push({ value: time24, label: time12 });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimezoneSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    setCurrentStep(2);
  };

  const handleInterviewSelect = (type: string) => {
    setSelectedInterview(type);
    onInterviewSelect?.(type);
    setCurrentStep(3);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInterviewEmail(value);
    onInterviewEmailChange?.(value);
    if (value && value.includes('@')) setCurrentStep(4);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDate(value);
    if (value) setCurrentStep(5);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(6);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  const isStepCompleted = (step: number) => currentStep > step;
  const isStepActive = (step: number) => currentStep === step;

  const getStageColor = (stage: string) => {
    const colors = {
      'Technical Interview': 'bg-blue-100 text-blue-800 border-blue-200',
      'Phone Interview': 'bg-green-100 text-green-800 border-green-200',
      'Video Interview': 'bg-purple-100 text-purple-800 border-purple-200',
      'Final Interview': 'bg-red-100 text-red-800 border-red-200',
      'Behavioral Interview': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stepTitles = [
    'Select Timezone',
    'Interview Type',
    'Interviewer Details',
    'Select Date',
    'Choose Time',
    'Meeting Details'
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl border p-8 max-w-6xl mx-auto">
      {/* Header with Current Stage */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Schedule Interview
          </h1>
          <p className="text-gray-600">
            Setting up interview for: <span className="font-semibold text-blue-600">{candidateEmail}</span>
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(currentStage)}`}>
          Current: {currentStage}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-10">
        {[1, 2, 3, 4, 5, 6].map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                isStepCompleted(step) ? 'bg-green-500 text-white' :
                isStepActive(step) ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {isStepCompleted(step) ? '✓' : step}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isStepActive(step) || isStepCompleted(step) ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {stepTitles[index]}
                </p>
              </div>
            </div>
            {index < 5 && (
              <div className={`flex-1 h-1 mx-4 ${
                isStepCompleted(step + 1) ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="col-span-8 space-y-8">
          {/* Step 1: Timezone Selection */}
          <div className={`${currentStep < 1 ? 'opacity-50' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              1. Select Your Timezone
            </h3>
            <div className="flex flex-wrap gap-3">
              {timezones.map((timezone) => (
                <button
                  key={timezone}
                  onClick={() => handleTimezoneSelect(timezone)}
                  disabled={currentStep < 1}
                  className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                    selectedTimezone === timezone
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {timezone}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Interview Type */}
          {currentStep >= 2 && (
            <div className={`${currentStep < 2 ? 'opacity-50' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                2. Select Interview Type
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {interviewTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleInterviewSelect(type.value)}
                    disabled={currentStep < 2}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedInterview === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <span className="font-medium text-gray-900">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Interviewer Email */}
          {currentStep >= 3 && (
            <div className={`${currentStep < 3 ? 'opacity-50' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                3. Interviewer Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Interviewer Email
                  </label>
                  <input
                    type="email"
                    value={interviewEmail}
                    onChange={handleEmailChange}
                    placeholder="interviewer@company.com"
                    disabled={currentStep < 3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/xyz"
                    disabled={currentStep < 3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Date Selection */}
          {currentStep >= 4 && (
            <div className={`${currentStep < 4 ? 'opacity-50' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                4. Select Interview Date
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    disabled={currentStep < 4}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Duration
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100">
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option defaultValue="1 hour">1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Time Slot Selection */}
          {currentStep >= 5 && selectedDate && (
            <div className={`${currentStep < 5 ? 'opacity-50' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                5. Choose Available Time Slot
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => handleTimeSelect(slot.value)}
                    disabled={currentStep < 5}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all ${
                      selectedTime === slot.value
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Description and Attachments */}
          {currentStep >= 6 && selectedTime && (
            <div className={`${currentStep < 6 ? 'opacity-50' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                6. Additional Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Interview Notes & Past Stage Information
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Share information about previous interview stages, candidate feedback, or any specific notes..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                      </p>
                    </label>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Summary */}
        <div className="col-span-4">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Candidate:</span>
                <span className="text-sm font-medium text-gray-900">{candidateEmail}</span>
              </div>

              {selectedTimezone && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Timezone:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedTimezone}</span>
                </div>
              )}

              {selectedInterview && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {interviewTypes.find(t => t.value === selectedInterview)?.label}
                  </span>
                </div>
              )}

              {interviewEmail && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interviewer:</span>
                  <span className="text-sm font-medium text-gray-900">{interviewEmail}</span>
                </div>
              )}

              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(selectedDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {selectedTime && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {timeSlots.find(slot => slot.value === selectedTime)?.label}
                  </span>
                </div>
              )}

              {meetingLink && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meeting:</span>
                  <span className="text-sm font-medium text-blue-600 truncate">Link Added</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {currentStep === 6 && (
                <button
                  onClick={handleSchedule}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Schedule Interview
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedInterview('');
                  setInterviewEmail('');
                  setSelectedDate('');
                  setSelectedTime('');
                  setSelectedTimezone('');
                  setMeetingLink('');
                  setDescription('');
                  setAttachments([]);
                }}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
