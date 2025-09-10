import React, { useState, useMemo } from 'react';
import { 
  Search, Bell, FileText, Mail, Database, Download, CheckSquare, 
  ThumbsUp, ThumbsDown, X, ChevronDown, Filter, AlertTriangle,
  TrendingUp, Shield, Wrench, DollarSign, FileCheck, Clock,
  Building2, Train
} from 'lucide-react';

// Mock Data for KMRL Knowledge Lens
const documentData = [
  // Rolling Stock Engineer Documents
  {
    id: 'DOC001',
    title: 'Maintenance Circular: Alstom Trainset Axle Inspection',
    priority: 'High',
    source: { type: 'maximo', name: 'Maximo Exports', icon: Database },
    timestamp: '2025-09-09T14:00:00Z',
    summary: 'Mandatory ultrasonic inspection of all Alstom series-8 trainset axles required following a potential fatigue crack report from another metro system.',
    fullSummary: 'A comprehensive maintenance directive has been issued requiring immediate ultrasonic inspection of all Alstom series-8 trainset axles. This action follows a critical safety alert from Delhi Metro regarding potential fatigue cracks in similar rolling stock. The inspection must be completed within 5 working days to ensure passenger safety and operational continuity.',
    actionItems: [
      'Schedule ultrasonic tests for all 12 series-8 trainsets by Sept 15, 2025',
      'Submit compliance report to Rolling Stock Manager by Sept 18, 2025',
      'Coordinate with Operations team for minimum service disruption'
    ],
    entities: ['Alstom series-8', 'Ultrasonic Inspection', 'Fatigue Crack', 'Safety Protocol'],
    role_visibility: ['Rolling Stock Engineer', 'Executive Director'],
    documentType: 'Maintenance'
  },
  {
    id: 'DOC002',
    title: 'Emergency Brake System Recall Notice - Knorr Bremse',
    priority: 'Critical',
    source: { type: 'email', name: 'safety.alerts@kmrl.co.in', icon: Mail },
    timestamp: '2025-09-09T10:30:00Z',
    summary: 'Immediate recall of Knorr Bremse emergency brake controllers due to potential software malfunction affecting trains T-03, T-07, and T-12.',
    fullSummary: 'Critical safety alert regarding Knorr Bremse emergency brake controllers installed in three KMRL trainsets. A software bug has been identified that could delay emergency brake engagement by up to 2.5 seconds under specific conditions. Immediate replacement required.',
    actionItems: [
      'Remove trains T-03, T-07, and T-12 from service immediately',
      'Install replacement brake controllers within 48 hours',
      'Conduct comprehensive brake testing before returning to service',
      'File incident report with CMRS'
    ],
    entities: ['Knorr Bremse', 'Emergency Brake', 'Software Malfunction', 'CMRS'],
    role_visibility: ['Rolling Stock Engineer', 'Executive Director'],
    documentType: 'Safety'
  },
  
  // Finance Officer Documents
  {
    id: 'DOC003',
    title: 'Invoice #INV-2025-9834 from Siemens Mobility',
    priority: 'Normal',
    source: { type: 'email', name: 'vendor.invoices@kmrl.co.in', icon: Mail },
    timestamp: '2025-09-09T16:30:00Z',
    summary: 'Invoice for the quarterly servicing of communication-based train control (CBTC) systems for the amount of ₹12,50,000. Payment due in 30 days.',
    fullSummary: 'Quarterly maintenance invoice from Siemens Mobility for CBTC system servicing across all 18 stations. The invoice covers software updates, hardware diagnostics, and preventive maintenance performed in Q3 2025. Payment terms specify 30-day settlement with 2% early payment discount if settled within 15 days.',
    actionItems: [
      'Verify service completion with Signaling department by Sept 12',
      'Process payment approval through finance committee',
      'Schedule payment before Oct 9, 2025 to avoid penalties',
      'Consider early payment discount of ₹25,000'
    ],
    entities: ['Siemens Mobility', '₹12,50,000', 'CBTC', 'Quarterly Maintenance'],
    role_visibility: ['Finance Officer', 'Executive Director'],
    documentType: 'Finance'
  },
  {
    id: 'DOC004',
    title: 'Budget Variance Report - Q3 2025 Operations',
    priority: 'High',
    source: { type: 'scan', name: 'Finance Reports', icon: FileText },
    timestamp: '2025-09-09T11:45:00Z',
    summary: 'Q3 operations budget shows 15% variance due to increased energy costs and unexpected maintenance expenditure. Requires immediate cost optimization review.',
    fullSummary: 'Third quarter financial analysis reveals significant budget variance primarily attributed to 18% increase in electricity tariffs and unplanned rolling stock maintenance. Energy costs exceeded budget by ₹2.3 crores while maintenance costs were ₹1.8 crores over projected amounts.',
    actionItems: [
      'Prepare cost optimization proposal for executive review',
      'Negotiate energy tariff revision with KSEB',
      'Review maintenance contracts for cost efficiency',
      'Present variance analysis to board by Sept 20'
    ],
    entities: ['Budget Variance', 'Energy Costs', 'KSEB', '₹2.3 crores'],
    role_visibility: ['Finance Officer', 'Executive Director'],
    documentType: 'Finance'
  },

  // Executive Director Documents
  {
    id: 'DOC005',
    title: 'Critical Safety Alert: Signal Overshoot at Kaloor Station',
    priority: 'Critical',
    source: { type: 'scan', name: 'Incident Reports', icon: FileText },
    timestamp: '2025-09-09T18:05:00Z',
    summary: 'Preliminary report on Signal Passed at Danger (SPAD) incident involving Train T-07 at Kaloor station. No injuries reported but immediate investigation required.',
    fullSummary: 'At 17:45 hours, Train T-07 operated by Driver Rajesh Kumar passed signal KLR-S04 at danger while approaching Kaloor station platform. The train stopped 15 meters beyond the signal but remained 20 meters short of the platform. No passengers were endangered and no collision occurred. Initial investigation suggests possible signal visibility issue due to evening glare.',
    actionItems: [
      'Convene emergency safety review board meeting within 24 hours',
      'Submit preliminary report to CMRS within 24 hours',
      'Suspend Driver Rajesh Kumar pending investigation',
      'Conduct signal visibility assessment at Kaloor station',
      'Review SPAD prevention protocols across network'
    ],
    entities: ['SPAD', 'Kaloor Station', 'Train T-07', 'CMRS', 'Driver Rajesh Kumar'],
    role_visibility: ['Executive Director'],
    documentType: 'Safety'
  },
  {
    id: 'DOC006',
    title: 'Kerala Government Metro Expansion Approval',
    priority: 'High',
    source: { type: 'email', name: 'govt.liaison@kmrl.co.in', icon: Mail },
    timestamp: '2025-09-09T09:15:00Z',
    summary: 'State government approves Phase-3 expansion to Kakkanad with ₹850 crore funding allocation. Project timeline set for 2026-2029 completion.',
    fullSummary: 'The Kerala State Government has officially approved the Phase-3 expansion of Kochi Metro to Kakkanad IT corridor. The project includes 4 new stations covering 8.5 km with a total investment of ₹850 crores. Funding will be shared between state government (60%) and central government (40%). Construction is scheduled to commence in Q2 2026.',
    actionItems: [
      'Establish Phase-3 project management office',
      'Initiate land acquisition proceedings for 4 station sites',
      'Prepare detailed project report by December 2025',
      'Coordinate with IT companies for ridership projections',
      'Schedule meeting with Chief Minister by Sept 25'
    ],
    entities: ['Phase-3 Expansion', 'Kakkanad', '₹850 crore', 'State Government'],
    role_visibility: ['Executive Director'],
    documentType: 'Legal'
  },

  // Additional documents for each role
  {
    id: 'DOC007',
    title: 'Preventive Maintenance Schedule - October 2025',
    priority: 'Normal',
    source: { type: 'maximo', name: 'Maximo Exports', icon: Database },
    timestamp: '2025-09-09T08:20:00Z',
    summary: 'Monthly preventive maintenance schedule for all rolling stock and infrastructure. 47 maintenance activities planned across 18 stations.',
    fullSummary: 'Comprehensive preventive maintenance schedule for October 2025 covering 18 trainsets, all 18 stations, and critical infrastructure components. Activities include bogie maintenance, brake system checks, door mechanism servicing, and platform screen door maintenance.',
    actionItems: [
      'Coordinate with Operations for maintenance windows',
      'Ensure spare parts availability for all scheduled activities',
      'Brief maintenance teams on safety protocols'
    ],
    entities: ['Preventive Maintenance', 'Rolling Stock', 'Platform Screen Doors'],
    role_visibility: ['Rolling Stock Engineer'],
    documentType: 'Maintenance'
  },
  {
    id: 'DOC008',
    title: 'Vendor Performance Review - L&T Construction',
    priority: 'Normal',
    source: { type: 'scan', name: 'Procurement Reports', icon: FileText },
    timestamp: '2025-09-09T14:20:00Z',
    summary: 'Annual performance review of L&T Construction for civil maintenance contracts. Overall rating: 4.2/5 with recommendations for contract renewal.',
    fullSummary: 'Annual evaluation of L&T Construction performance across all civil maintenance contracts. Strong performance in structural repairs and station maintenance with minor delays in monsoon-related work. Cost efficiency maintained at 98% of budget allocation.',
    actionItems: [
      'Negotiate contract renewal terms for 2026',
      'Address monsoon work delays in new contract',
      'Finalize performance bonus structure'
    ],
    entities: ['L&T Construction', 'Contract Renewal', 'Performance Review'],
    role_visibility: ['Finance Officer', 'Executive Director'],
    documentType: 'Finance'
  }
];

