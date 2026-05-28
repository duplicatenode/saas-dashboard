import { useState } from 'react'
import { supabase } from './supabase'

const CATEGORIES = ['Food', 'Rent', 'Salary', 'Freelance', 'Shopping', 'Transport', 'Bills', 'Other']

function AddTransaction({ session, onClose, onAdded }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [type, setType] = useState('expense')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      setError('Please enter a valid amount')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.from('transactions').insert([{
      amount: parseFloat(amount),
      category,
      type,
      notes,
      date,
      org_id: session.user.id
    }])

    if (error) {
      setError(error.message)
    } else {
      onAdded()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0,0,0,0.7)'}}>
      <div className="w-full max-w-md rounded-2xl p-6" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-lg">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        {error && (
          <div className="text-red-400 text-sm p-3 rounded-lg mb-4" style={{background: '#2d0a0a'}}>
            {error}
          </div>
        )}

        {/* Type toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('expense')}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={type === 'expense' ? {background: '#2d0a0a', color: '#f87171', border: '1px solid #7f1d1d'} : {background: '#111e35', color: '#4a6fa5', border: '1px solid #1e2d4a'}}
          >
            ↓ Expense
          </button>
          <button
            onClick={() => setType('income')}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={type === 'income' ? {background: '#052e16', color: '#4ade80', border: '1px solid #14532d'} : {background: '#111e35', color: '#4a6fa5', border: '1px solid #1e2d4a'}}
          >
            ↑ Income
          </button>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-xs font-medium uppercase tracking-widest mb-2 block" style={{color: '#4a6fa5'}}>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
            style={{background: '#111e35', border: '1px solid #1e2d4a'}}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="text-xs font-medium uppercase tracking-widest mb-2 block" style={{color: '#4a6fa5'}}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
            style={{background: '#111e35', border: '1px solid #1e2d4a'}}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="text-xs font-medium uppercase tracking-widest mb-2 block" style={{color: '#4a6fa5'}}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
            style={{background: '#111e35', border: '1px solid #1e2d4a'}}
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-xs font-medium uppercase tracking-widest mb-2 block" style={{color: '#4a6fa5'}}>Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What was this for?"
            className="w-full rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
            style={{background: '#111e35', border: '1px solid #1e2d4a'}}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50"
          style={{background: '#3b82f6'}}
        >
          {loading ? 'Saving...' : 'Add Transaction'}
        </button>
      </div>
    </div>
  )
}

export default AddTransaction