import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Cookie Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <p className="text-muted-foreground italic">
              [Template - Replace with your actual cookie policy based on cookies you actually use.]
            </p>

            <div>
              <h3 className="text-lg font-semibold">1. What Are Cookies</h3>
              <p>
                Cookies are small text files that are stored on your device when you visit a website or use an application. 
                They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">2. Types of Cookies We Use</h3>
              
              <h4 className="font-semibold mt-4">Essential Cookies (Always Active)</h4>
              <p>
                These cookies are necessary for the app to function and cannot be disabled. They include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Authentication:</strong> Keeps you signed in to your account</li>
                <li><strong>Session Management:</strong> Maintains your session state</li>
                <li><strong>Security:</strong> Protects against unauthorized access</li>
                <li><strong>Preferences:</strong> Remembers your theme and language settings</li>
              </ul>

              <h4 className="font-semibold mt-4">Analytics Cookies (Optional - Requires Consent)</h4>
              <p>
                These cookies help us understand how you use the app so we can improve it:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Analytics:</strong> Tracks which features you use</li>
                <li><strong>Performance Monitoring:</strong> Identifies technical issues</li>
                <li><strong>User Behavior:</strong> Helps us improve user experience</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Note: We only use privacy-friendly analytics that do not track you across websites.
              </p>

              <h4 className="font-semibold mt-4">Marketing Cookies (Optional - Requires Consent)</h4>
              <p>
                Currently, we do not use marketing cookies. If we add them in the future, we will update this policy 
                and request your consent.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">3. Local Storage</h3>
              <p>
                In addition to cookies, we use browser local storage to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Store your app data locally (habits, journal entries, etc.)</li>
                <li>Cache data for offline functionality</li>
                <li>Remember your preferences and settings</li>
                <li>Store your consent choices</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">4. Managing Cookies</h3>
              <p>
                You can manage your cookie preferences at any time:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>In-App:</strong> Click "Manage Cookie Preferences" in the footer</li>
                <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
                <li><strong>Do Not Track:</strong> We respect the Do Not Track browser setting</li>
              </ul>
              <p className="mt-2">
                Note: Blocking essential cookies will prevent the app from functioning properly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">5. Third-Party Cookies</h3>
              <p>
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe:</strong> For payment processing (essential)</li>
                <li><strong>Analytics Provider:</strong> [Your analytics service] (optional, requires consent)</li>
              </ul>
              <p className="mt-2">
                These third parties have their own privacy policies. We recommend reviewing them.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">6. Cookie Lifespan</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain until expiry date or manual deletion</li>
                <li><strong>Authentication:</strong> 30 days</li>
                <li><strong>Preferences:</strong> 1 year</li>
                <li><strong>Analytics Consent:</strong> 1 year</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">7. Your Consent</h3>
              <p>
                When you first visit our app, we show you a cookie consent banner. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accept All:</strong> Consent to all cookies including analytics</li>
                <li><strong>Reject All:</strong> Only essential cookies will be used</li>
                <li><strong>Customize:</strong> Choose which types of cookies to allow</li>
              </ul>
              <p className="mt-2">
                You can change your preferences at any time through the app settings or footer link.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">8. Updates to This Policy</h3>
              <p>
                We may update this Cookie Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">9. Contact Us</h3>
              <p>
                If you have questions about our use of cookies, please contact us at:<br />
                Email: [privacy@yourdomain.com]<br />
                Address: [Your business address]
              </p>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                For more information about how we handle your personal data, please see our{' '}
                <Link to="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;