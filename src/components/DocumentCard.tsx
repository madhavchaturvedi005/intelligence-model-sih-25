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
          </div>
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="text-foreground">{document.summary.headline}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center">
          <Button variant="outline" size="sm" className="text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};