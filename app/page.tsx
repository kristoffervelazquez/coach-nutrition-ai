import { redirect } from 'next/navigation'
import { GetAuthCurrentUserServer, runWithAmplifyServerContext } from '@/utils/utils'
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { cookies } from 'next/headers'
import Header from './components/Header'
import "@aws-amplify/ui-react/styles.css";



const client = generateClient<Schema>();

async function getTodos() {
  try {
    const todos = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (context: any) => {
        const { data } = await client.models.Item.list()
        console.log(data)
        return data
      }
    })
    return todos 
  } catch (error) {
    console.error('Error fetching todos:', error)
    return []
  }
}

export default async function App() {
  // Verificar autenticación en el servidor
  const user = await GetAuthCurrentUserServer()
  const todos = await getTodos()



  // Si no está autenticado, redirigir al signup
  if (!user) {
    redirect('/signup')
  }

  // Obtener todos del servidor
  return (
    <main>
      <Header username={user.signInDetails?.loginId || 'User'} />

      <ul>
        {todos.map((todo) => (
          <li key={todo.userId}>{todo.type}</li>
        ))}
      </ul>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
