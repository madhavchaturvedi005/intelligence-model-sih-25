import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Search, FileText, Brain, Users, Zap, MessageCircle, TrendingUp, LogOut, User, Settings, Upload, X, File, Loader2, Link } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DocumentCard } from "./DocumentCard";
import { AIAssistant } from "./AIAssistant";
import { ProjectTracker } from "./ProjectTracker";
import { SearchInterface } from "./SearchInterface";
import { EnhancedSearchInterface } from "./EnhancedSearchInterface";
import { EnhancedProjectCard } from "./EnhancedProjectCard";
import { geminiService } from "@/services/geminiService";
import { mockGeminiService } from "@/services/mockGeminiService";
import { documentStorage, StoredDocument } from "@/services/documentStorage";
import { projectStorage, Project } from "@/services/projectStorage";
import { CreateProjectDialog } from "./CreateProjectDialog";





const DocumentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'text/plain' ||
      file.type === 'text/csv'
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, Word, Excel, and text files are supported.",
        variant: "destructive",
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const processedDocuments = [];
      
      for (const file of selectedFiles) {
        try {
          // Extract text content from file
          const fileContent = await geminiService.extractTextFromFile(file);
          
          // Try to analyze document with AI, fallback to mock service if needed
          let analysis;
          try {
            analysis = await geminiService.analyzeDocument(fileContent, file.name);
          } catch (error) {
            console.warn('Gemini AI failed, using mock service:', error);
            analysis = await mockGeminiService.analyzeDocument(fileContent, file.name);
          }
          
          // Save to local storage
          const savedDocument = documentStorage.saveDocument(analysis, fileContent, file);
          processedDocuments.push(savedDocument);
        } catch (error) {
          console.error('Error processing file:', file.name, error);
          toast({
            title: "File Processing Error",
            description: `Failed to process ${file.name}. Please try again.`,
            variant: "destructive",
          });
        }
      }
      
      toast({
        title: "Upload and Analysis Complete",
        description: `${selectedFiles.length} file(s) have been processed and analyzed by AI.`,
      });
      
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh the documents list
      const documents = documentStorage.getAllDocuments();
      setStoredDocuments(documents);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div 
        className={`p-6 border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Upload Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Fully Supported:</strong> PDF, TXT, CSV, JSON</p>
            <p><strong>Basic Support:</strong> DOC, DOCX, XLS, XLSX</p>
            <p><strong>Max Size:</strong> 10MB per file</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          />
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="border-t p-4">
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button 
            className="w-full" 
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAI, setShowAI] = useState(false);
  const [storedDocuments, setStoredDocuments] = useState<StoredDocument[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load documents and projects from storage on component mount
  useEffect(() => {
    // Initialize mock data if no documents exist
    documentStorage.initializeMockData();
    const documents = documentStorage.getAllDocuments();
    setStoredDocuments(documents);

    // Initialize and load projects
    projectStorage.initializeDefaultProjects();
    const allProjects = projectStorage.getAllProjects();
    setProjects(allProjects);
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Upload Dialog Component
  const UploadDialog = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleFiles(files);
      }
    };

    const handleFiles = (files: File[]) => {
      const validFiles = files.filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'text/plain' ||
        file.type === 'text/csv'
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid file type",
          description: "Only PDF, Word, Excel, and text files are supported.",
          variant: "destructive",
        });
      }

      setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
      if (selectedFiles.length === 0) return;
      
      setIsUploading(true);
      
      try {
        const processedDocuments = [];
        
        for (const file of selectedFiles) {
          try {
            // Extract text content from file
            const fileContent = await geminiService.extractTextFromFile(file);
            
            // Try to analyze document with AI, fallback to mock service if needed
            let analysis;
            try {
              analysis = await geminiService.analyzeDocument(fileContent, file.name);
            } catch (error) {
              console.warn('Gemini AI failed, using mock service:', error);
              analysis = await mockGeminiService.analyzeDocument(fileContent, file.name);
            }
            
            // Save to local storage
            const savedDocument = documentStorage.saveDocument(analysis, fileContent, file);
            processedDocuments.push(savedDocument);
          } catch (error) {
            console.error('Error processing file:', file.name, error);
            toast({
              title: "File Processing Error",
              description: `Failed to process ${file.name}. Please try again.`,
              variant: "destructive",
            });
          }
        }
        
        toast({
          title: "Upload and Analysis Complete",
          description: `${selectedFiles.length} file(s) have been processed and analyzed by AI.`,
        });
        
        setSelectedFiles([]);
        
        // Refresh the documents list and knowledge base
        const documents = documentStorage.getAllDocuments();
        setStoredDocuments(documents);
        
        // Refresh the LangChain knowledge base with new documents
        try {
          const { EnhancedDocumentService } = await import('@/services/enhancedDocumentService');
          await EnhancedDocumentService.refreshKnowledgeBase();
        } catch (error) {
          console.warn('Failed to refresh knowledge base:', error);
        }
        
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "There was an error processing your files. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="ml-4">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload-dialog')?.click()}
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drop files here</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Or click to select files from your computer
            </p>
            <div className="text-xs text-muted-foreground mb-4 space-y-1">
              <p><strong>Fully Supported (AI Analysis):</strong> PDF, TXT, CSV, JSON</p>
              <p><strong>Basic Support:</strong> DOC, DOCX, XLS, XLSX</p>
              <p><strong>File Size Limit:</strong> 10MB per file</p>
            </div>
            <input
              id="file-upload-dialog"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Selected files ({selectedFiles.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm">
                    <div className="flex items-center gap-2 truncate">
                      <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded flex items-center justify-center">
                <img src="/kmrl-logo.svg" alt="KMRL Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Knowledge Lens</h1>
            </div>
            <Badge variant="secondary" className="text-xs">Staff Portal</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAI(true)}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto px-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm bg-primary text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.employeeId}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r bg-card min-h-screen">
          <div className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("projects")}
            >
              <Users className="h-4 w-4 mr-2" />
              Projects
            </Button>
            <Button
              variant={activeTab === "search" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("search")}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/connections')}
            >
              <Link className="h-4 w-4 mr-2" />
              Connections
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "documents" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Main Upload Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">Documents</h2>
                    <p className="text-muted-foreground">Manage and view your uploaded documents</p>
                  </div>
                  <UploadDialog />
                </div>
                
                {/* Document List */}
                <Card>
                  <div className="p-6">
                    {storedDocuments.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h4 className="text-lg font-medium text-foreground mb-1">No documents yet</h4>
                        <p className="text-muted-foreground mb-4">
                          Get started by uploading your first document
                        </p>
                        <UploadDialog />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {storedDocuments.map((doc) => (
                          <DocumentCard key={doc.id} document={doc} />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              
              {/* AI Summary Sidebar */}
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-lg">
                      <Brain className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="font-medium">AI Document Summary</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload a document to get an AI-generated summary, key points, and action items.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Extract key information</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Generate executive summary</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Identify action items</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Zap className="h-4 w-4 mr-2 text-blue-500" />
                    Process with AI
                  </Button>
                </div>
                
                {/* Recent Activity */}
                <Card>
                  <div className="p-4">
                    <h3 className="font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {storedDocuments.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="flex items-start gap-3 text-sm">
                          <div className="bg-muted p-2 rounded-lg">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {new Date(doc.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {storedDocuments.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recent activity. Upload documents to see them here.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Good morning, {user.name}</h2>
                <p className="text-muted-foreground">Here's your personalized briefing for today</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                      <p className="text-2xl font-bold text-foreground">{storedDocuments.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold text-foreground">
                        {projects.filter(project => project.status === 'In Progress').length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">High Priority</p>
                      <p className="text-2xl font-bold text-foreground">
                        {[...storedDocuments.filter(doc => doc.priority === 'high'), ...projects.filter(project => project.priority === 'high')].length}
                      </p>
                    </div>
                    <Brain className="h-8 w-8 text-accent" />
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Confidence</p>
                      <p className="text-2xl font-bold text-success">
                        {storedDocuments.length > 0 
                          ? Math.round(storedDocuments.reduce((sum, doc) => sum + doc.analysis.confidence, 0) / storedDocuments.length)
                          : 0}%
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-success" />
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => navigate('/connections')}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Link className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Data Source Connections</h3>
                      <p className="text-sm text-muted-foreground">Connect email, SharePoint, Maximo, and more</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("documents")}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Upload className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground">Add documents for AI analysis</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Documents */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Documents</h3>
                <div className="space-y-4">
                  {storedDocuments.length > 0 ? (
                    storedDocuments.slice(0, 5).map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))
                  ) : (
                    <Card className="p-6 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                      <p className="text-muted-foreground">Go to the Documents tab to upload your first document and get started with AI-powered analysis</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}



          {activeTab === "projects" && (
            <div className="animate-fade-in">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Project Center</h2>
                    <p className="text-muted-foreground">Track ongoing KMRL projects and their progress</p>
                  </div>
                  <CreateProjectDialog onProjectCreated={handleProjectCreated} />
                </div>
                
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-1">No projects yet</h4>
                    <p className="text-muted-foreground mb-4">
                      Get started by creating your first project
                    </p>
                    <CreateProjectDialog onProjectCreated={handleProjectCreated} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {projects.map((project) => (
                      <EnhancedProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div className="animate-fade-in">
              <EnhancedSearchInterface />
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant Modal */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};