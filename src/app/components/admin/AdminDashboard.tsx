import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, AlertCircle } from 'lucide-react';

const PEAK_HOURS_DATA = [
  { hour: '9 AM', count: 12 },
  { hour: '10 AM', count: 18 },
  { hour: '11 AM', count: 22 },
  { hour: '12 PM', count: 15 },
  { hour: '1 PM', count: 10 },
  { hour: '2 PM', count: 20 },
  { hour: '3 PM', count: 25 },
  { hour: '4 PM', count: 19 },
  { hour: '5 PM', count: 8 },
];

const APPOINTMENT_STATUS_DATA = [
  { name: 'Completed', value: 145, color: '#10b981' },
  { name: 'No-Show', value: 23, color: '#ef4444' },
  { name: 'Cancelled', value: 18, color: '#f59e0b' },
  { name: 'Pending', value: 12, color: '#3b82f6' },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15800 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Apr', revenue: 18900 },
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export function AdminDashboard() {
  const totalAppointments = APPOINTMENT_STATUS_DATA.reduce((sum, item) => sum + item.value, 0);
  const noShowRate = ((23 / totalAppointments) * 100).toFixed(1);
  const completionRate = ((145 / totalAppointments) * 100).toFixed(1);
  const totalRevenue = REVENUE_DATA.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Total Appointments</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">{totalAppointments}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>No-Show Rate</span>
              <AlertCircle className="w-4 h-4 text-red-600" />
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{noShowRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600">-2.3%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Completion Rate</span>
              <Users className="w-4 h-4 text-green-600" />
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+5.2%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center justify-between">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-teal-600" />
            </CardDescription>
            <CardTitle className="text-3xl text-teal-600">${(totalRevenue / 1000).toFixed(1)}K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600">+18.7%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
            <CardDescription>Appointment distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PEAK_HOURS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
            <CardDescription>Breakdown of appointment outcomes</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={APPOINTMENT_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {APPOINTMENT_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue overview (simulation)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-semibold text-blue-600">8</p>
              <p className="text-sm text-gray-500 mt-2">Across 5 specializations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registered Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-semibold text-teal-600">342</p>
              <p className="text-sm text-gray-500 mt-2">+24 this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-semibold text-purple-600">12 min</p>
              <p className="text-sm text-gray-500 mt-2">Below 15 min target</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
