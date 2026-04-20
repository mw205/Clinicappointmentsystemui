import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-react';
import { toast } from 'sonner';
import { DoctorSchedule, Doctor } from '../../types';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: '2',
    email: 'doctor@clinic.com',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    role: 'doctor',
    specialization: 'General Medicine',
    licenseNumber: 'MD12345',
    consultationFee: 100,
  },
  {
    id: '5',
    email: 'doctor2@clinic.com',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    role: 'doctor',
    specialization: 'Cardiology',
    licenseNumber: 'MD12346',
    consultationFee: 150,
  },
];

const MOCK_SCHEDULES: DoctorSchedule[] = [
  {
    id: '1',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-19',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isAvailable: true,
  },
  {
    id: '2',
    doctorId: '5',
    doctorName: 'Dr. Michael Chen',
    date: '2026-04-19',
    startTime: '10:00',
    endTime: '16:00',
    slotDuration: 30,
    isAvailable: true,
  },
  {
    id: '3',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-22',
    startTime: '09:00',
    endTime: '13:00',
    slotDuration: 30,
    isAvailable: false,
    reason: 'Medical Conference',
  },
];

export function DoctorSchedules() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    doctorId: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isAvailable: true,
    reason: '',
  });

  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const daySchedules = schedules.filter(s => s.date === selectedDateStr);

  const handleAddSchedule = () => {
    if (!newSchedule.doctorId || !selectedDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const doctor = MOCK_DOCTORS.find(d => d.id === newSchedule.doctorId);
    if (!doctor) return;

    const schedule: DoctorSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: newSchedule.doctorId,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      date: selectedDateStr!,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      slotDuration: newSchedule.slotDuration,
      isAvailable: newSchedule.isAvailable,
      reason: newSchedule.reason || undefined,
    };

    setSchedules([...schedules, schedule]);
    setDialogOpen(false);
    setNewSchedule({
      doctorId: '',
      date: '',
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      isAvailable: true,
      reason: '',
    });
    toast.success('Schedule added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Doctor Schedules</h1>
          <p className="text-gray-500 mt-1">Manage doctor availability and time blocks</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Doctor Schedule</DialogTitle>
              <DialogDescription>Set availability or block time for a doctor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Doctor</Label>
                <Select value={newSchedule.doctorId} onValueChange={(value) => setNewSchedule({ ...newSchedule, doctorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DOCTORS.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Slot Duration</Label>
                <Select
                  value={newSchedule.slotDuration.toString()}
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, slotDuration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newSchedule.isAvailable.toString()}
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, isAvailable: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available</SelectItem>
                    <SelectItem value="false">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!newSchedule.isAvailable && (
                <div className="space-y-2">
                  <Label>Reason for Block</Label>
                  <Textarea
                    placeholder="e.g., Vacation, Conference, Emergency"
                    value={newSchedule.reason}
                    onChange={(e) => setNewSchedule({ ...newSchedule, reason: e.target.value })}
                    rows={2}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSchedule}>Add Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Schedules for Selected Date */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Schedules for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
            <CardDescription>
              {daySchedules.length} doctor{daySchedules.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {daySchedules.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No schedules for this date</p>
                <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {daySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-4 rounded-lg border-2 ${
                      schedule.isAvailable
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-red-200 bg-red-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          schedule.isAvailable ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <User className={`w-5 h-5 ${
                            schedule.isAvailable ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{schedule.doctorName}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                            <Badge variant="outline">
                              {schedule.slotDuration} min slots
                            </Badge>
                          </div>
                          {!schedule.isAvailable && schedule.reason && (
                            <p className="text-sm text-red-600 mt-2 italic">{schedule.reason}</p>
                          )}
                        </div>
                      </div>
                      <Badge className={schedule.isAvailable ? 'bg-green-600' : 'bg-red-600'}>
                        {schedule.isAvailable ? 'Available' : 'Blocked'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Doctors Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>Current roster and specializations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {MOCK_DOCTORS.map((doctor) => {
              const doctorSchedules = schedules.filter(s => s.doctorId === doctor.id);
              const availableSlots = doctorSchedules.filter(s => s.isAvailable).length;

              return (
                <div key={doctor.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline">{doctor.licenseNumber}</Badge>
                        <span className="text-sm text-gray-500">
                          ${doctor.consultationFee} per visit
                        </span>
                      </div>
                      <div className="mt-3 text-sm">
                        <span className="text-gray-600">Scheduled days: </span>
                        <span className="font-medium text-gray-900">{availableSlots}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
