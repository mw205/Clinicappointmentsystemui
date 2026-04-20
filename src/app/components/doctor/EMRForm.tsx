import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Prescription {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface TestOrder {
  testName: string;
  reason: string;
  urgent: boolean;
}

export function EMRForm({ appointmentId, onNavigate }: { appointmentId?: string; onNavigate: (view: string) => void }) {
  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    appointmentTime: '09:00 AM',
    chiefComplaint: '',
    diagnosis: '',
    notes: '',
    vitals: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: '',
    },
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { drugName: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);

  const [tests, setTests] = useState<TestOrder[]>([]);

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { drugName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: string) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptions(updated);
  };

  const addTest = () => {
    setTests([...tests, { testName: '', reason: '', urgent: false }]);
  };

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const updateTest = (index: number, field: keyof TestOrder, value: string | boolean) => {
    const updated = [...tests];
    updated[index] = { ...updated[index], [field]: value };
    setTests(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.diagnosis || !formData.notes) {
      toast.error('Please fill in diagnosis and notes');
      return;
    }

    toast.success('Medical record saved successfully');
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Electronic Medical Record</h1>
          <p className="text-gray-500 mt-1">Complete patient consultation record</p>
        </div>
      </div>

      {/* Patient Info */}
      <Card>
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{formData.patientName}</CardTitle>
              <CardDescription>Appointment Time: {formData.appointmentTime}</CardDescription>
            </div>
            <Badge>In Consultation</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
          <CardDescription>Record patient's vital measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={formData.vitals.temperature}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, temperature: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bp">Blood Pressure</Label>
              <Input
                id="bp"
                placeholder="120/80"
                value={formData.vitals.bloodPressure}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, bloodPressure: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hr">Heart Rate (bpm)</Label>
              <Input
                id="hr"
                type="number"
                placeholder="72"
                value={formData.vitals.heartRate}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, heartRate: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={formData.vitals.weight}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, weight: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={formData.vitals.height}
                onChange={(e) => setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, height: e.target.value }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint & Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complaint">Chief Complaint</Label>
            <Textarea
              id="complaint"
              placeholder="Patient's main symptoms or concerns..."
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Input
              id="diagnosis"
              placeholder="Primary diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes *</Label>
            <Textarea
              id="notes"
              placeholder="Detailed consultation notes, examination findings, treatment plan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={6}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Prescriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prescriptions</CardTitle>
              <CardDescription>Add medications and dosage instructions</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addPrescription}>
              <Plus className="w-4 h-4 mr-1" />
              Add Prescription
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptions.map((rx, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-700">Prescription {index + 1}</h4>
                {prescriptions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePrescription(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Drug Name</Label>
                  <Input
                    placeholder="e.g., Amoxicillin"
                    value={rx.drugName}
                    onChange={(e) => updatePrescription(index, 'drugName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input
                    placeholder="e.g., 500mg"
                    value={rx.dosage}
                    onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Input
                    placeholder="e.g., Twice daily"
                    value={rx.frequency}
                    onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    placeholder="e.g., 7 days"
                    value={rx.duration}
                    onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instructions</Label>
                <Textarea
                  placeholder="Special instructions (e.g., Take with food, avoid alcohol)"
                  value={rx.instructions}
                  onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Laboratory Tests</CardTitle>
              <CardDescription>Order diagnostic tests</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addTest}>
              <Plus className="w-4 h-4 mr-1" />
              Add Test
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No tests ordered</p>
          ) : (
            tests.map((test, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-700">Test {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTest(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Test Name</Label>
                    <Input
                      placeholder="e.g., Complete Blood Count (CBC)"
                      value={test.testName}
                      onChange={(e) => updateTest(index, 'testName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input
                      placeholder="e.g., Rule out infection"
                      value={test.reason}
                      onChange={(e) => updateTest(index, 'reason', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={test.urgent}
                    onCheckedChange={(checked) => updateTest(index, 'urgent', checked)}
                  />
                  <Label>Mark as Urgent</Label>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end sticky bottom-4 bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <Button type="button" variant="outline" onClick={() => onNavigate('dashboard')}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Medical Record
        </Button>
      </div>
    </form>
  );
}
