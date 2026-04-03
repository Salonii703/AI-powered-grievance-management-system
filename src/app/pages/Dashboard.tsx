import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  AlertCircle, Clock, CheckCircle2, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Users, FileText, Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

// Admin stats
const adminStats = [
  { label: 'Total Grievances', value: '1,247', change: '+12%', icon: AlertCircle, color: '#1E40AF' },
  { label: 'Pending Review', value: '89', change: '-5%', icon: Clock, color: '#F59E0B' },
  { label: 'Resolved Today', value: '45', change: '+18%', icon: CheckCircle2, color: '#10B981' },
  { label: 'Active Users', value: '523', change: '+8%', icon: Users, color: '#8B5CF6' },
];

// Citizen stats
const citizenStats = [
  { label: 'My Grievances', value: '5', change: '+1', icon: FileText, color: '#1E40AF' },
  { label: 'Pending', value: '2', change: '0', icon: Clock, color: '#F59E0B' },
  { label: 'Resolved', value: '3', change: '+1', icon: CheckCircle2, color: '#10B981' },
  { label: 'Avg. Resolution', value: '3.2d', change: '-10%', icon: TrendingUp, color: '#EF4444' },
];

const chartData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 60 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 75 },
  { name: 'Sat', value: 35 },
  { name: 'Sun', value: 20 },
];

const priorityData = [
  { name: 'High', value: 25, color: '#EF4444' },
  { name: 'Medium', value: 45, color: '#F59E0B' },
  { name: 'Low', value: 30, color: '#10B981' },
];

// Admin recent grievances - all grievances across system
const adminRecentGrievances = [
  { id: '#GRV-8902', title: 'Street Light Issue', category: 'Public Infra', priority: 'Medium', status: 'Pending', date: '2 hours ago', user: 'Rajesh Kumar' },
  { id: '#GRV-8901', title: 'Water Supply Delay', category: 'Utilities', priority: 'High', status: 'Processing', date: '5 hours ago', user: 'Priya Sharma' },
  { id: '#GRV-8900', title: 'Garbage Collection', category: 'Sanitation', priority: 'Low', status: 'Resolved', date: 'Yesterday', user: 'Amit Patel' },
  { id: '#GRV-8899', title: 'Noise Complaint', category: 'Police', priority: 'Medium', status: 'Under Review', date: '2 days ago', user: 'Sneha Gupta' },
  { id: '#GRV-8898', title: 'Road Repair Needed', category: 'Public Works', priority: 'High', status: 'Pending', date: '3 days ago', user: 'Vikram Singh' },
];

// Citizen recent grievances - only their own
const citizenRecentGrievances = [
  { id: '#GRV-8902', title: 'Street Light Issue in Sector 12', category: 'Public Infra', priority: 'Medium', status: 'Pending', date: '2 hours ago' },
  { id: '#GRV-8785', title: 'Water Supply Timing Issue', category: 'Utilities', priority: 'High', status: 'Processing', date: '3 days ago' },
  { id: '#GRV-8654', title: 'Garbage Collection Missed', category: 'Sanitation', priority: 'Low', status: 'Resolved', date: '1 week ago' },
];

export const Dashboard = () => {
  const userName = localStorage.getItem('ugp_user_name') || 'Citizen';
  const firstName = userName.split(' ')[0];
  
  // Get user role from localStorage
  const currentUser = localStorage.getItem('ugp_current_user');
  const userRole = currentUser ? JSON.parse(currentUser).role : 'citizen';
  
  const isAdmin = userRole === 'admin';
  const stats = isAdmin ? adminStats : citizenStats;
  const recentGrievances = isAdmin ? adminRecentGrievances : citizenRecentGrievances;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {firstName}!
          {isAdmin && <span className="ml-3 text-sm font-normal text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Admin</span>}
        </h1>
        <p className="text-gray-500">
          {isAdmin 
            ? "Here's the system overview and recent grievances requiring attention." 
            : "Here's what's happening with your grievances today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.change.startsWith('+') || stat.change.includes('+') ? 'text-green-600' : stat.change === '0' ? 'text-gray-500' : 'text-red-600'}`}>
                {stat.change}
                {(stat.change.startsWith('+') || stat.change.includes('+')) && <ArrowUpRight size={14} />}
                {stat.change.startsWith('-') && <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">
                {isAdmin ? 'System Grievance Trends' : 'My Grievance Activity'}
              </h3>
              <p className="text-sm text-gray-500">
                {isAdmin ? 'Total system submission volume' : 'Your submission history'}
              </p>
            </div>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#1E40AF" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <h3 className="text-lg font-bold mb-1">Priority Distribution</h3>
          <p className="text-sm text-gray-500 mb-8">
            {isAdmin ? 'All active cases' : 'Your active cases'}
          </p>
          <div className="h-[250px] w-full bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{isAdmin ? '1247' : '5'}</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {priorityData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Grievances List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {isAdmin ? 'Recent Grievances (All Users)' : 'My Recent Grievances'}
          </h3>
          <Link 
            to={isAdmin ? '/dashboard/all' : '/dashboard/my-grievances'} 
            className="text-[#1E40AF] font-medium text-sm hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Grievance Details</th>
                {isAdmin && <th className="px-6 py-4">Submitted By</th>}
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentGrievances.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">{item.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{(item as any).user}</span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full`} style={{ 
                        backgroundColor: item.priority === 'High' ? '#EF4444' : 
                                       item.priority === 'Medium' ? '#F59E0B' : '#10B981' 
                      }} />
                      <span className="text-sm">{item.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      item.status === 'Resolved' ? 'bg-green-50 text-green-700' :
                      item.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                      item.status === 'Under Review' ? 'bg-purple-50 text-purple-700' :
                      item.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action for Citizens */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#1E40AF] to-[#1e3a8a] rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need to Lodge a New Grievance?</h3>
              <p className="text-blue-100">Submit your complaint and get it resolved quickly with AI-powered routing.</p>
            </div>
            <Link
              to="/dashboard/lodging"
              className="bg-white text-[#1E40AF] px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Lodge Grievance
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};