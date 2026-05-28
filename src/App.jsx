import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div>
      {session ? <Dashboard session={session} /> : <Login />}
    </div>
  )
}

export default App