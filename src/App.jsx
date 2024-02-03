import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './pages/Auth';
import Account from './pages/Account';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuBar from './components/MenuBar';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import PhotoPage from './pages/PhotoPage';
// import Analytics from './Analytics';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Router>
      <div className="App">
        {/* <Analytics /> */}
        <MenuBar /> {/* Use the MenuBar component */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={ <BlogPage />} />
          <Route path="/photography" element={<PhotoPage />} />
          <Route path="/account" element={!session ? <Auth /> : <Account key={session?.user?.id} session={session} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;