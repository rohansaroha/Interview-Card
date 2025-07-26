# Interview Card Component

A comprehensive interview scheduling component built with Next.js, TypeScript, and Tailwind CSS. This project features a multi-step form interface for scheduling interviews with timezone selection, interview type configuration, and file attachments.

## Features

- 🎯 **Multi-step Interview Scheduling**: 6-step guided process for complete interview setup
- 🌍 **Timezone Support**: Multiple timezone options for global team coordination
- 📝 **Interview Types**: Phone, Video, In-person, Technical, Behavioral, and Final interviews
- 📧 **Email Integration**: Interviewer email configuration and meeting link setup
- 📅 **Date & Time Selection**: Interactive calendar and time slot picker
- 📎 **File Attachments**: Upload and manage interview-related documents
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean interface with Tailwind CSS styling

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd interview-card
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the Interview Card component in action.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with Interview Card demo
│   └── globals.css         # Global styles
├── components/
│   └── interview-card.tsx  # Main Interview Card component
└── types/
    └── interview.ts        # TypeScript interfaces
```

## Component Usage

```tsx
import InterviewCard from '@/components/interview-card';
import { InterviewData } from '@/types/interview';

function MyPage() {
  const handleScheduleInterview = (data: InterviewData) => {
    console.log('Interview scheduled:', data);
    // Handle the interview data
  };

  return (
    <InterviewCard
      candidateEmail="candidate@example.com"
      currentStage="Technical Interview"
      onScheduleInterview={handleScheduleInterview}
    />
  );
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

The Interview Card component is highly customizable:

- **Interview Types**: Modify the `interviewTypes` array to add/remove interview types
- **Timezones**: Update the `timezones` array for different timezone options
- **Time Slots**: Adjust the `generateTimeSlots` function for custom time ranges
- **Styling**: Customize Tailwind CSS classes for different themes

## TypeScript Interfaces

The project includes comprehensive TypeScript interfaces:

- `InterviewCardProps` - Component props interface
- `InterviewData` - Complete interview data structure
- `InterviewType` - Interview type configuration
- `TimeSlot` - Time slot structure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
