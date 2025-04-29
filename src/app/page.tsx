import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona para o login
  redirect('/login');
  
  return null;
}