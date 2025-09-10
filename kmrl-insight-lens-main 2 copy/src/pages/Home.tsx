import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Zap, Shield, Users, Brain, FileText, Clock, Target, Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 overflow-x-hidden">
      {/* Header */}
      <header className={`container mx-auto px-4 py-6 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
              <Brain className="w-6 h-6 text-primary-foreground animate-float" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              KMRL Knowledge Lens
            </span>
          </div>
          <Link to="/dashboard">
            <Button className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary-hover">
              Access Dashboard
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Badge className="mb-6 animate-scale-in shadow-lg" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Document Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent animate-fade-in">
                Transform Document Chaos
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent animate-fade-in-up">
                Into Clear Intelligence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              KMRL Knowledge Lens eliminates information overload by automatically processing, summarizing, 
              and delivering critical insights from thousands of documents to the right stakeholders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary-hover group">
                  Explore Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              {[
                { number: "1000+", label: "Documents Processed" },
                { number: "95%", label: "Time Saved" },
                { number: "24/7", label: "Real-time Processing" }
              ].map((stat, index) => (
                <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${0.8 + index * 0.2}s` }}>
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Demo Section */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-hover/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <Card className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for video */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-hover/5"></div>
                    <div className="text-center space-y-4 z-10">
                      <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30 hover:bg-primary/30 transition-all duration-300 cursor-pointer group animate-pulse-glow">
                        <Play className="w-8 h-8 text-primary ml-1 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">See Knowledge Lens in Action</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                          Watch how our AI transforms complex documents into actionable insights in seconds
                        </p>
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute top-4 left-4 animate-float">
                      <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: '1s' }}>
                      <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 animate-float" style={{ animationDelay: '2s' }}>
                      <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-3xl mx-4 my-16">
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
            <Clock className="w-4 h-4 mr-2" />
            Critical Challenge
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
            The Silent Productivity Tax
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            KMRL processes thousands of critical documents daily, creating information overload that slows decisions and increases risks.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "Information Latency",
              description: "Decision-making is slow as managers waste time finding actionable information in lengthy documents."
            },
            {
              icon: Users,
              title: "Siloed Awareness", 
              description: "Departments are disconnected, leading to inefficient and sometimes contradictory actions."
            },
            {
              icon: Shield,
              title: "Compliance Exposure",
              description: "Critical regulatory updates are easily missed, creating significant legal and safety risks."
            },
            {
              icon: Brain,
              title: "Knowledge Attrition",
              description: "Valuable expertise is lost when employees leave because it's locked in unsearchable files."
            },
            {
              icon: FileText,
              title: "Duplicated Effort",
              description: "Teams waste time independently creating summaries of the same documents."
            },
            {
              icon: Target,
              title: "Growing Complexity",
              description: "KMRL's expansion will exponentially increase the data burden without proper systems."
            }
          ].map((problem, index) => (
            <Card key={index} className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <problem.icon className="w-8 h-8 text-destructive mb-4" />
                <h3 className="font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Solution Overview */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl mx-4 my-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="text-center mb-16 relative z-10 animate-fade-in-up">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            Intelligent Solution
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            The KMRL Knowledge Lens Solution
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            An AI-powered platform that automatically delivers rapid, trustworthy, and relevant summaries 
            of critical information to every stakeholder.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {[
            {
              icon: FileText,
              title: "Unified Ingestion",
              description: "Automatically collect documents from all sources into a central repository",
              features: ["Email monitoring", "SharePoint sync", "OCR for scans", "WhatsApp integration"]
            },
            {
              icon: Brain,
              title: "AI Intelligence",
              description: "Process documents to extract meaning, classify, and summarize content",
              features: ["Auto-classification", "Entity extraction", "Multi-level summaries", "Semantic search"]
            },
            {
              icon: Zap,
              title: "Smart Delivery",
              description: "Push relevant information to the right people through personalized dashboards",
              features: ["Role-based views", "Proactive alerts", "Mobile access", "Real-time updates"]
            },
            {
              icon: Search,
              title: "Full Traceability",
              description: "Maintain clear links to source documents with feedback mechanisms",
              features: ["Source verification", "Audit trails", "Quality feedback", "Continuous learning"]
            }
          ].map((solution, index) => (
            <Card key={index} className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <solution.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{solution.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>
                <ul className="space-y-1">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-center">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge className="mb-6 bg-success/10 text-success border-success/20">
            <Target className="w-4 h-4 mr-2" />
            Immediate Impact
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">
            Transform Your Operations
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See immediate improvements across all departments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Instant decision-making with pre-digested summaries",
            "Cross-functional awareness eliminates departmental silos", 
            "Automated compliance monitoring reduces legal risks",
            "Permanent institutional knowledge preservation",
            "Eliminate duplicated summarization efforts",
            "Scale operations safely and efficiently"
          ].map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-gradient-to-br from-card to-card-hover border border-border/50 hover:border-success/30 transition-all duration-300 hover:scale-105 animate-fade-in-up group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-6 h-6 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-hover/20 to-primary/20 rounded-3xl blur-3xl"></div>
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary-hover text-primary-foreground relative overflow-hidden shadow-2xl border-0 animate-scale-in">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <CardContent className="p-12 relative z-10">
              <Brain className="w-16 h-16 mx-auto mb-6 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Document Workflow?</h2>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Experience the power of AI-driven document intelligence and eliminate information overload today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="text-lg px-8 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                    Access Your Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <Play className="mr-2 w-5 h-5" />
                  Schedule Demo
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm opacity-80">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">ISO 27001</div>
                  <div className="text-sm opacity-80">Certified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">GDPR</div>
                  <div className="text-sm opacity-80">Compliant</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border/50 bg-gradient-to-r from-muted/30 to-muted/10 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              KMRL Knowledge Lens
            </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Intelligent Document Processing for Modern Organizations
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Advanced AI • Built for Scale • Secured by Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;