const roles = [
  { id: 'Rolling Stock Engineer', name: 'Rolling Stock Engineer', initials: 'RSE' },
  { id: 'Finance Officer', name: 'Finance Officer', initials: 'FO' },
  { id: 'Executive Director', name: 'Executive Director', initials: 'ED' }
];

const priorities = ['Critical', 'High', 'Normal'];
const documentTypes = ['Safety', 'Finance', 'Maintenance', 'Legal'];

const DocumentCard = ({ document, onClick }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      default: return 'priority-normal';
    }
  };

  const IconComponent = document.source.icon;

  return (
    <div 
      className={`document-card p-4 ${getPriorityClass(document.priority)}`}
      onClick={() => onClick(document)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground truncate">{document.source.name}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          document.priority === 'Critical' ? 'bg-red-100 text-red-700' :
          document.priority === 'High' ? 'bg-orange-100 text-orange-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {document.priority}
        </span>
      </div>
      
      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{document.title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{document.summary}</p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Received: {formatTime(document.timestamp)}</span>
        {document.actionItems?.length > 0 && (
          <div className="flex items-center space-x-1">
            <CheckSquare className="h-3 w-3" />
            <span>{document.actionItems.length} Action Items</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentDetailView = ({ document, onClose }) => {
  const [feedback, setFeedback] = useState(null);

  if (!document) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">{document.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex h-[70vh]">
          {/* Left Column - AI Analysis */}
          <div className="w-3/5 p-6 overflow-y-auto border-r">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">AI Analysis Summary</h3>
                <p className="text-muted-foreground leading-relaxed">{document.fullSummary}</p>
              </div>
              
              {document.actionItems?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Action Items</h3>
                  <div className="space-y-2">
                    {document.actionItems.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Key Entities</h3>
                <div className="flex flex-wrap gap-2">
                  {document.entities.map((entity, index) => (
                    <span key={index} className="entity-tag">{entity}</span>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-foreground mb-3">Was this summary helpful?</h3>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setFeedback('positive')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      feedback === 'positive' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">Yes, helpful</span>
                  </button>
                  <button 
                    onClick={() => setFeedback('negative')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      feedback === 'negative' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">Needs improvement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Source Document */}
          <div className="w-2/5 p-6 bg-gray-50">
            <h3 className="font-semibold text-foreground mb-4">Original Source Document</h3>
            
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">PDF/Document Viewer</p>
                <p className="text-xs text-gray-400">Original document would be displayed here</p>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors mb-4">
              <Download className="h-4 w-4" />
              <span>Download Original</span>
            </button>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium">{document.source.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{document.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Received:</span>
                <span className="font-medium">{new Date(document.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Document ID:</span>
                <span className="font-mono text-xs">{document.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [selectedRole, setSelectedRole] = useState('Rolling Stock Engineer');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [priorityFilters, setPriorityFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentRole = roles.find(role => role.id === selectedRole);

  const filteredDocuments = useMemo(() => {
    return documentData.filter(doc => {
      // Role filter
      if (!doc.role_visibility.includes(selectedRole)) return false;
      
      // Priority filter
      if (priorityFilters.length > 0 && !priorityFilters.includes(doc.priority)) return false;
      
      // Type filter
      if (typeFilters.length > 0 && !typeFilters.includes(doc.documentType)) return false;
      
      // Search filter
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !doc.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      return true;
    });
  }, [selectedRole, priorityFilters, typeFilters, searchQuery]);

  const toggleFilter = (filterArray, setFilterArray, value) => {
    setFilterArray(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Layout Container */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-sidebar bg-white border-r border-border flex flex-col h-screen sticky top-0">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Train className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">KMRL</h1>
                <p className="text-sm text-muted-foreground">Knowledge Lens</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="p-4 border-b border-border">
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:bg-gray-50 rounded-lg">
                <FileCheck className="h-4 w-4" />
                <span>Reports</span>
              </a>
            </nav>
          </div>
          
          {/* Role Switcher */}
          <div className="p-4 border-b border-border">
            <label className="block text-sm font-medium text-foreground mb-2">Current Role</label>
            <div className="relative">
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          
          {/* Filters */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Priority
              </h3>
              <div className="space-y-2">
                {priorities.map(priority => (
                  <button
                    key={priority}
                    onClick={() => toggleFilter(priorityFilters, setPriorityFilters, priority)}
                    className={`filter-pill w-full text-left ${
                      priorityFilters.includes(priority) ? 'filter-pill-active' : 'filter-pill-inactive'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Filter by Document Type</h3>
              <div className="space-y-2">
                {documentTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter(typeFilters, setTypeFilters, type)}
                    className={`filter-pill w-full text-left ${
                      typeFilters.includes(type) ? 'filter-pill-active' : 'filter-pill-inactive'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Navigation */}
          <header className="bg-white border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Ask a question about any document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 ml-6">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {currentRole?.initials}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{currentRole?.name}</p>
                    <p className="text-muted-foreground">KMRL</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Intelligence Dashboard - {currentRole?.name}
              </h1>
              <p className="text-muted-foreground">
                {filteredDocuments.length} documents require your attention
              </p>
            </div>
            
            {/* Document Grid */}
            <div className="grid gap-4">
              {filteredDocuments.map(document => (
                <DocumentCard 
                  key={document.id} 
                  document={document} 
                  onClick={setSelectedDocument}
                />
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      
      {/* Document Detail Modal */}
      {selectedDocument && (
        <DocumentDetailView 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
    </div>
  );
};

export default Index;