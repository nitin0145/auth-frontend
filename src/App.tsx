import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import Authentication from './components/Authentication/Authentication';
import Dashboard from './components/Dashboard/dashboard';
import { Notifications  } from '@mantine/notifications';
function App() {
  return (
    <MantineProvider> {/* Wrap your entire app with MantineProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/signup" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
