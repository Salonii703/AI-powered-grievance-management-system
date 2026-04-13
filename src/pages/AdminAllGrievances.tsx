// import React, { useEffect, useState } from "react";
// const [officerName, setOfficerName] = useState('')
// const [officerPhone, setOfficerPhone] = useState('')
// const [officerNote, setOfficerNote] = useState('')

// const AdminAllGrievances = () => {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/admin/all")
//       .then((res) => res.json())
//       .then((resData) => setData(resData))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-blue-800 mb-6">
//         All Grievances 
//       </h1>

//       {data.length === 0 ? (
//         <p>No grievances found</p>
//       ) : (
//         <div className="grid gap-6">
//           {data.map((item, index) => (
//             <div
//               key={index}
//               className="bg-white p-5 rounded-xl shadow-md"
//             >
//               <div className="flex justify-between mb-2">
//                 <h2 className="font-bold text-lg text-blue-700">
//                   {item.trackingId}
//                 </h2>
//                 <span className="text-sm bg-yellow-100 px-3 py-1 rounded">
//                   {item.status}
//                 </span>
//               </div>

//               <p className="text-gray-700 mb-3">{item.text || "No details provided"}</p>

//               <p className="text-sm text-gray-500">
//                 📍 {item.area || "N/A"}, {item.city || "N/A"}
//               </p>

//               {item.landmark && (
//                 <p className="text-sm text-gray-400">
//                   Landmark: {item.landmark || "N/A"}
//                 </p>
//               )}

//                 {!item.anonymous && item.contact && (
//                 <p className="text-sm text-gray-600">
//                     📞 Contact: {item.contact}
//                 </p>
//                 )}

//                 {item.anonymous && (
//                 <p className="text-sm text-gray-500 italic">
//                     Submitted anonymously
//                 </p>
//                 )}

//               {item.image && (
//                 <img
//                   src={`http://localhost:5000/uploads/${item.image}`}
//                   className="mt-3 w-full max-h-60 object-cover rounded"
//                 />
//               )}

//               <p className="text-xs text-gray-400 mt-3">
//                 {new Date(item.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAllGrievances;




import React, { useEffect, useState } from "react";

const API = 'http://localhost:8000'
const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 }
const PRIORITY_COLOR: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
}
const STATUS_COLOR: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-purple-100 text-purple-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
}

