import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Welcome to Roya! 🌙</CardTitle>
          <CardDescription className="text-center">
            Let's set up your habit tracking journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Onboarding flow coming soon...
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/today')} 
            className="w-full"
          >
            Skip to App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;