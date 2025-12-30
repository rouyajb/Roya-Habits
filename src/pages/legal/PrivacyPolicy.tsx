import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <p className="text-muted-foreground italic">
              [Template - Replace with your actual privacy policy. Consult with a legal professional for GDPR compliance.]
            </p>

            <div>
              <h3 className="text-lg font-semibold">1. Introduction</h3>
              <p>
                Welcome to Roya ("we," "our," or "us"). We are committed to protecting your personal information 
                and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our application.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">2. Information We Collect</h3>
              <p>We collect information that you provide directly to us:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address, name, password (encrypted)</li>
                <li><strong>Habit Data:</strong> Habit names, completion logs, streaks, identity statements</li>
                <li><strong>Mood & Journal Data:</strong> Mood ratings, emoji selections, tags, journal entries</li>
                <li><strong>Period Tracker Data:</strong> Cycle information, flow levels, symptoms (if enabled)</li>
                <li><strong>Prayer Data:</strong> Prayer times, completion logs, location data (if Muslim mode enabled)</li>
                <li><strong>Goals Data:</strong> Goal titles, milestones, progress information</li>
                <li><strong>Usage Data:</strong> App interactions, feature usage, analytics events (with consent)</li>
                <li><strong>Payment Information:</strong> Processed by Stripe; we store subscription status only</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">3. How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain the app functionality</li>
                <li>Calculate streaks, predictions, and insights</li>
                <li>Send reminders and notifications (with your permission)</li>
                <li>Process payments and manage subscriptions</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about updates and support</li>
                <li>Analyze usage patterns (only with your consent)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">4. Data Retention</h3>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide 
                you services. You can request deletion of your account and all associated data at any time through 
                the app settings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">5. Third-Party Services</h3>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> Database and authentication (EU servers, GDPR compliant)</li>
                <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
                <li><strong>Email Provider:</strong> [Your email service] for transactional emails</li>
                <li><strong>Analytics:</strong> [Your analytics service] (only with consent)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">6. Your Rights (GDPR)</h3>
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">7. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information, 
                including encryption at rest and in transit, secure authentication, and regular security audits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">8. Cookies and Tracking</h3>
              <p>
                We use essential cookies for app functionality and optional cookies for analytics (only with your consent). 
                See our <Link to="/legal/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">9. Children's Privacy</h3>
              <p>
                Our service is not intended for children under 16. We do not knowingly collect personal information 
                from children under 16.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">10. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">11. Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <p>
                Email: [privacy@yourdomain.com]<br />
                Address: [Your business address]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">12. Data Protection Officer</h3>
              <p>
                For GDPR-related inquiries, you can contact our Data Protection Officer at:<br />
                Email: [dpo@yourdomain.com]
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;