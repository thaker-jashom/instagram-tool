import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import FetchInfluencers from './pages/FetchInfluencers';
import SavedSearches from './pages/SavedSearches';
import SavedInfluencers from './pages/SavedInfluencers';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/fetch-influencers" element={<FetchInfluencers />} />
        <Route path="/saved-searches" element={<SavedSearches />} />
        <Route path="/saved-influencers" element={<SavedInfluencers />} />
      </Route>

      <Route path="/" element={<Navigate to={localStorage.getItem('token') ? "/fetch-influencers" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/fetch-influencers" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
