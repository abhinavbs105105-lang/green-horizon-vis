import { Calendar, Bell, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const events = [
  {
    id: 1,
    title: 'Annual Sports Day',
    date: '2024-02-15',
    time: '8:00 AM - 4:00 PM',
    type: 'event',
    description: 'Join us for our annual sports day featuring various athletic competitions and cultural performances.',
  },
  {
    id: 2,
    title: 'Parent-Teacher Meeting',
    date: '2024-02-20',
    time: '10:00 AM - 2:00 PM',
    type: 'notice',
    description: 'Quarterly PTM to discuss student progress and academic performance.',
  },
  {
    id: 3,
    title: 'Science Exhibition',
    date: '2024-03-05',
    time: '9:00 AM - 5:00 PM',
    type: 'event',
    description: 'Students showcase their innovative science projects and experiments.',
  },
  {
    id: 4,
    title: 'Holi Celebration',
    date: '2024-03-25',
    type: 'holiday',
    description: 'School will remain closed for Holi festival celebrations.',
  },
  {
    id: 5,
    title: 'Mid-Term Examination',
    date: '2024-04-01',
    time: '8:30 AM onwards',
    type: 'exam',
    description: 'Mid-term examinations for all classes. Detailed schedule available in downloads section.',
  },
  {
    id: 6,
    title: 'Summer Vacation',
    date: '2024-05-15',
    type: 'holiday',
    description: 'Summer vacation begins. School reopens on July 1st, 2024.',
  },
];

const notices = [
  {
    id: 1,
    title: 'Fee Payment Reminder',
    date: '2024-01-28',
    content: 'Parents are requested to clear all pending fees by January 31st to avoid late fee charges.',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Uniform Guidelines Update',
    date: '2024-01-25',
    content: 'New winter uniform guidelines are now in effect. Please ensure compliance.',
    priority: 'normal',
  },
  {
    id: 3,
    title: 'Bus Route Changes',
    date: '2024-01-22',
    content: 'Some bus routes have been modified. Please check the updated schedule.',
    priority: 'normal',
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'event':
      return 'bg-primary/10 text-primary';
    case 'notice':
      return 'bg-accent/20 text-accent-foreground';
    case 'holiday':
      return 'bg-emerald-light text-foreground';
    case 'exam':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export default function EventsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Events & Notices
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              Stay updated with the latest school events, announcements, and important notices.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Events Calendar */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Upcoming Events
                </h2>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="font-body text-sm">
                              {new Date(event.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-body text-sm">{event.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getTypeColor(event.type)} border-0`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="font-body text-muted-foreground text-sm">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notices Sidebar */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Important Notices
                </h2>
              </div>

              <div className="space-y-4">
                {notices.map((notice) => (
                  <div 
                    key={notice.id}
                    className={`bg-card rounded-xl p-5 shadow-soft border-l-4 ${
                      notice.priority === 'high' ? 'border-destructive' : 'border-primary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-display font-semibold text-foreground mb-1">
                          {notice.title}
                        </h3>
                        <p className="font-body text-xs text-muted-foreground mb-2">
                          {new Date(notice.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="font-body text-sm text-muted-foreground">
                          {notice.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exam Schedule */}
              <div className="mt-8 bg-primary/5 rounded-xl p-6">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Examination Schedule
                </h3>
                <ul className="space-y-2 font-body text-sm text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Unit Test I</span>
                    <span className="font-medium text-foreground">July</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mid-Term Exam</span>
                    <span className="font-medium text-foreground">September</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Unit Test II</span>
                    <span className="font-medium text-foreground">November</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Final Exam</span>
                    <span className="font-medium text-foreground">February-March</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
