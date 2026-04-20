import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { FileText, Calendar, User, Pill, FlaskConical } from 'lucide-react';
import { MedicalRecord } from '../../types';

const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    appointmentId: 'apt1',
    patientId: '1',
    doctorId: '2',
    date: '2026-03-15',
    chiefComplaint: 'Persistent headache and fatigue',
    diagnosis: 'Tension headache, mild dehydration',
    notes: 'Patient reports stress-related headaches occurring 3-4 times per week. Blood pressure normal. Recommended increased water intake and stress management techniques.',
    prescriptions: [
      {
        id: 'rx1',
        drugName: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours',
        duration: '5 days',
        instructions: 'Take with food',
      },
      {
        id: 'rx2',
        drugName: 'Multivitamin',
        dosage: '1 tablet',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning',
      },
    ],
    tests: [
      {
        id: 'test1',
        testName: 'Complete Blood Count (CBC)',
        reason: 'Rule out anemia',
        urgent: false,
      },
    ],
    vitals: {
      temperature: 98.6,
      bloodPressure: '120/80',
      heartRate: 72,
      weight: 70,
      height: 175,
    },
  },
  {
    id: '2',
    appointmentId: 'apt2',
    patientId: '1',
    doctorId: '2',
    date: '2026-02-10',
    chiefComplaint: 'Annual check-up',
    diagnosis: 'Healthy, no concerns',
    notes: 'Annual wellness visit. All vitals within normal range. Patient maintaining healthy lifestyle.',
    prescriptions: [],
    tests: [],
    vitals: {
      temperature: 98.4,
      bloodPressure: '118/78',
      heartRate: 68,
      weight: 69,
      height: 175,
    },
  },
];

export function MedicalRecords() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
        <p className="text-gray-500 mt-1">Your consultation history and medical documents</p>
      </div>

      <div className="space-y-4">
        {MOCK_RECORDS.map((record) => (
          <Card key={record.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Dr. Sarah Smith
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Chief Complaint */}
              {record.chiefComplaint && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Chief Complaint</h4>
                  <p className="text-sm text-gray-600">{record.chiefComplaint}</p>
                </div>
              )}

              <Separator />

              {/* Vitals */}
              {record.vitals && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Vital Signs</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {record.vitals.temperature && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">Temperature</p>
                        <p className="text-lg font-semibold text-gray-900">{record.vitals.temperature}°F</p>
                      </div>
                    )}
                    {record.vitals.bloodPressure && (
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                        <p className="text-lg font-semibold text-gray-900">{record.vitals.bloodPressure}</p>
                      </div>
                    )}
                    {record.vitals.heartRate && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{record.vitals.heartRate} bpm</p>
                      </div>
                    )}
                    {record.vitals.weight && (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-gray-600">Weight</p>
                        <p className="text-lg font-semibold text-gray-900">{record.vitals.weight} kg</p>
                      </div>
                    )}
                    {record.vitals.height && (
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <p className="text-xs text-gray-600">Height</p>
                        <p className="text-lg font-semibold text-gray-900">{record.vitals.height} cm</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Diagnosis & Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Doctor's Notes</h4>
                <p className="text-sm text-gray-600">{record.notes}</p>
              </div>

              {/* Prescriptions */}
              {record.prescriptions.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Pill className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-900">Prescriptions</h4>
                    </div>
                    <div className="space-y-3">
                      {record.prescriptions.map((rx) => (
                        <div key={rx.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{rx.drugName}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {rx.dosage} - {rx.frequency}
                              </p>
                              {rx.instructions && (
                                <p className="text-xs text-gray-500 mt-1 italic">{rx.instructions}</p>
                              )}
                            </div>
                            <Badge variant="outline">{rx.duration}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tests Ordered */}
              {record.tests.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical className="w-4 h-4 text-teal-600" />
                      <h4 className="text-sm font-medium text-gray-900">Tests Ordered</h4>
                    </div>
                    <div className="space-y-2">
                      {record.tests.map((test) => (
                        <div key={test.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{test.testName}</p>
                            {test.reason && (
                              <p className="text-sm text-gray-600 mt-1">{test.reason}</p>
                            )}
                          </div>
                          {test.urgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {MOCK_RECORDS.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No medical records found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
