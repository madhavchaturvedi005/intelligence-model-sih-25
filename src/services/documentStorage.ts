import { DocumentAnalysis } from './geminiService';

export interface StoredDocument {
  id: string;
  title: string;
  type: string;
  department: string;
  date: string;
  summary: {
    headline: string;
    keyPoints: string[];
    detailed: string;
  };
  priority: 'high' | 'medium' | 'low';
  source: string;
  originalContent: string;
  fileData: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  analysis: {
    entities: string[];
    confidence: number;
    language: string;
  };
}

export class DocumentStorageService {
  private readonly STORAGE_KEY = 'kmrl_documents';

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  saveDocument(analysis: DocumentAnalysis, originalContent: string, file: File): StoredDocument {
    const document: StoredDocument = {
      id: this.generateId(),
      title: analysis.title,
      type: analysis.type,
      department: analysis.department,
      date: new Date().toISOString(),
      summary: analysis.summary,
      priority: analysis.priority,
      source: file.name,
      originalContent,
      fileData: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      },
      analysis: {
        entities: analysis.entities,
        confidence: analysis.confidence,
        language: analysis.language
      }
    };

    const documents = this.getAllDocuments();
    documents.push(document);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
    
    return document;
  }

  getAllDocuments(): StoredDocument[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading documents from storage:', error);
      return [];
    }
  }

  getDocumentById(id: string): StoredDocument | null {
    const documents = this.getAllDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  updateDocument(id: string, updates: Partial<StoredDocument>): boolean {
    const documents = this.getAllDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) return false;
    
    documents[index] = { ...documents[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
    return true;
  }

  deleteDocument(id: string): boolean {
    const documents = this.getAllDocuments();
    const filtered = documents.filter(doc => doc.id !== id);
    
    if (filtered.length === documents.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  searchDocuments(query: string): StoredDocument[] {
    const documents = this.getAllDocuments();
    const lowercaseQuery = query.toLowerCase();
    
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.type.toLowerCase().includes(lowercaseQuery) ||
      doc.department.toLowerCase().includes(lowercaseQuery) ||
      doc.summary.headline.toLowerCase().includes(lowercaseQuery) ||
      doc.summary.keyPoints.some(point => point.toLowerCase().includes(lowercaseQuery)) ||
      doc.summary.detailed.toLowerCase().includes(lowercaseQuery)
    );
  }

  getDocumentsByDepartment(department: string): StoredDocument[] {
    const documents = this.getAllDocuments();
    return documents.filter(doc => doc.department === department);
  }

  getDocumentsByPriority(priority: 'high' | 'medium' | 'low'): StoredDocument[] {
    const documents = this.getAllDocuments();
    return documents.filter(doc => doc.priority === priority);
  }

  exportDocuments(): string {
    const documents = this.getAllDocuments();
    return JSON.stringify(documents, null, 2);
  }

  importDocuments(jsonData: string): boolean {
    try {
      const documents = JSON.parse(jsonData);
      if (Array.isArray(documents)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(documents));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing documents:', error);
      return false;
    }
  }

  clearAllDocuments(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getStorageStats(): { count: number; totalSize: number } {
    const documents = this.getAllDocuments();
    const totalSize = documents.reduce((sum, doc) => sum + doc.fileData.size, 0);
    return {
      count: documents.length,
      totalSize
    };
  }

  initializeMockData(): void {
    const existingDocuments = this.getAllDocuments();
    
    // Only add mock data if no documents exist
    if (existingDocuments.length === 0) {
      const mockDocuments: StoredDocument[] = [
        {
          id: 'mock-doc-1',
          title: 'Metro Line 3 Environmental Impact Assessment',
          type: 'Environmental Report',
          department: 'Environmental Planning',
          date: '2024-01-15T10:30:00.000Z',
          summary: {
            headline: 'Comprehensive environmental assessment for Metro Line 3 extension project',
            keyPoints: [
              'Air quality impact assessment shows minimal negative effects',
              'Noise pollution mitigation measures recommended for residential areas',
              'Biodiversity conservation plan includes green corridor development',
              'Water resource management strategy approved by environmental board',
              'Carbon footprint reduction of 35% compared to bus transportation'
            ],
            detailed: 'This comprehensive environmental impact assessment evaluates the proposed Metro Line 3 extension covering 12.5 kilometers with 8 new stations. The study encompasses air quality analysis, noise impact evaluation, biodiversity assessment, and water resource management. Key findings indicate that the project will significantly reduce urban air pollution by providing an eco-friendly alternative to private vehicles. The assessment recommends implementing advanced noise barriers in residential zones and establishing green corridors along the metro route to preserve local ecosystems. The project is expected to reduce carbon emissions by 35% compared to equivalent bus transportation capacity.'
          },
          priority: 'high',
          source: 'metro_line3_environmental_assessment.pdf',
          originalContent: 'ENVIRONMENTAL IMPACT ASSESSMENT\n\nProject: Metro Line 3 Extension\nDate: January 15, 2024\nPrepared by: Environmental Planning Department\n\nEXECUTIVE SUMMARY\n\nThis document presents a comprehensive environmental impact assessment for the proposed Metro Line 3 extension project. The assessment covers environmental factors including air quality, noise pollution, biodiversity impact, and water resource management.\n\nKEY FINDINGS:\n\n1. Air Quality Impact\n- Minimal negative impact during construction phase\n- Long-term positive impact through reduced vehicle emissions\n- Estimated 35% reduction in carbon footprint compared to bus alternatives\n\n2. Noise Pollution\n- Construction noise mitigation required in residential areas\n- Operational noise levels within acceptable limits\n- Advanced noise barriers recommended for sensitive zones\n\n3. Biodiversity Conservation\n- Green corridor development along metro route\n- Native species preservation program\n- Habitat restoration in affected areas\n\n4. Water Resource Management\n- Sustainable drainage systems implementation\n- Groundwater protection measures\n- Rainwater harvesting integration\n\nRECOMMENDATIONS:\n\n- Implement comprehensive noise mitigation during construction\n- Establish green corridors to preserve local ecosystems\n- Monitor air quality throughout project phases\n- Integrate sustainable water management systems\n\nCONCLUSION:\n\nThe Metro Line 3 extension project demonstrates significant environmental benefits with proper mitigation measures. The project aligns with sustainable urban development goals and will contribute to improved air quality and reduced carbon emissions in the metropolitan area.',
          fileData: {
            name: 'metro_line3_environmental_assessment.pdf',
            size: 2457600, // ~2.4MB
            type: 'application/pdf',
            lastModified: 1705312200000
          },
          analysis: {
            entities: ['Metro Line 3', 'Environmental Planning Department', 'Air Quality', 'Noise Pollution', 'Biodiversity', 'Carbon Emissions'],
            confidence: 92,
            language: 'English'
          }
        },
        {
          id: 'mock-doc-2',
          title: 'Smart Ticketing System Technical Specifications',
          type: 'Technical Documentation',
          department: 'IT Operations',
          date: '2024-01-12T14:45:00.000Z',
          summary: {
            headline: 'Technical specifications for next-generation contactless ticketing system implementation',
            keyPoints: [
              'NFC and QR code dual payment support for maximum compatibility',
              'Real-time fare calculation with dynamic pricing capabilities',
              'Mobile app integration with digital wallet functionality',
              'Offline transaction capability for system reliability',
              'Advanced analytics dashboard for operational insights'
            ],
            detailed: 'This technical specification document outlines the requirements and architecture for implementing a state-of-the-art smart ticketing system across the metro network. The system features dual payment methods supporting both NFC contactless cards and QR code mobile payments, ensuring accessibility for all user demographics. The platform includes real-time fare calculation with dynamic pricing based on peak hours and distance traveled. A comprehensive mobile application provides users with journey planning, digital wallet functionality, and real-time service updates. The system maintains offline transaction capabilities to ensure uninterrupted service during network outages, with automatic synchronization when connectivity is restored.'
          },
          priority: 'medium',
          source: 'smart_ticketing_technical_specs.docx',
          originalContent: 'SMART TICKETING SYSTEM\nTechnical Specifications Document\n\nVersion: 2.1\nDate: January 12, 2024\nDepartment: IT Operations\nProject Manager: Vikram Reddy\n\nOVERVIEW\n\nThis document defines the technical specifications for the implementation of a next-generation smart ticketing system across the metro network. The system will replace existing magnetic stripe cards with modern contactless payment solutions.\n\nSYSTEM ARCHITECTURE\n\n1. Payment Methods\n- NFC contactless cards (ISO 14443 Type A/B)\n- QR code mobile payments\n- Digital wallet integration\n- Bank card contactless payments\n\n2. Core Features\n- Real-time fare calculation\n- Dynamic pricing based on time and distance\n- Multi-modal journey support\n- Offline transaction capability\n- Automatic top-up functionality\n\n3. Mobile Application\n- Journey planning and navigation\n- Digital wallet management\n- Real-time service updates\n- Transaction history\n- Customer support integration\n\n4. Backend Infrastructure\n- Cloud-based transaction processing\n- Real-time analytics engine\n- Fraud detection system\n- API gateway for third-party integrations\n- Automated reporting dashboard\n\nTECHNICAL REQUIREMENTS\n\n- Processing capacity: 10,000 transactions per minute\n- Response time: <200ms for payment processing\n- Uptime requirement: 99.9% availability\n- Data encryption: AES-256 standard\n- Compliance: PCI DSS Level 1\n\nIMPLEMENTATION TIMELINE\n\nPhase 1: Core system development (3 months)\nPhase 2: Pilot testing at 5 stations (2 months)\nPhase 3: Network-wide rollout (6 months)\nPhase 4: Advanced features deployment (2 months)\n\nBUDGET ALLOCATION\n\n- Hardware procurement: ₹45 crores\n- Software development: ₹32 crores\n- Integration and testing: ₹18 crores\n- Training and support: ₹8 crores\n\nTotal Project Cost: ₹103 crores',
          fileData: {
            name: 'smart_ticketing_technical_specs.docx',
            size: 1843200, // ~1.8MB
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            lastModified: 1705053900000
          },
          analysis: {
            entities: ['Smart Ticketing System', 'NFC', 'QR Code', 'Mobile App', 'IT Operations', 'Vikram Reddy', 'PCI DSS'],
            confidence: 88,
            language: 'English'
          }
        }
      ];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockDocuments));
    }
  }
}

export const documentStorage = new DocumentStorageService();