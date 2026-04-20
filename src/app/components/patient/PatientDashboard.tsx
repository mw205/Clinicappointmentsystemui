import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Appointment } from '../../types';

const MOCK_UPCOMING: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-22',
    startTime: '10:00',
    endTime: '10:30',
    duration: 30,
    status: 'confirmed',
    type: 'consultation',
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-25',
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    status: 'pending',
    type: 'follow-up',
  },
];

export function PatientDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      'checked-in': 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-500 mt-1">Manage your health appointments and medical records</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-blue-50/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('book-appointment')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Book Appointment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>Schedule a new consultation with available doctors</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('records')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Medical Records</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>View your consultation history and prescriptions</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('appointments')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">My Appointments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>View and manage all your appointments</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('appointments')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {MOCK_UPCOMING.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
              <Button className="mt-4" onClick={() => onNavigate('book-appointment')}>
                Book Your First Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_UPCOMING.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.doctorName}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.startTime}
                        </span>
                      </div>
                      <Badge className={`mt-2 ${getStatusColor(apt.status)}`} variant="secondary">
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <Button variant="outline" size="sm">Cancel</Button>
                    )}
                    {apt.status === 'confirmed' && (
                      <Button variant="outline" size="sm">Reschedule</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-semibold text-blue-600">3</div>
              <p className="text-sm text-gray-500 mt-1">Consultations this year</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Check-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-semibold text-teal-600">April 22</div>
              <p className="text-sm text-gray-500 mt-1">General Consultation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
