import React, { useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

export function ReviewPopup() {
  const [show, setShow] = useState(false)
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  const currentUser = localStorage.getItem('ugp_current_user')
  const userEmail = currentUser ? JSON.parse(currentUser).email : ''
  const userName = localStorage.getItem('ugp_user_name') || ''
  const userRole = currentUser ? JSON.parse(currentUser).role : 'citizen'

  useEffect(() => {
    if (!userEmail || userRole === 'admin') return

    // Only show once per session
    const shownThisSession = sessionStorage.getItem('review_popup_shown')
    if (shownThisSession) return

    fetch(`${API}/grievances`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        const pending = list.filter((g: any) =>
          (g.email === userEmail ||
           g.name?.toLowerCase().trim() === userName?.toLowerCase().trim()) &&
          g.status === 'Resolved' &&
          !g.rating
        )
        if (pending.length > 0) {
          setCount(pending.length)
          setTimeout(() => setShow(true), 1500)
          sessionStorage.setItem('review_popup_shown', 'true')
        }
      })
      .catch(() => {})
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-bounce-in">
        {/* Close */}
        <button onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-yellow-400 fill-yellow-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            You have {count} pending review{count > 1 ? 's' : ''}!
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {count > 1
              ? `${count} of your grievances have been resolved. Share your feedback to help us improve.`
              : 'One of your grievances has been resolved. How did we do?'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { setShow(false); navigate('/dashboard/pending-reviews') }}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-2.5 rounded-xl font-semibold text-sm">
              Rate Now
            </button>
            <button onClick={() => setShow(false)}
              className="px-4 py-2.5 border rounded-xl text-sm text-gray-500 hover:bg-gray-50">
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}