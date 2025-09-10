import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Search, FileText, Brain, Users, Zap, MessageCircle, TrendingUp, LogOut, User, Settings } from "lucide-react";
import { DocumentCard } from "./DocumentCard";
import { AIAssistant } from "./AIAssistant";
import { ProjectTracker } from "./ProjectTracker";
import { SearchInterface } from "./SearchInterface";
import { EnhancedProjectCard } from "./EnhancedProjectCard";

// Mock data for demonstration
const recentDocuments = [
  {
    id: "1",
    title: "Safety Circular - Aluva Station Platform Enhancement",
    type: "Safety Document",
    department: "Engineering",
    date: "2024-01-15",
    summary: {
      headline: "New safety protocols for platform enhancement work at Aluva station",
      keyPoints: ["Hard hat mandatory in construction zones", "Updated emergency evacuation procedures", "New contractor safety requirements"],
      detailed: "This circular outlines comprehensive safety measures for the ongoing platform enhancement project at Aluva station, including mandatory PPE requirements, revised emergency protocols, and enhanced contractor safety standards."
    },
    priority: "high" as const,
    source: "safety-circular-2024-15.pdf"
  },
  {
    id: "2", 
    title: "Monthly Revenue Report - December 2023",
    type: "Financial Report",
    department: "Finance",
    date: "2024-01-10",
    summary: {
      headline: "December revenue increased 12% compared to previous month",
      keyPoints: ["Total revenue: ₹2.4 crores", "Passenger count: 1.2M", "Peak hour efficiency improved"],
      detailed: "December 2023 showed significant growth in ridership and revenue, with notable improvements in peak hour operations and customer satisfaction metrics."
    },
    priority: "medium" as const,
    source: "revenue-report-dec-2023.xlsx"
  }
];

const projectUpdates = [
  {
    id: "p1",
    name: "Corridor Expansion Phase 2",
    description: "Expansion of the metro corridor to include 5 new stations with enhanced connectivity and modern infrastructure.",
    status: "In Progress" as const,
    completion: 65,
    team: ["Engineering", "Construction", "Safety"],
    lastUpdate: "2024-01-14",
    keyMilestones: ["Environmental clearance approved", "Land acquisition 90% complete"],
    documentsCount: 12,
    updatesCount: 8,
    priority: "high" as const,
    startDate: "2023-06-01",
    endDate: "2024-12-31",
    assignedTo: ["Rajesh Kumar", "Priya Sharma", "Amit Singh", "Sunita Patel"]
  },
  {
    id: "p2",
    name: "Smart Ticketing System Upgrade",
    description: "Implementation of contactless ticketing system with mobile app integration and real-time payment processing.",
    status: "Planning" as const,
    completion: 25,
    team: ["IT", "Operations"],
    lastUpdate: "2024-01-12",
    keyMilestones: ["Vendor selection completed", "Technical specifications finalized"],
    documentsCount: 8,
    updatesCount: 5,
    priority: "medium" as const,
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    assignedTo: ["Vikram Reddy", "Anita Desai"]
  }
];

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAI, setShowAI] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">KMRL</span>
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
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
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
                      <p className="text-sm text-muted-foreground">New Documents</p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold text-foreground">8</p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">AI Summaries</p>
                      <p className="text-2xl font-bold text-foreground">156</p>
                    </div>
                    <Brain className="h-8 w-8 text-accent" />
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-medium transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <p className="text-2xl font-bold text-success">+23%</p>
                    </div>
                    <Zap className="h-8 w-8 text-success" />
                  </div>
                </Card>
              </div>

              {/* Recent Documents */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Today's Priority Documents</h3>
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground">Document Center</h2>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} expanded />
                ))}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Project Center</h2>
                  <p className="text-muted-foreground">Track ongoing KMRL projects and their progress</p>
                </div>
                <div className="space-y-6">
                  {projectUpdates.map((project) => (
                    <EnhancedProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div className="animate-fade-in">
              <SearchInterface />
            </div>
          )}
        </main>
      </div>

      {/* AI Assistant Modal */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};