import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Doctor, TimeSlot } from '../../types';

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
  {
    id: '6',
    email: 'doctor3@clinic.com',
    firstName: 'Dr. Emily',
    lastName: 'Rodriguez',
    role: 'doctor',
    specialization: 'Pediatrics',
    licenseNumber: 'MD12347',
    consultationFee: 120,
  },
];

const generateTimeSlots = (duration: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3,
      });
    }
  }

  return slots;
};

export function BookAppointment({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotDuration, setSlotDuration] = useState<number>(30);

  const timeSlots = selectedDate ? generateTimeSlots(slotDuration) : [];

  const handleBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast.error('Please complete all steps');
      return;
    }

    toast.success('Appointment booked successfully!');
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1) : onNavigate('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Book Appointment</h1>
          <p className="text-gray-500">Schedule a consultation with our doctors</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Doctor</CardTitle>
            <CardDescription>Choose from our available specialists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_DOCTORS.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setStep(2);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedDoctor?.id === doctor.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <Badge variant="secondary" className="mt-2">
                        License: {doctor.licenseNumber}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${doctor.consultationFee}</p>
                    <p className="text-xs text-gray-500">Consultation Fee</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Slot Duration */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Consultation Duration</CardTitle>
            <CardDescription>Choose your appointment length</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div
                onClick={() => {
                  setSlotDuration(15);
                  setStep(3);
                }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  slotDuration === 15 ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">15 Minutes</p>
                  <p className="text-sm text-gray-500 mt-1">Quick consultation</p>
                </div>
              </div>
              <div
                onClick={() => {
                  setSlotDuration(30);
                  setStep(3);
                }}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  slotDuration === 30 ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <Clock className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">30 Minutes</p>
                  <p className="text-sm text-gray-500 mt-1">Standard consultation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Date */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose an available date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) setStep(4);
                }}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Select Time Slot */}
      {step === 4 && selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Select Time Slot</CardTitle>
            <CardDescription>
              Available {slotDuration}-minute slots on {selectedDate.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedSlot === slot.time ? 'default' : 'outline'}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.time)}
                  className="h-auto py-3"
                >
                  {slot.time}
                </Button>
              ))}
            </div>

            {selectedSlot && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Doctor:</span> {selectedDoctor?.firstName} {selectedDoctor?.lastName}</p>
                  <p><span className="text-gray-600">Specialization:</span> {selectedDoctor?.specialization}</p>
                  <p><span className="text-gray-600">Date:</span> {selectedDate.toLocaleDateString()}</p>
                  <p><span className="text-gray-600">Time:</span> {selectedSlot}</p>
                  <p><span className="text-gray-600">Duration:</span> {slotDuration} minutes</p>
                  <p><span className="text-gray-600">Fee:</span> ${selectedDoctor?.consultationFee}</p>
                </div>
                <Button onClick={handleBooking} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  Confirm Booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