const AdminAllGrievances = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [groupBy, setGroupBy] = useState<'district' | 'category' | 'priority'>('priority')
  const [reviewing, setReviewing] = useState<any>(null)
  const [newStatus, setNewStatus] = useState('')
  const [remark, setRemark] = useState('')
  const [officerName, setOfficerName] = useState('')
  const [officerPhone, setOfficerPhone] = useState('')
  const [officerNote, setOfficerNote] = useState('')

  function load() {
    fetch(`${API}/grievances`)
      .then(res => res.json())
      .then(d => {
        const list = Array.isArray(d) ? d : []
        const sorted = list.sort((a, b) =>
          (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
        )
        setData(sorted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function updateStatus() {
    await fetch(`${API}/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tracking_id: reviewing.tracking_id,
        status: newStatus,
        remark
      })
    })

    if (officerName && officerPhone) {
      await fetch(`${API}/assign-officer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracking_id: reviewing.tracking_id,
          officer_name: officerName,
          officer_phone: officerPhone,
          officer_note: officerNote
        })
      })
    }

    setReviewing(null)
    setRemark('')
    setOfficerName('')
    setOfficerPhone('')
    setOfficerNote('')
    load()
  }

  const groups: Record<string, any[]> = {}
  data.forEach(g => {
    const key = groupBy === 'district' ? (g.district || g.state || 'Unknown')
      : groupBy === 'category' ? (g.category || 'Uncategorized')
      : g.priority
    if (!groups[key]) groups[key] = []
    groups[key].push(g)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">All Grievances</h1>
        <p className="text-gray-500 text-sm mt-1">All submitted grievances sorted by priority</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: data.length, color: 'bg-blue-50 text-blue-800' },
          { label: 'Pending', value: data.filter(g => g.status === 'Submitted').length, color: 'bg-yellow-50 text-yellow-800' },
          { label: 'Under Review', value: data.filter(g => g.status === 'Under Review').length, color: 'bg-purple-50 text-purple-800' },
          { label: 'Resolved', value: data.filter(g => g.status === 'Resolved').length, color: 'bg-green-50 text-green-800' },
          {
      label: 'Avg Rating',
      value: (() => {
        const rated = data.filter(g => g.rating)
        if (!rated.length) return 'N/A'
        const avg = rated.reduce((sum, g) => sum + g.rating, 0) / rated.length
        return avg.toFixed(1) + ' ★'
      })(),
      color: 'bg-yellow-50 text-yellow-800'
    },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Group controls */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Group by:</span>
        {(['priority', 'category', 'district'] as const).map(g => (
          <button key={g} onClick={() => setGroupBy(g)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
              ${groupBy === g ? 'bg-blue-800 text-white' : 'bg-white border hover:bg-gray-50'}`}>
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-sm text-blue-700 underline">↻ Refresh</button>
      </div>

      {/* Grouped list */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading...</div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>No grievances submitted yet.</p>
        </div>
      ) : (
        Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>{group}</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </h3>
            <div className="space-y-2">
              {items.map(g => (
                <div key={g.tracking_id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">{g.tracking_id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[g.priority] || 'bg-gray-100'}`}>
                        {g.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[g.status] || 'bg-gray-100'}`}>
                        {g.status}
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {g.category}
                      </span>
                      {g.officer_name && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          Officer Assigned
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 truncate">{g.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {g.name} · {g.district || g.state || 'Unknown'} · Due in {g.action_within}
                    </p>
                    {g.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                            fill={s <= g.rating ? '#FBBF24' : 'none'}
                            stroke={s <= g.rating ? '#FBBF24' : '#D1D5DB'} strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{g.feedback || 'No feedback'}</span>
                      </div>
                    )}
                </div>
                  <button
                    onClick={() => {
                      setReviewing(g)
                      setNewStatus(g.status)
                      setOfficerName(g.officer_name || '')
                      setOfficerPhone(g.officer_phone || '')
                      setOfficerNote(g.officer_note || '')
                    }}
                    className="shrink-0 text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Review Modal */}
      {reviewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setReviewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">Review Grievance</h3>
            <p className="text-xs font-mono text-gray-400 mb-3">{reviewing.tracking_id}</p>
            <p className="text-sm text-gray-700 mb-4 p-3 bg-gray-50 rounded-xl">{reviewing.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-blue-50 rounded-xl">
              <div><b>Category:</b> {reviewing.category}</div>
              <div><b>Priority:</b> {reviewing.priority}</div>
              <div><b>Sentiment:</b> {reviewing.sentiment}</div>
              <div><b>Department:</b> {reviewing.department}</div>
              <div><b>Location:</b> {reviewing.district}, {reviewing.state}</div>
              <div><b>Due in:</b> {reviewing.action_within}</div>
              <div className="col-span-2 text-blue-800"><b>AI Advice:</b> {reviewing.tone_advice}</div>
            </div>

            <label className="block text-sm font-medium mb-1">Update Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
              className="w-full border rounded-xl p-2 mb-3 text-sm">
              {['Submitted', 'Under Review', 'Resolved', 'Rejected'].map(s =>
                <option key={s}>{s}</option>
              )}
            </select>

            <label className="block text-sm font-medium mb-1">Remark for Citizen</label>
            <textarea placeholder="Describe how the issue is being addressed..."
              className="w-full border rounded-xl p-2 text-sm mb-4" rows={2}
              value={remark} onChange={e => setRemark(e.target.value)} />

            <div className="border-t pt-4 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Assign Field Officer</p>
              <div className="space-y-2">
                <input placeholder="Officer full name"
                  className="w-full border rounded-xl p-2 text-sm bg-gray-50"
                  value={officerName} onChange={e => setOfficerName(e.target.value)} />
                <input placeholder="Officer phone number"
                  className="w-full border rounded-xl p-2 text-sm bg-gray-50"
                  value={officerPhone} onChange={e => setOfficerPhone(e.target.value)} />
                <input placeholder="Note e.g. Will visit on Monday 10am"
                  className="w-full border rounded-xl p-2 text-sm bg-gray-50"
                  value={officerNote} onChange={e => setOfficerNote(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={updateStatus}
                className="flex-1 bg-blue-800 text-white py-2 rounded-xl font-medium hover:bg-blue-700">
                Update & Save
              </button>
              <button onClick={() => setReviewing(null)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAllGrievances