<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Medical Records</h1>
      <p class="text-gray-500 mt-1">Your consultation history and medical documents</p>
    </div>

    <div class="space-y-4">
      <Card v-for="record in MOCK_RECORDS" :key="record.id" class="overflow-hidden">
        <CardHeader class="bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <FileText class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle class="text-lg">{{ record.diagnosis }}</CardTitle>
                <CardDescription class="flex items-center gap-4 mt-1">
                  <span class="flex items-center gap-1">
                    <Calendar class="w-4 h-4" />
                    {{ new Date(record.date).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year:
                    'numeric' }) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <User class="w-4 h-4" />
                    Dr. Sarah Smith
                  </span>
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">Completed</Badge>
          </div>
        </CardHeader>

        <CardContent class="pt-6 space-y-6">
          <!-- Chief Complaint -->
          <div v-if="record.chiefComplaint">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Chief Complaint</h4>
            <p class="text-sm text-gray-600">{{ record.chiefComplaint }}</p>
          </div>

          <Separator />

          <!-- Vitals -->
          <div v-if="record.vitals">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Vital Signs</h4>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div v-if="record.vitals.temperature" class="p-3 bg-blue-50 rounded-lg">
                <p class="text-xs text-gray-600">Temperature</p>
                <p class="text-lg font-semibold text-gray-900">{{ record.vitals.temperature }}°F</p>
              </div>
              <div v-if="record.vitals.bloodPressure" class="p-3 bg-teal-50 rounded-lg">
                <p class="text-xs text-gray-600">Blood Pressure</p>
                <p class="text-lg font-semibold text-gray-900">{{ record.vitals.bloodPressure }}</p>
              </div>
              <div v-if="record.vitals.heartRate" class="p-3 bg-purple-50 rounded-lg">
                <p class="text-xs text-gray-600">Heart Rate</p>
                <p class="text-lg font-semibold text-gray-900">{{ record.vitals.heartRate }} bpm</p>
              </div>
              <div v-if="record.vitals.weight" class="p-3 bg-orange-50 rounded-lg">
                <p class="text-xs text-gray-600">Weight</p>
                <p class="text-lg font-semibold text-gray-900">{{ record.vitals.weight }} kg</p>
              </div>
              <div v-if="record.vitals.height" class="p-3 bg-pink-50 rounded-lg">
                <p class="text-xs text-gray-600">Height</p>
                <p class="text-lg font-semibold text-gray-900">{{ record.vitals.height }} cm</p>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Diagnosis & Notes -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">Doctor's Notes</h4>
            <p class="text-sm text-gray-600">{{ record.notes }}</p>
          </div>

          <!-- Prescriptions -->
          <template v-if="record.prescriptions && record.prescriptions.length > 0">
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-3">
                <Pill class="w-4 h-4 text-blue-600" />
                <h4 class="text-sm font-medium text-gray-900">Prescriptions</h4>
              </div>
              <div class="space-y-3">
                <div v-for="rx in record.prescriptions" :key="rx.id" class="p-3 border border-gray-200 rounded-lg">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-medium text-gray-900">{{ rx.drugName }}</p>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ rx.dosage }} - {{ rx.frequency }}
                      </p>
                      <p v-if="rx.instructions" class="text-xs text-gray-500 mt-1 italic">{{ rx.instructions }}</p>
                    </div>
                    <Badge variant="outline">{{ rx.duration }}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Tests Ordered -->
          <template v-if="record.tests && record.tests.length > 0">
            <Separator />
            <div>
              <div class="flex items-center gap-2 mb-3">
                <FlaskConical class="w-4 h-4 text-teal-600" />
                <h4 class="text-sm font-medium text-gray-900">Tests Ordered</h4>
              </div>
              <div class="space-y-2">
                <div v-for="test in record.tests" :key="test.id"
                  class="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ test.testName }}</p>
                    <p v-if="test.reason" class="text-sm text-gray-600 mt-1">{{ test.reason }}</p>
                  </div>
                  <Badge v-if="test.urgent" variant="destructive">Urgent</Badge>
                </div>
              </div>
            </div>
          </template>
        </CardContent>
      </Card>
    </div>

    <Card v-if="MOCK_RECORDS.length === 0">
      <CardContent class="py-12 text-center">
        <FileText class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">No medical records found</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
const MOCK_RECORDS = [
  {
    id: "1",
    appointmentId: "apt1",
    patientId: "1",
    doctorId: "2",
    date: "2026-03-15",
    chiefComplaint: "Persistent headache and fatigue",
    diagnosis: "Tension headache, mild dehydration",
    notes:
      "Patient reports stress-related headaches occurring 3-4 times per week. Blood pressure normal. Recommended increased water intake and stress management techniques.",
    prescriptions: [
      {
        id: "rx1",
        drugName: "Ibuprofen",
        dosage: "400mg",
        frequency: "Every 6 hours",
        duration: "5 days",
        instructions: "Take with food",
      },
      {
        id: "rx2",
        drugName: "Multivitamin",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take in the morning",
      },
    ],
    tests: [
      {
        id: "test1",
        testName: "Complete Blood Count (CBC)",
        reason: "Rule out anemia",
        urgent: false,
      },
    ],
    vitals: {
      temperature: 98.6,
      bloodPressure: "120/80",
      heartRate: 72,
      weight: 70,
      height: 175,
    },
  },
  {
    id: "2",
    appointmentId: "apt2",
    patientId: "1",
    doctorId: "2",
    date: "2026-02-10",
    chiefComplaint: "Annual check-up",
    diagnosis: "Healthy, no concerns",
    notes:
      "Annual wellness visit. All vitals within normal range. Patient maintaining healthy lifestyle.",
    prescriptions: [],
    tests: [],
    vitals: {
      temperature: 98.4,
      bloodPressure: "118/78",
      heartRate: 68,
      weight: 69,
      height: 175,
    },
  },
];

</script>
