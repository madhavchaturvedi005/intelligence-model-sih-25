import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface DocumentSummary {
  headline: string;
  keyPoints: string[];
  detailed: string;
}

interface Document {
  id: string;
  title: string;
  type: string;
  department: string;
  date: string;
  summary: DocumentSummary;
  priority: "high" | "medium" | "low";
  source: string;
}

interface DocumentCardProps {
  document: Document;
  expanded?: boolean;
}

export const DocumentCard = ({ document, expanded = false }: DocumentCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [summaryLevel, setSummaryLevel] = useState<"headline" | "keyPoints" | "detailed">("headline");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const renderSummary = () => {
    switch (summaryLevel) {
      case "headline":
        return <p className="text-foreground">{document.summary.headline}</p>;
      case "keyPoints":
        return (
          <ul className="space-y-1 text-foreground">
            {document.summary.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {point}
              </li>
            ))}
          </ul>
        );
      case "detailed":
        return <p className="text-foreground leading-relaxed">{document.summary.detailed}</p>;
    }
  };

  return (
    <Card
      className={`hover:shadow-medium transition-all duration-300 border-l-4 ${
        document.priority === "high"
          ? "border-l-red-500"
          : document.priority === "medium"
          ? "border-l-orange-500"
          : "border-l-green-500"
      }`}
      onClick={() => navigate(`/document/${document.id}`)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{document.title}</h3>
              {document.priority === "high" && (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(document.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{document.department}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {document.type}
            </Badge>
            <Badge className={`text-xs border ${getPriorityColor(document.priority)}`}>
              {document.priority}
            </Badge>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-xs font-medium text-primary">AI Summary</span>
            <div className="flex gap-1">
              <Button
                variant={summaryLevel === "headline" ? "default" : "outline"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setSummaryLevel("headline")}
              >
                L1
              </Button>
              <Button
                variant={summaryLevel === "keyPoints" ? "default" : "outline"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setSummaryLevel("keyPoints")}
              >
                L2
              </Button>
              <Button
                variant={summaryLevel === "detailed" ? "default" : "outline"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setSummaryLevel("detailed")}
              >
                L3
              </Button>
            </div>
          </div>
          <div className="bg-muted p-3 rounded-md text-sm">
            {renderSummary()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Source: {document.source}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                More
              </>
            )}
          </Button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Document Metadata</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>File: {document.source}</p>
                  <p>Department: {document.department}</p>
                  <p>Processed: {new Date(document.date).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">AI Analysis</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p>Confidence: 94%</p>
                  <p>Language: English</p>
                  <p>Entities: 12 identified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};