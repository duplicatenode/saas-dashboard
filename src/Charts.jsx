import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#3b82f6', '#4ade80', '#f87171', '#facc15', '#a78bfa', '#fb923c', '#34d399', '#f472b6']

function Charts({ transactions }) {
  // Monthly bar chart data
  const monthlyData = {}
  transactions.forEach(t => {
    const month = t.date?.slice(0, 7)
    if (!month) return
    if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') monthlyData[month].income += t.amount
    else monthlyData[month].expense += t.amount
  })
  const barData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6)

  // Pie chart data by category
  const categoryData = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    if (!categoryData[t.category]) categoryData[t.category] = { name: t.category, value: 0 }
    categoryData[t.category].value += t.amount
  })
  const pieData = Object.values(categoryData)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl p-3 text-xs" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{color: p.color}}>
              {p.name}: ₹{p.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (transactions.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      
      {/* Bar chart */}
      <div className="rounded-xl p-6" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
        <p className="text-white font-semibold mb-1">Monthly Overview</p>
        <p className="text-xs mb-6" style={{color: '#4a6fa5'}}>Income vs Expenses</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barGap={4}>
            <XAxis dataKey="month" tick={{fill: '#4a6fa5', fontSize: 11}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#4a6fa5', fontSize: 11}} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div className="rounded-xl p-6" style={{background: '#0d1526', border: '1px solid #1e2d4a'}}>
        <p className="text-white font-semibold mb-1">Spending by Category</p>
        <p className="text-xs mb-6" style={{color: '#4a6fa5'}}>Expenses breakdown</p>
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-48" style={{color: '#4a6fa5'}}>
            <p className="text-xs">No expense data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: '11px', color: '#4a6fa5'}} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  )
}

export default Charts