import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Goals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Goals</h1>
        <p className="text-muted-foreground mt-1">Plan your 3-month, 6-month, and 1-year goals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>Track your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;