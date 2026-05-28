import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import AddTransaction from './AddTransaction'
import Charts from './Charts'

function Dashboard({ session }) {
  const [showAdd, setShowAdd] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [filterCategory, setFilterCategory] = useState('All')

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('org_id', session.user.id)
      .order('date', { ascending: false })
    if (data) setTransactions(data)
  }

  useEffect(() => { fetchTransactions() }, [])

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const handleDelete = async (id) => {
    await supabase.from('transactions').delete().eq('id', id)
    fetchTransactions()
  }

  const handleExport = () => {
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes']
  const rows = transactions.map(t => [t.date, t.category, t.type, t.amount, t.notes || ''])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
}

  const handleLogout = async () => { await supabase.auth.signOut() }

  const categories = ['All', ...new Set(transactions.map(t => t.category))]
  const filtered = filterCategory === 'All' ? transactions : transactions.filter(t => t.category === filterCategory)

  return (
    <div className="min-h-screen flex" style={{background: '#0a0f1e', fontFamily: 'Inter, sans-serif'}}>

      {showAdd && <AddTransaction session={session} onClose={() => setShowAdd(false)} onAdded={fetchTransactions} />}

      {/* Sidebar */}
      <div className="w-64 flex flex-col p-6 border-r" style={{background: '#0d1526', borderColor: '#1e2d4a'}}>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{background: '#3b82f6'}}>₹</div>
            <span className="text-white font-semibold text-lg">FinanceOS</span>
          </div>
          <p className="text-xs ml-9" style={{color: '#4a6fa5'}}>Analytics Dashboard</p>
        </div>

        <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{color: '#4a6fa5'}}>Menu</p>
        <nav className="flex flex-col gap-1">
          <button className="text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3" style={{background: '#1a2f52', color: '#60a5fa'}}>
            <span>▦</span> Dashboard
          </button>
          <button className="text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-3" style={{color: '#4a6fa5'}}>
            <span>↕</span> Transactions
          </button>
          <button className="text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-3" style={{color: '#4a6fa5'}}>
            <span>◎</span> Reports
          </button>
          <button className="text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-3" style={{color: '#4a6fa5'}}>
            <span>⚙</span> Settings
          </button>
        </nav>

        <div className="mt-auto">
          <div className="rounded-xl p-4 mb-4" style={{background: '#111e35', border: '1px solid #1e2d4a'}}>
            <p className="text-xs mb-1" style={{color: '#4a6fa5'}}>Logged in as</p>
            <p className="text-white text-xs font-medium truncate">{session.user.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-3" style={{color: '#ef4444'}}>
            <span>→</span> Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-white text-2xl font-semibold">Good morning 👋</h2>
            <p className="text-sm mt-1" style={{color: '#4a6fa5'}}>Here's your financial overview</p>
          </div>
          <div className="flex gap-3">
  <button
    onClick={handleExport}
    className="px-4 py-2 rounded-lg text-sm font-medium"
    style={{background: '#111e35', color: '#60a5fa', border: '1px solid #1e2d4a'}}
  >
    ↓ Export CSV
  </button>
  <button
    onClick={() => setShowAdd(true)}
    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
    style={{background: '#3b82f6'}}
  >
    + Add Transaction
  </button>
</div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-5" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-widest" style={{color: '#4a6fa5'}}>Total Balance</p>
              <span className="text-xs px-2 py-1 rounded-full" style={{background: '#1a2f52', color: '#60a5fa'}}>All time</span>
            </div>
            <p className="text-white text-3xl font-bold">₹{balance.toLocaleString()}</p>
            <p className="text-xs mt-2" style={{color: '#4a6fa5'}}>{transactions.length} transactions</p>
          </div>

          <div className="rounded-xl p-5" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-widest" style={{color: '#4a6fa5'}}>Total Income</p>
              <span className="text-xs px-2 py-1 rounded-full" style={{background: '#052e16', color: '#4ade80'}}>↑ income</span>
            </div>
            <p className="text-3xl font-bold" style={{color: '#4ade80'}}>₹{totalIncome.toLocaleString()}</p>
            <p className="text-xs mt-2" style={{color: '#4a6fa5'}}>{transactions.filter(t => t.type === 'income').length} entries</p>
          </div>

          <div className="rounded-xl p-5" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-widest" style={{color: '#4a6fa5'}}>Total Expenses</p>
              <span className="text-xs px-2 py-1 rounded-full" style={{background: '#2d0a0a', color: '#f87171'}}>↓ expense</span>
            </div>
            <p className="text-3xl font-bold" style={{color: '#f87171'}}>₹{totalExpense.toLocaleString()}</p>
            <p className="text-xs mt-2" style={{color: '#4a6fa5'}}>{transactions.filter(t => t.type === 'expense').length} entries</p>
          </div>
        </div>
        <Charts transactions={transactions} />
        {/* Transactions list */}
        <div className="rounded-xl p-6" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">Recent Transactions</p>
            <button className="text-xs" style={{color: '#60a5fa'}}>View all →</button>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className="text-xs px-3 py-1.5 rounded-full transition-colors"
                style={filterCategory === c
                  ? {background: '#3b82f6', color: '#fff'}
                  : {background: '#111e35', color: '#4a6fa5', border: '1px solid #1e2d4a'}}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" style={{color: '#4a6fa5'}}>
              <div className="text-4xl mb-3">₹</div>
              <p className="text-sm font-medium text-white mb-1">No transactions yet</p>
              <p className="text-xs">Click "+ Add Transaction" to get started</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl" style={{background: '#111e35', border: '1px solid #1e2d4a'}}>
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{background: t.type === 'income' ? '#052e16' : '#2d0a0a'}}>
                      {t.type === 'income' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.category}</p>
                      <p className="text-xs" style={{color: '#4a6fa5'}}>{t.notes || 'No notes'} · {t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-sm" style={{color: t.type === 'income' ? '#4ade80' : '#f87171'}}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{color: '#ef4444', background: '#2d0a0a'}}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard