import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, TrendingUp, Clock, CheckCircle, AlertCircle, FileText, MessageSquare, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "Planning" | "In Progress" | "Review" | "Completed";
  completion: number;
  team: string[];
  lastUpdate: string;
  keyMilestones: string[];
  documentsCount: number;
  updatesCount: number;
  priority: "high" | "medium" | "low";
  startDate: string;
  endDate: string;
  assignedTo: string[];
}

interface EnhancedProjectCardProps {
  project: Project;
}

export const EnhancedProjectCard = ({ project }: EnhancedProjectCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "In Progress":
        return <TrendingUp className="h-4 w-4" />;
      case "Review":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDepartmentAvatar = (dept: string) => {
    const initials = dept.substring(0, 2).toUpperCase();
    return initials;
  };

  const handleViewDetails = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary cursor-pointer group" onClick={handleViewDetails}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              <span className="ml-1">{project.status}</span>
            </Badge>
            <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Updated {new Date(project.lastUpdate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{project.team.length} teams</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{project.documentsCount} docs</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{project.updatesCount} updates</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground mb-1">{project.completion}%</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress value={project.completion} className="h-2" />
      </div>

      {/* Team Avatars and Assigned Users */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Teams:</span>
          <div className="flex -space-x-2">
            {project.team.slice(0, 4).map((dept, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getDepartmentAvatar(dept)}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 4 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{project.team.length - 4}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Assigned:</span>
          <div className="flex -space-x-2">
            {project.assignedTo.slice(0, 3).map((user, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                  {user.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.assignedTo.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{project.assignedTo.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Milestones */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Recent Milestones</h4>
        <div className="space-y-2">
          {project.keyMilestones.slice(0, 2).map((milestone, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground line-clamp-1">{milestone}</span>
            </div>
          ))}
          {project.keyMilestones.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{project.keyMilestones.length - 2} more milestones
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
          <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}>
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
            <FileText className="h-3 w-3 mr-1" />
            Documents
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          {project.completion < 100 ? `${100 - project.completion}% remaining` : 'Completed'}
        </div>
      </div>
    </Card>
  );
};
