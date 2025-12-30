import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Subscription, Entitlements } from '@/types';
import { getSubscriptionService } from '@/services/ServiceFactory';

interface SubscriptionContextType {
  subscription: Subscription | null;
  entitlements: Entitlements | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const subscriptionService = getSubscriptionService();
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setEntitlements(null);
      setLoading(false);
      return;
    }

    try {
      const [sub, ent] = await Promise.all([
        subscriptionService.getSubscription(user.id),
        subscriptionService.getEntitlements(user.id),
      ]);

      setSubscription(sub);
      setEntitlements(ent);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        entitlements,
        loading,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};