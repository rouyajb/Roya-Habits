import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <p className="text-muted-foreground italic">
              [Template - Replace with your actual terms of service. Consult with a legal professional.]
            </p>

            <div>
              <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
              <p>
                By accessing and using Roya ("the Service"), you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">2. Description of Service</h3>
              <p>
                Roya is a habit tracking, mood journaling, and personal development application. The Service includes 
                features for tracking habits, logging mood and journal entries, managing goals, period tracking, 
                and prayer time tracking (optional).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">3. User Accounts</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 16 years old to create an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">4. Subscription Plans</h3>
              <p><strong>FREE Plan:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Up to 3 habits</li>
                <li>Last 7 days of journal entries</li>
                <li>Limited goals and milestones</li>
                <li>Basic features only</li>
              </ul>
              <p className="mt-4"><strong>PRO Plan (Monthly/Yearly):</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Unlimited habits and goals</li>
                <li>Full journal history</li>
                <li>Period tracker with predictions</li>
                <li>Advanced prayer time features</li>
                <li>Data export and weekly reviews</li>
                <li>Premium themes and customization</li>
              </ul>
              <p className="mt-4"><strong>LIFETIME Plan:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>One-time payment for lifetime access to all PRO features</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">5. Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscription fees are charged in advance on a monthly or yearly basis</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Prices are subject to change with 30 days notice</li>
                <li>You can cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
                <li>No refunds for partial months or unused time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">6. Refund Policy</h3>
              <p>
                We offer a 7-day money-back guarantee for new subscriptions. To request a refund within this period, 
                contact our support team. Refunds are not available after 7 days or for LIFETIME purchases after 30 days.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">7. Acceptable Use</h3>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful code or malware</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Share your account with others</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">8. Intellectual Property</h3>
              <p>
                The Service and its original content, features, and functionality are owned by [Your Company Name] 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">9. User Content</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain all rights to the content you create in the app (habits, journal entries, etc.)</li>
                <li>You grant us a license to store and process your content to provide the Service</li>
                <li>You are responsible for the content you create</li>
                <li>We do not claim ownership of your personal data</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">10. Disclaimer of Warranties</h3>
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">11. Medical Disclaimer</h3>
              <p>
                The period tracker and health-related features are for informational purposes only and do not 
                constitute medical advice. See our{' '}
                <Link to="/legal/medical-disclaimer" className="text-primary hover:underline">
                  Medical Disclaimer
                </Link>{' '}
                for full details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">12. Limitation of Liability</h3>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">13. Termination</h3>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for any reason, 
                including breach of these Terms. You may terminate your account at any time through the app settings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">14. Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Germany, 
                without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">15. Changes to Terms</h3>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of any changes 
                by posting the new Terms on this page. Your continued use of the Service after changes 
                constitutes acceptance of the new Terms.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">16. Contact Information</h3>
              <p>
                For questions about these Terms, please contact us at:<br />
                Email: [support@yourdomain.com]<br />
                Address: [Your business address]
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;