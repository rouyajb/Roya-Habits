import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                Important: This app is NOT a medical device and does NOT provide medical advice.
              </AlertDescription>
            </Alert>

            <div className="prose prose-sm max-w-none space-y-4">
              <h3 className="text-lg font-semibold">Period Tracker Information</h3>
              <p>
                The period tracking feature in Roya is provided for informational and educational purposes only. 
                It is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment.
              </p>

              <h3 className="text-lg font-semibold">No Medical Advice</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>The period predictions and phase information are estimates based on your input data</li>
                <li>Cycle predictions may not be accurate for everyone, especially those with irregular cycles</li>
                <li>The "what to expect" content is general information and may not apply to your specific situation</li>
                <li>This app cannot diagnose medical conditions or predict fertility with certainty</li>
              </ul>

              <h3 className="text-lg font-semibold">Consult Healthcare Professionals</h3>
              <p>
                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Menstrual health concerns</li>
                <li>Irregular periods or unusual symptoms</li>
                <li>Contraception or family planning</li>
                <li>Pregnancy or fertility</li>
                <li>Any medical condition or treatment</li>
              </ul>

              <h3 className="text-lg font-semibold">Not for Contraception</h3>
              <p className="font-semibold text-destructive">
                DO NOT use this app as a method of birth control or contraception. 
                The predictions are not reliable enough to prevent pregnancy.
              </p>

              <h3 className="text-lg font-semibold">Emergency Situations</h3>
              <p>
                If you experience severe pain, heavy bleeding, or other concerning symptoms, 
                seek immediate medical attention. Do not rely on this app in emergency situations.
              </p>

              <h3 className="text-lg font-semibold">No Liability</h3>
              <p>
                The developers of Roya are not responsible for any decisions you make based on the information 
                provided by this app. Use of the period tracking feature is entirely at your own risk.
              </p>

              <h3 className="text-lg font-semibold">Data Accuracy</h3>
              <p>
                The accuracy of predictions depends on the accuracy of the data you provide. 
                We cannot guarantee the accuracy of any predictions or information displayed in the app.
              </p>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  By using the period tracking feature, you acknowledge that you have read and understood this disclaimer 
                  and agree to use the feature for informational purposes only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;