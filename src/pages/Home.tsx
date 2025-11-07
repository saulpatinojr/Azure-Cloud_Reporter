import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import HeroCard from '../components/HeroCard';
const UploadModal = React.lazy(() => import('../components/UploadModal'));
import { submitUpload } from '../services/api/ingestion';

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <>
      <HeroCard onOpenUpload={() => setOpen(true)} />
      <Suspense fallback={null}>
        <UploadModal
          open={open}
          onClose={() => setOpen(false)}
          onUpload={async (file) => {
            await submitUpload(file);
          }}
        />
      </Suspense>
    </>
  );
}
