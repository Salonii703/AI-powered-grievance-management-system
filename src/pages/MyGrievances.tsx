// import React, { useEffect, useState } from "react";

// const MyGrievances = () => {
//   const [data, setData] = useState([]);

//   // ⚠️ Replace with actual logged-in user later
//   const userContact = localStorage.getItem("contact");

//   useEffect(() => {
//     if (!userContact) return;

//     fetch(`http://localhost:8000/api/my-grievances?contact=${userContact}`)
//       .then((res) => res.json())
//       .then((resData) => setData(resData))
//       .catch((err) => console.error(err));
//   }, [userContact]);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">My Grievances</h1>

//       {data.length === 0 ? (
//         <p>No grievances found.</p>
//       ) : (
//         data.map((item: any, index) => (
//           <div key={index} className="bg-white p-4 mb-4 shadow rounded">
//             <h2 className="font-bold">{item.trackingId}</h2>
//             <p>{item.text}</p>

//             <p>
//               📍 {item.city}, {item.area}
//             </p>

//             <p>Status: {item.status}</p>

//             {item.image && (
//               <img
//                 src={`http://localhost:5000/uploads/${item.image}`}
//                 className="mt-2 w-full max-h-48 object-cover"
//               />
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyGrievances;



import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const API = 'http://localhost:8000'

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

const MyGrievances = () => {
  const [grievances, setGrievances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trackId, setTrackId] = useState('')
  const [trackResult, setTrackResult] = useState<any>(null)
  const [reviewing, setReviewing] = useState<any>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const userName = localStorage.getItem('ugp_user_name') || ''
  const currentUser = localStorage.getItem('ugp_current_user')
  const userEmail = currentUser ? JSON.parse(currentUser).email : ''

   function load() {
    fetch(`${API}/grievances`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        const mine = list
          .filter((g: any) =>
            g.email === userEmail ||
            g.name?.toLowerCase().trim() === userName?.toLowerCase().trim()
          )
          .sort((a: any, b: any) => {
            const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 }
            return (order[a.priority] ?? 3) - (order[b.priority] ?? 3)
          })
        setGrievances(mine)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function track() {
    if (!trackId.trim()) return
    const res = await fetch(`${API}/track/${trackId.trim().toUpperCase()}`)
    setTrackResult(await res.json())
  }

  async function submitReview() {
    if (rating === 0) return
    await fetch(`${API}/submit-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tracking_id: reviewing.tracking_id,
        rating,
        feedback
      })
    })
    setSubmitted(true)
    load()
    setTimeout(() => {
      setReviewing(null)
      setRating(0)
      setFeedback('')
      setSubmitted(false)
    }, 2000)
  }

  const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Grievances</h1>
        <p className="text-gray-500 text-sm mt-1">All grievances submitted by you, sorted by priority</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: grievances.length, color: 'bg-blue-50 text-blue-800' },
          { label: 'Pending', value: grievances.filter(g => g.status === 'Submitted').length, color: 'bg-yellow-50 text-yellow-800' },
          { label: 'Under Review', value: grievances.filter(g => g.status === 'Under Review').length, color: 'bg-purple-50 text-purple-800' },
          { label: 'Resolved', value: grievances.filter(g => g.status === 'Resolved').length, color: 'bg-green-50 text-green-800' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Track by ID */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h2 className="font-semibold text-gray-700 mb-3">Track by Grievance ID</h2>
        <div className="flex gap-2">
          <input placeholder="Enter tracking ID e.g. GR-XXXXXXXX"
            className="flex-1 border border-gray-200 rounded-xl p-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={trackId} onChange={e => setTrackId(e.target.value.toUpperCase())} />
          <button onClick={track}
            className="bg-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-900">
            Track
          </button>
        </div>
        {trackResult && !trackResult.error && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold">{trackResult.tracking_id}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[trackResult.status] || 'bg-gray-100'}`}>
                {trackResult.status}
              </span>
            </div>
            <p className="text-sm text-gray-700">{trackResult.description}</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
              <div>Category: <b>{trackResult.category}</b></div>
              <div>Priority: <b>{trackResult.priority}</b></div>
              <div>Department: <b>{trackResult.department}</b></div>
              <div>Due in: <b>{trackResult.action_within}</b></div>
              <div className="col-span-2">Office: <b>{trackResult.nearest_office}</b></div>
            </div>
            {trackResult.remarks?.length > 0 && (
              <div className="mt-2 p-3 bg-white rounded-lg border text-sm">
                <p className="font-medium mb-1 text-gray-700">Admin remarks:</p>
                {trackResult.remarks.map((r: string, i: number) =>
                  <p key={i} className="text-gray-600">• {r}</p>
                )}
              </div>
            )}
          </div>
        )}
        {trackResult?.error && (
          <p className="mt-3 text-sm text-red-500">Tracking ID not found.</p>
        )}
      </div>

      {/* Grievances list */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-gray-700">All Submitted Grievances</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : grievances.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>You haven't submitted any grievances yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {grievances.map(g => (
              <div key={g.tracking_id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-400">{g.tracking_id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[g.priority] || 'bg-gray-100'}`}>
                        {g.priority}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[g.status] || 'bg-gray-100'}`}>
                        {g.status}
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {g.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">{g.description}</p>
                    <div className="text-xs text-gray-400 space-x-3">
                      <span>📍 {g.district || g.state}</span>
                      <span>🏢 {g.nearest_office}</span>
                      <span>⏱ Due in {g.action_within}</span>
                    </div>

                    {/* Show existing rating */}
                    {g.rating && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={14}
                              className={s <= g.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{g.feedback || 'No feedback'}</span>
                      </div>
                    )}

                    {g.remarks?.length > 0 && (
                      <div className="mt-2 p-2.5 bg-blue-50 rounded-lg text-xs text-blue-800">
                        <b>Admin:</b> {g.remarks[g.remarks.length - 1]}
                      </div>
                    )}
                  </div>

                  {/* Review button — only for resolved and not yet rated */}
                  {g.status === 'Resolved' && !g.rating && (
                    <button
                      onClick={() => { setReviewing(g); setRating(0); setFeedback('') }}
                      className="shrink-0 flex items-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      Rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {reviewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setReviewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {submitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-green-700 mb-1">Thank you for your feedback!</h3>
                <p className="text-gray-500 text-sm">Your rating has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-1">Rate Resolution</h3>
                <p className="text-xs font-mono text-gray-400 mb-4">{reviewing.tracking_id}</p>
                <p className="text-sm text-gray-600 mb-6 p-3 bg-gray-50 rounded-xl">{reviewing.description}</p>

                <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                  How satisfied are you with the resolution?
                </p>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110">
                      <Star size={36}
                        className={s <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'} />
                    </button>
                  ))}
                </div>

                {/* Star label */}
                <p className="text-center text-sm font-medium text-yellow-600 mb-4 h-5">
                  {STAR_LABELS[hoverRating || rating]}
                </p>

                <textarea
                  placeholder="Share your experience (optional)..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)} />

                <div className="flex gap-2">
                  <button onClick={submitReview} disabled={rating === 0}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition-colors">
                    Submit Rating
                  </button>
                  <button onClick={() => setReviewing(null)}
                    className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyGrievances