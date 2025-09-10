import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, ArrowLeft, CheckSquare, FileDown, Tag, Calendar } from 'lucide-react';

const mockDoc = {
  id: '1',
  title: 'Maintenance Circular: Alstom Trainset Axle Inspection',
  date: '2025-09-09T19:30:00',
  type: 'Maintenance',
  priority: 'high' as const,
  source: 'Maximo Exports',
  docId: 'DOC001',
  aiSummary:
    'A comprehensive maintenance directive has been issued requiring immediate ultrasonic inspection of all Alstom series-8 trainset axles. This action follows a critical safety alert from Delhi Metro regarding potential fatigue cracks in similar rolling stock. The inspection must be completed within 5 working days to ensure passenger safety and operational continuity.',
  actionItems: [
    'Schedule ultrasonic tests for all 12 series-8 trainsets by Sept 15, 2025',
    'Submit compliance report to Rolling Stock Manager by Sept 18, 2025',
    'Coordinate with Operations team for minimum service disruption',
  ],
  entities: [
    'Alstom series-8',
    'Ultrasonic Inspection',
    'Fatigue Crack',
    'Safety Protocol',
  ],
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-green-100 text-green-800';
  }
};

const DocumentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app, fetch by id
  const doc = mockDoc;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-lg font-semibold">Document Details</h1>
          </div>
          <div>
            <Badge className={`text-xs ${getPriorityColor(doc.priority)}`}>{doc.priority.toUpperCase()}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: AI Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">{doc.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(doc.date).toLocaleString()}
                <span>•</span>
                {doc.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-base font-semibold mb-2">AI Analysis Summary</h3>
                <p className="text-sm leading-relaxed text-gray-700">{doc.aiSummary}</p>
              </section>

              <Separator />

              <section>
                <h3 className="text-base font-semibold mb-3">Action Items</h3>
                <div className="space-y-2">
                  {doc.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-base font-semibold mb-3">Key Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {doc.entities.map((e) => (
                    <Badge key={e} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Tag className="h-3 w-3 mr-1" />
                      {e}
                    </Badge>
                  ))}
                </div>
              </section>

              <Separator />

              <section className="flex flex-col sm:flex-row gap-3">
                <Button className="sm:w-auto w-full">
                  <Download className="h-4 w-4 mr-2" /> Download Original
                </Button>
                <Button variant="outline" className="sm:w-auto w-full">
                  <FileDown className="h-4 w-4 mr-2" /> View PDF
                </Button>
              </section>
            </CardContent>
          </Card>

          {/* Right: Source panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Original Source Document</CardTitle>
              <CardDescription>Original document would be displayed here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400">
                PDF/Document Viewer
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Source:</span><span>{doc.source}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type:</span><span>{doc.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Received:</span><span>{new Date(doc.date).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Document ID:</span><span>{doc.docId}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DocumentDetail;
