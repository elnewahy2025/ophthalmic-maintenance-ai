import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <Component {...pageProps} session={session} />
    </Layout>
  );
}

export default MyApp;