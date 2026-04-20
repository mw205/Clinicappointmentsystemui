import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Clock, Users, Search, Timer } from 'lucide-react';
import { Appointment } from '../../types';

const MOCK_WAITING_ROOM: Appointment[] = [
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
    checkInTime: '08:45',
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
    doctorId: '5',
    doctorName: 'Dr. Michael Chen',
    date: '2026-04-19',
    startTime: '10:00',
    endTime: '10:15',
    duration: 15,
    status: 'checked-in',
    type: 'consultation',
    checkInTime: '09:50',
  },
];

export function QueueManagement() {
  const [queue, setQueue] = useState(MOCK_WAITING_ROOM);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateWaitTime = (checkInTime?: string) => {
    if (!checkInTime) return 0;
    const now = new Date();
    const [hours, minutes] = checkInTime.split(':');
    const checkedIn = new Date();
    checkedIn.setHours(parseInt(hours), parseInt(minutes), 0);
    const diffMs = now.getTime() - checkedIn.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 10) return 'text-green-600';
    if (minutes < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredQueue = queue.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = queue.filter(a => a.status === 'checked-in').length;
  const avgWaitTime = queue
    .filter(a => a.checkInTime)
    .reduce((acc, a) => acc + calculateWaitTime(a.checkInTime), 0) / checkedInCount || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Queue Management</h1>
        <p className="text-gray-500 mt-1">Monitor waiting room and patient flow</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients Waiting
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">{checkedInCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Average Wait Time
            </CardDescription>
            <CardTitle className="text-3xl text-teal-600">{Math.round(avgWaitTime)} min</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Today's Appointments
            </CardDescription>
            <CardTitle className="text-3xl text-purple-600">{queue.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle>Waiting Room</CardTitle>
          <CardDescription>Real-time patient queue status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Patients ({filteredQueue.length})</TabsTrigger>
              <TabsTrigger value="waiting">
                Checked In ({filteredQueue.filter(a => a.status === 'checked-in').length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({filteredQueue.filter(a => a.status === 'confirmed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {filteredQueue.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No patients in queue</p>
                </div>
              ) : (
                filteredQueue.map((apt) => {
                  const waitTime = calculateWaitTime(apt.checkInTime);
                  return (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        apt.status === 'checked-in'
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${
                            apt.status === 'checked-in' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Users className={`w-5 h-5 ${
                              apt.status === 'checked-in' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="font-medium text-gray-900">{apt.patientName}</p>
                              <Badge variant="outline" className="capitalize">
                                {apt.type}
                              </Badge>
                              {apt.status === 'checked-in' && waitTime > 0 && (
                                <Badge className={`${getWaitTimeColor(waitTime)} bg-transparent border-current`}>
                                  <Timer className="w-3 h-3 mr-1" />
                                  Waiting {waitTime} min
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Doctor:</span>
                                <span className="font-medium">{apt.doctorName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{apt.startTime} - {apt.endTime}</span>
                              </div>
                              {apt.checkInTime && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Checked in:</span>
                                  <span>{apt.checkInTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          {apt.status === 'checked-in' ? (
                            <Badge className="bg-green-600">In Queue</Badge>
                          ) : (
                            <Badge variant="outline" className="text-blue-600">Confirmed</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="waiting">
              {filteredQueue.filter(a => a.status === 'checked-in').map((apt) => {
                const waitTime = calculateWaitTime(apt.checkInTime);
                return (
                  <div key={apt.id} className="p-4 rounded-lg border-2 border-green-200 bg-green-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{apt.patientName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {apt.doctorName} • {apt.startTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-semibold ${getWaitTimeColor(waitTime)}`}>
                          {waitTime} min
                        </p>
                        <p className="text-xs text-gray-500">Wait time</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="upcoming">
              {filteredQueue.filter(a => a.status === 'confirmed').map((apt) => (
                <div key={apt.id} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {apt.doctorName} • {apt.startTime}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">Upcoming</Badge>
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
