import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;