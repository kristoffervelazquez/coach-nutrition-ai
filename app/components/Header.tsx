"use client"
import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  username?: string
}

export default function Header({ username }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/signup')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h1>My todos</h1>
      <div>
        <span>Welcome, {username}!</span>
        <button 
          style={{ marginLeft: '10px' }}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}