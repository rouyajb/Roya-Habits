import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Impressum (Legal Notice)</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <p className="text-muted-foreground italic">
              [Template - Replace with your actual business information]
            </p>

            <div>
              <h3 className="text-lg font-semibold">Information according to § 5 TMG</h3>
              <p>
                [Business Name]<br />
                [Street Address]<br />
                [Postal Code, City]<br />
                [Country]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Contact</h3>
              <p>
                Email: [your-email@example.com]<br />
                Phone: [+49 XXX XXXXXXX]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Represented by</h3>
              <p>[Full Name of Representative]</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Register Entry</h3>
              <p>
                Entry in: [Trade Register / Commercial Register]<br />
                Register Number: [Registration Number]<br />
                Register Court: [Court Name]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">VAT ID</h3>
              <p>
                VAT identification number according to §27a Umsatzsteuergesetz:<br />
                [DE XXXXXXXXX]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Responsible for Content</h3>
              <p>
                [Full Name]<br />
                [Address]
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Dispute Resolution</h3>
              <p>
                The European Commission provides a platform for online dispute resolution (OS): 
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Impressum;