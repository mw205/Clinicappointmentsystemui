import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, Clock, Users, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Appointment } from '../../types';
import { toast } from 'sonner';

const MOCK_TODAY_QUEUE: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-19',
    startTime: '09:00',
    endTime: '09:30',
    duration: 30,
    status: 'checked-in',
    type: 'consultation',
    checkInTime: '08:55',
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Jane Smith',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-19',
    startTime: '09:30',
    endTime: '10:00',
    duration: 30,
    status: 'confirmed',
    type: 'follow-up',
  },
  {
    id: '3',
    patientId: '4',
    patientName: 'Robert Johnson',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-19',
    startTime: '10:00',
    endTime: '10:15',
    duration: 15,
    status: 'confirmed',
    type: 'consultation',
  },
  {
    id: '4',
    patientId: '5',
    patientName: 'Maria Garcia',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-19',
    startTime: '10:15',
    endTime: '10:45',
    duration: 30,
    status: 'pending',
    type: 'consultation',
  },
];

export function DoctorDashboard({ onNavigate }: { onNavigate: (view: string, data?: any) => void }) {
  const [queue, setQueue] = useState(MOCK_TODAY_QUEUE);

  const handleCheckIn = (id: string) => {
    setQueue(queue.map(apt =>
      apt.id === id ? { ...apt, status: 'checked-in' as const, checkInTime: new Date().toLocaleTimeString() } : apt
    ));
    toast.success('Patient checked in');
  };

  const handleComplete = (id: string) => {
    onNavigate('emr-form', { appointmentId: id });
  };

  const handleNoShow = (id: string) => {
    setQueue(queue.map(apt =>
      apt.id === id ? { ...apt, status: 'no-show' as const } : apt
    ));
    toast.info('Marked as no-show');
  };

  const handleConfirm = (id: string) => {
    setQueue(queue.map(apt =>
      apt.id === id ? { ...apt, status: 'confirmed' as const } : apt
    ));
    toast.success('Appointment confirmed');
  };

  const handleDecline = (id: string) => {
    setQueue(queue.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' as const, cancelReason: 'Declined by doctor' } : apt
    ));
    toast.error('Appointment declined');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'checked-in': 'bg-green-100 text-green-700',
      'confirmed': 'bg-blue-100 text-blue-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'completed': 'bg-gray-100 text-gray-700',
      'cancelled': 'bg-red-100 text-red-700',
      'no-show': 'bg-orange-100 text-orange-700',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const calculateWaitTime = (checkInTime?: string) => {
    if (!checkInTime) return null;
    const now = new Date();
    const checkedIn = new Date(`2026-04-19 ${checkInTime}`);
    const diffMs = now.getTime() - checkedIn.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  const stats = {
    total: queue.length,
    confirmed: queue.filter(a => a.status === 'confirmed').length,
    checkedIn: queue.filter(a => a.status === 'checked-in').length,
    completed: queue.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your daily schedule and patient consultations</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Today</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Confirmed</CardDescription>
            <CardTitle className="text-3xl text-teal-600">{stats.confirmed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Checked In</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.checkedIn}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-gray-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Today's Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Saturday, April 19, 2026</CardDescription>
            </div>
            <Button variant="outline" onClick={() => onNavigate('schedules')}>
              View Calendar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({queue.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({queue.filter(a => a.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="checked-in">Checked In ({stats.checkedIn})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {queue.map((apt) => {
                const waitTime = calculateWaitTime(apt.checkInTime);
                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-gray-900">{apt.patientName}</p>
                            <Badge className={getStatusColor(apt.status)} variant="secondary">
                              {apt.status}
                            </Badge>
                            {waitTime !== null && waitTime > 0 && (
                              <Badge variant="outline" className="text-orange-600">
                                Waiting {waitTime} min
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.startTime} - {apt.endTime}
                            </span>
                            <span className="capitalize">{apt.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {apt.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConfirm(apt.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecline(apt.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckIn(apt.id)}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        )}
                        {apt.status === 'checked-in' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleComplete(apt.id)}
                            >
                              Start Consultation
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNoShow(apt.id)}
                            >
                              No Show
                            </Button>
                          </>
                        )}
                        {apt.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('records')}
                          >
                            View Record
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="pending">
              {queue.filter(a => a.status === 'pending').map(apt => (
                <div key={apt.id} className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-600 mt-1">{apt.startTime} - {apt.endTime}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleConfirm(apt.id)}>Confirm</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDecline(apt.id)}>Decline</Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="checked-in">
              {queue.filter(a => a.status === 'checked-in').map(apt => (
                <div key={apt.id} className="p-4 rounded-lg border border-green-200 bg-green-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {apt.startTime} - {apt.endTime}
                        {apt.checkInTime && ` • Checked in at ${apt.checkInTime}`}
                      </p>
                    </div>
                    <Button size="sm" className="bg-green-600" onClick={() => handleComplete(apt.id)}>
                      Start Consultation
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
