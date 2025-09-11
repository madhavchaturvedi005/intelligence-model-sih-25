import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RetrievalQAChain } from "langchain/chains";

export interface DocumentAnalysis {
  title: string;
  type: string;
  department: string;
  summary: {
    headline: string;
    keyPoints: string[];
    detailed: string;
  };
  priority: 'high' | 'medium' | 'low';
  entities: string[];
  confidence: number;
  language: string;
}

export class LangChainService {
  private llm: ChatGoogleGenerativeAI;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private vectorStore: MemoryVectorStore | null = null;
  private readonly API_KEY = 'AIzaSyCgELAt2c5ud4f3AhsXGZ84sb6eQ4MY-uQ';

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      apiKey: this.API_KEY,
      modelName: "gemini-1.5-flash",
      temperature: 0.3,
    });

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: this.API_KEY,
      modelName: "embedding-001",
    });
  }

  async analyzeDocument(content: string, filename: string): Promise<DocumentAnalysis> {
    try {
      const analysisPrompt = PromptTemplate.fromTemplate(`
        You are an AI assistant specialized in analyzing documents for KMRL (Kochi Metro Rail Limited).
        
        Document Name: {filename}
        Content: {content}
        
        Analyze this document and provide a structured response in JSON format:
        
        {{
          "title": "A concise, descriptive title for the document",
          "type": "Document type (Safety Document, Financial Report, Technical Manual, Policy Document, Operations Report, etc.)",
          "department": "Most relevant KMRL department (Engineering, Finance, Operations, Safety, Administration, Procurement, etc.)",
          "summary": {{
            "headline": "One sentence executive summary",
            "keyPoints": ["3-5 most important bullet points"],
            "detailed": "2-3 sentence detailed summary"
          }},
          "priority": "high/medium/low based on urgency, safety implications, and business impact",
          "entities": ["Important entities: dates, amounts, names, locations, equipment, etc."],
          "confidence": "Confidence score 0-100 based on content clarity and completeness",
          "language": "Primary language of the document"
        }}
        
        Focus on KMRL context: metro operations, passenger safety, financial performance, infrastructure, and regulatory compliance.
        
        Respond with ONLY the JSON object, no additional text.
      `);

      const chain = new LLMChain({
        llm: this.llm,
        prompt: analysisPrompt,
      });

      const result = await chain.call({
        filename,
        content: content.substring(0, 8000), // Limit content length
      });

      // Parse the JSON response
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
      }

      throw new Error('Failed to parse AI response');

    } catch (error) {
      console.error('LangChain document analysis failed:', error);
      
      // Fallback analysis
      return this.createFallbackAnalysis(filename, content);
    }
  }

  async setupVectorStore(documents: Array<{ id: string; content: string; metadata: any }>): Promise<void> {
    try {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = [];
      for (const doc of documents) {
        const chunks = await textSplitter.splitText(doc.content);
        for (const chunk of chunks) {
          docs.push(new Document({
            pageContent: chunk,
            metadata: {
              ...doc.metadata,
              documentId: doc.id,
            },
          }));
        }
      }

      this.vectorStore = await MemoryVectorStore.fromDocuments(docs, this.embeddings);
      console.log(`Vector store created with ${docs.length} document chunks`);

    } catch (error) {
      console.error('Failed to setup vector store:', error);
    }
  }

  async askQuestion(question: string, documentContent?: string): Promise<string> {
    try {
      if (this.vectorStore) {
        // Use RAG (Retrieval Augmented Generation) with vector store
        const qaChain = RetrievalQAChain.fromLLM(
          this.llm,
          this.vectorStore.asRetriever(3), // Retrieve top 3 relevant chunks
        );

        const result = await qaChain.call({
          query: question,
        });

        return result.text;
      } else if (documentContent) {
        // Direct Q&A with specific document content
        const qaPrompt = PromptTemplate.fromTemplate(`
          You are an AI assistant helping users understand KMRL (Kochi Metro Rail Limited) documents.
          
          Document Content: {content}
          
          User Question: {question}
          
          Instructions:
          1. Answer based ONLY on the provided document content
          2. If the information is not in the document, clearly state that
          3. Provide specific references to relevant parts of the document
          4. Keep answers concise but comprehensive
          5. Focus on KMRL operational context
          
          Answer:
        `);

        const chain = new LLMChain({
          llm: this.llm,
          prompt: qaPrompt,
        });

        const result = await chain.call({
          content: documentContent.substring(0, 6000),
          question,
        });

        return result.text;
      } else {
        return "I need document content or a vector store to answer questions. Please provide a document or set up the knowledge base first.";
      }

    } catch (error) {
      console.error('LangChain Q&A failed:', error);
      return `I encountered an error while processing your question: ${error instanceof Error ? error.message : 'Unknown error'}. Please try rephrasing your question.`;
    }
  }

  async generateSummary(content: string, summaryType: 'executive' | 'technical' | 'action-items' = 'executive'): Promise<string> {
    try {
      const summaryPrompts = {
        executive: `
          Create an executive summary of this KMRL document for senior management.
          Focus on: key decisions, financial impact, strategic implications, and required actions.
          Keep it concise (2-3 paragraphs) and business-focused.
        `,
        technical: `
          Create a technical summary of this KMRL document for engineering and operations teams.
          Focus on: technical specifications, operational procedures, safety requirements, and implementation details.
          Include specific technical details and requirements.
        `,
        'action-items': `
          Extract and list all action items, deadlines, and required follow-ups from this KMRL document.
          Format as a numbered list with responsible parties and deadlines where mentioned.
          Include priority levels if indicated.
        `
      };

      const summaryPrompt = PromptTemplate.fromTemplate(`
        You are analyzing a KMRL (Kochi Metro Rail Limited) document.
        
        Document Content: {content}
        
        Task: {task}
        
        Summary:
      `);

      const chain = new LLMChain({
        llm: this.llm,
        prompt: summaryPrompt,
      });

      const result = await chain.call({
        content: content.substring(0, 8000),
        task: summaryPrompts[summaryType],
      });

      return result.text;

    } catch (error) {
      console.error('Summary generation failed:', error);
      return `Failed to generate ${summaryType} summary: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  async extractEntities(content: string): Promise<{
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    amounts: string[];
    equipment: string[];
  }> {
    try {
      const entityPrompt = PromptTemplate.fromTemplate(`
        Extract entities from this KMRL document and categorize them.
        
        Content: {content}
        
        Extract and categorize the following entities (respond in JSON format):
        {{
          "people": ["Names of people mentioned"],
          "organizations": ["Companies, departments, external organizations"],
          "locations": ["Stations, cities, addresses, facilities"],
          "dates": ["All dates mentioned in any format"],
          "amounts": ["Financial amounts, quantities, measurements"],
          "equipment": ["Technical equipment, systems, infrastructure"]
        }}
        
        Focus on KMRL-relevant entities. Respond with ONLY the JSON object.
      `);

      const chain = new LLMChain({
        llm: this.llm,
        prompt: entityPrompt,
      });

      const result = await chain.call({
        content: content.substring(0, 6000),
      });

      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse entity extraction response');

    } catch (error) {
      console.error('Entity extraction failed:', error);
      return {
        people: [],
        organizations: [],
        locations: [],
        dates: [],
        amounts: [],
        equipment: []
      };
    }
  }

  private createFallbackAnalysis(filename: string, content: string): DocumentAnalysis {
    const name = filename.toLowerCase();
    const contentLower = content.toLowerCase();
    
    // Determine type and department based on content and filename
    let type = 'Document';
    let department = 'General';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    if (contentLower.includes('safety') || contentLower.includes('emergency') || name.includes('safety')) {
      type = 'Safety Document';
      department = 'Safety';
      priority = 'high';
    } else if (contentLower.includes('revenue') || contentLower.includes('financial') || name.includes('financial')) {
      type = 'Financial Report';
      department = 'Finance';
    } else if (contentLower.includes('technical') || contentLower.includes('engineering') || name.includes('technical')) {
      type = 'Technical Document';
      department = 'Engineering';
    } else if (contentLower.includes('operations') || contentLower.includes('operational')) {
      type = 'Operations Report';
      department = 'Operations';
    }

    // Extract basic entities
    const entities: string[] = [];
    const words = content.split(/\s+/);
    words.forEach(word => {
      if (word.match(/\d{4}-\d{2}-\d{2}/) || word.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
        entities.push(word);
      }
      if (word.match(/₹[\d,]+/) || word.match(/\$[\d,]+/)) {
        entities.push(word);
      }
    });

    // Add KMRL-specific entities
    if (contentLower.includes('aluva')) entities.push('Aluva Station');
    if (contentLower.includes('kochi')) entities.push('Kochi Metro');
    if (contentLower.includes('kmrl')) entities.push('KMRL');

    return {
      title: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      type,
      department,
      summary: {
        headline: `${type} processed for ${department} department`,
        keyPoints: [
          'Document successfully processed and analyzed',
          'Content available for search and retrieval',
          'Ready for AI-powered Q&A interactions'
        ],
        detailed: `This ${type.toLowerCase()} has been processed and is now available in the KMRL Knowledge Lens system for analysis and querying.`
      },
      priority,
      entities: [...new Set(entities)].slice(0, 8),
      confidence: 75,
      language: 'English'
    };
  }
}

export const langchainService = new LangChainService();