import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, LogIn, UserPlus, Database, Search, BarChart3, MessageCircle, Bell, TrendingUp, FileText, Users } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header (same structure as dashboard) */}
      <header className="border-b bg-card shadow-soft">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">KMRL</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Knowledge Lens</h1>
            </div>
            <Badge variant="secondary" className="text-xs">Home</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={() => navigate('/login')} className="hidden sm:flex">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/signup')} className="hidden sm:flex">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
              <Avatar className="h-8 w-8 sm:hidden">
                <AvatarFallback className="text-sm bg-primary text-white">GU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (buttons gated to login) */}
        <nav className="w-64 border-r bg-card min-h-screen hidden md:block">
          <div className="p-4 space-y-2">
            <Button variant="default" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/login')}>
              <FileText className="h-4 w-4 mr-2" />
              Documents (Login)
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/login')}>
              <Users className="h-4 w-4 mr-2" />
              Projects (Login)
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/login')}>
              <Search className="h-4 w-4 mr-2" />
              Search (Login)
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Hero/Intro with subtle animations */}
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border animate-fade-in">
            <div className="px-6 py-10 md:px-10">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                The KMRL Knowledge Lens Platform
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                An integrated, AI-powered system that ingests, understands, and disseminates information across KMRL—transforming documents into actionable knowledge.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate('/login')}>
                  <LogIn className="mr-2 h-5 w-5" /> Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                  <UserPlus className="mr-2 h-5 w-5" /> Create Account
                </Button>
              </div>
            </div>
          </section>

          {/* Four Layers */}
          <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>1) Ingestion & Unification Layer</CardTitle>
                <CardDescription>Consolidate information into a single, structured repository.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed">
                <p><strong>Unified Document Lake</strong>: A central cloud-based repository acting as the single source of truth.</p>
                <p><strong>Automated Ingestion</strong>: Connectors for email, SharePoint, cloud repositories.</p>
                <p><strong>OCR (Multilingual)</strong>: Digitize scanned PDFs/images (incl. WhatsApp) into machine-readable text.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>2) The Intelligence Engine (Core AI)</CardTitle>
                <CardDescription>Extract meaning and context from every document.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed">
                <p><strong>Classification</strong>: Auto tag by type and priority.</p>
                <p><strong>Named Entity Recognition</strong>: Extract dates, vendors, parts, codes, locations.</p>
                <p><strong>Summarization</strong>: Headline, abstractive summary, and action items.</p>
                <p><strong>Semantic Search</strong>: Vector embeddings enable natural language queries.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>3) Dissemination & Presentation Layer</CardTitle>
                <CardDescription>Deliver the right information to the right person.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed">
                <p><strong>Role-Based Dashboards</strong>: Tailored views for Engineers, Finance, Executives.</p>
                <p><strong>Proactive Alerts</strong>: Email/SMS/app notifications for high-priority items.</p>
                <p><strong>Conversational Assistant</strong>: Chatbot to query the knowledge base.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>4) Traceability & Feedback Layer</CardTitle>
                <CardDescription>Ensure trust, accountability, and continuous improvement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed">
                <p><strong>One-Click Traceability</strong>: Link every insight to the exact source.</p>
                <p><strong>Feedback Loop</strong>: User ratings improve AI quality over time.</p>
              </CardContent>
            </Card>
          </section>

          {/* Benefits */}
          <section className="mt-10 animate-fade-in">
            <h3 className="text-2xl font-bold text-foreground mb-4">How KMRL Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faster Decisions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Instant, pre-digested summaries and action items reduce latency.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Functional Awareness</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Engineering, Procurement, Safety and Finance stay in sync automatically.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Audit Ready</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  High-priority regulatory docs surfaced with full traceability.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Institutional Memory</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  A permanent, searchable digital brain retains knowledge.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Eliminate Duplication</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  One high-quality summary shared across teams reduces rework.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Cards */}
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="mb-2">Central Knowledge Hub</CardTitle>
              <CardDescription>All documents. One platform.</CardDescription>
              <div className="mt-4">
                <Button onClick={() => navigate('/login')}>Explore</Button>
              </div>
            </Card>
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="mb-2">AI-Powered Search</CardTitle>
              <CardDescription>Find insights, not just files.</CardDescription>
              <div className="mt-4">
                <Button variant="outline" onClick={() => navigate('/login')}>Try Search</Button>
              </div>
            </Card>
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="mb-2">Role-Based Dashboards</CardTitle>
              <CardDescription>Personalized, actionable views.</CardDescription>
              <div className="mt-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>View Samples</Button>
              </div>
            </Card>
          </section>

          {/* Demo Credentials */}
          <section className="mt-16 bg-white rounded-lg shadow-lg p-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-center mb-6">Try the Demo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Administrator</h4>
                <p className="text-sm text-red-700">ADM001</p>
                <p className="text-sm text-red-700">admin123</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Station Controller</h4>
                <p className="text-sm text-blue-700">STF001</p>
                <p className="text-sm text-blue-700">staff123</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Procurement Officer</h4>
                <p className="text-sm text-green-700">STF002</p>
                <p className="text-sm text-green-700">staff123</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Rolling Stock Engineer</h4>
                <p className="text-sm text-purple-700">STF003</p>
                <p className="text-sm text-purple-700">staff123</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;