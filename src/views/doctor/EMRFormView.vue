<template>
  <form @submit.prevent="handleSubmit" class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center gap-3">
      <Button type="button" variant="ghost" size="icon" @click="handleNavigate('dashboard')">
        <ArrowLeft class="w-5 h-5" />
      </Button>
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Electronic Medical Record</h1>
        <p class="text-gray-500 mt-1">Complete patient consultation record</p>
      </div>
    </div>

    <!-- Patient Info -->
    <Card>
      <CardHeader class="bg-blue-50">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>{{ formData.patientName }}</CardTitle>
            <CardDescription>Appointment Time: {{ formData.appointmentTime }}</CardDescription>
          </div>
          <Badge>In Consultation</Badge>
        </div>
      </CardHeader>
    </Card>

    <!-- Vitals -->
    <Card>
      <CardHeader>
        <CardTitle>Vital Signs</CardTitle>
        <CardDescription>Record patient's vital measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="space-y-2">
            <Label for="temperature">Temperature (°F)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="98.6"
              v-model="formData.vitals.temperature"
            />
          </div>
          <div class="space-y-2">
            <Label for="bp">Blood Pressure</Label>
            <Input
              id="bp"
              placeholder="120/80"
              v-model="formData.vitals.bloodPressure"
            />
          </div>
          <div class="space-y-2">
            <Label for="hr">Heart Rate (bpm)</Label>
            <Input
              id="hr"
              type="number"
              placeholder="72"
              v-model="formData.vitals.heartRate"
            />
          </div>
          <div class="space-y-2">
            <Label for="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70"
              v-model="formData.vitals.weight"
            />
          </div>
          <div class="space-y-2">
            <Label for="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="175"
              v-model="formData.vitals.height"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Chief Complaint & Diagnosis -->
    <Card>
      <CardHeader>
        <CardTitle>Clinical Assessment</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="complaint">Chief Complaint</Label>
          <Textarea
            id="complaint"
            placeholder="Patient's main symptoms or concerns..."
            v-model="formData.chiefComplaint"
            :rows="2"
          />
        </div>

        <div class="space-y-2">
          <Label for="diagnosis">Diagnosis *</Label>
          <Input
            id="diagnosis"
            placeholder="Primary diagnosis"
            v-model="formData.diagnosis"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="notes">Clinical Notes *</Label>
          <Textarea
            id="notes"
            placeholder="Detailed consultation notes, examination findings, treatment plan..."
            v-model="formData.notes"
            :rows="6"
            required
          />
        </div>
      </CardContent>
    </Card>

    <!-- Prescriptions -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>Add medications and dosage instructions</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" @click="addPrescription">
            <Plus class="w-4 h-4 mr-1" />
            Add Prescription
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-for="(rx, index) in prescriptions" :key="index" class="p-4 border border-gray-200 rounded-lg space-y-3">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-sm text-gray-700">Prescription {{ index + 1 }}</h4>
            <Button
              v-if="prescriptions.length > 1"
              type="button"
              variant="ghost"
              size="sm"
              @click="removePrescription(index)"
            >
              <Trash2 class="w-4 h-4 text-red-500" />
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-2">
              <Label>Drug Name</Label>
              <Input
                placeholder="e.g., Amoxicillin"
                v-model="rx.drugName"
              />
            </div>
            <div class="space-y-2">
              <Label>Dosage</Label>
              <Input
                placeholder="e.g., 500mg"
                v-model="rx.dosage"
              />
            </div>
            <div class="space-y-2">
              <Label>Frequency</Label>
              <Input
                placeholder="e.g., Twice daily"
                v-model="rx.frequency"
              />
            </div>
            <div class="space-y-2">
              <Label>Duration</Label>
              <Input
                placeholder="e.g., 7 days"
                v-model="rx.duration"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              placeholder="Special instructions (e.g., Take with food, avoid alcohol)"
              v-model="rx.instructions"
              :rows="2"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tests -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Laboratory Tests</CardTitle>
            <CardDescription>Order diagnostic tests</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" @click="addTest">
            <Plus class="w-4 h-4 mr-1" />
            Add Test
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <p v-if="tests.length === 0" class="text-sm text-gray-500 text-center py-4">No tests ordered</p>
        <template v-else>
          <div v-for="(test, index) in tests" :key="index" class="p-4 border border-gray-200 rounded-lg space-y-3">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-sm text-gray-700">Test {{ index + 1 }}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="removeTest(index)"
              >
                <Trash2 class="w-4 h-4 text-red-500" />
              </Button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="space-y-2">
                <Label>Test Name</Label>
                <Input
                  placeholder="e.g., Complete Blood Count (CBC)"
                  v-model="test.testName"
                />
              </div>
              <div class="space-y-2">
                <Label>Reason</Label>
                <Input
                  placeholder="e.g., Rule out infection"
                  v-model="test.reason"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <Switch v-model:checked="test.urgent" />
              <Label>Mark as Urgent</Label>
            </div>
          </div>
        </template>
      </CardContent>
    </Card>

    <!-- Actions -->
    <div class="flex gap-3 justify-end sticky bottom-4 bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <Button type="button" variant="outline" @click="handleNavigate('dashboard')">
        Cancel
      </Button>
      <Button type="submit" class="bg-blue-600 hover:bg-blue-700">
        <Save class="w-4 h-4 mr-2" />
        Save Medical Record
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { toast } from 'vue-sonner';

const router = useRouter();

const formData = ref({
  patientName: "John Doe",
  appointmentTime: "09:00 AM",
  chiefComplaint: "",
  diagnosis: "",
  notes: "",
  vitals: {
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    weight: "",
    height: "",
  },
});

const prescriptions = ref([
  { drugName: "", dosage: "", frequency: "", duration: "", instructions: "" },
]);

const tests = ref([]);

const addPrescription = () => {
  prescriptions.value.push({
    drugName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });
};

const removePrescription = (index) => {
  prescriptions.value.splice(index, 1);
};

const addTest = () => {
  tests.value.push({ testName: "", reason: "", urgent: false });
};

const removeTest = (index) => {
  tests.value.splice(index, 1);
};

const handleNavigate = (path) => {
  router.push(`/doctor/${path}`);
};

const handleSubmit = () => {
  if (!formData.value.diagnosis || !formData.value.notes) {
    // toast.error('Please fill in diagnosis and notes');
    return;
  }

  // toast.success('Medical record saved successfully');
  setTimeout(() => {
    handleNavigate("dashboard");
  }, 1500);
};
</script>
