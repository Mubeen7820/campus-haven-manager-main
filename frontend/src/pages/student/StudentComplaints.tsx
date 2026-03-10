import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { complaintService, Complaint } from "@/services/complaintService";
import { studentService, Student } from "@/services/studentService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  "In Progress": "bg-info/10 text-info",
  Resolved: "bg-success/10 text-success",
};

const StudentComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Other" as Complaint['category'],
    description: "",
    priority: "Medium" as Complaint['priority'],
  });

  const loadStudentAndComplaints = useCallback(async () => {
    try {
      if (!user) return;

      // 1. Get Student Profile linked to User
      const student = await studentService.getStudentByProfileId(user.id);
      setStudentProfile(student);

      if (student) {
        // Fetch only this student's complaints
        const myComplaints = await complaintService.fetchComplaintsByStudentId(student.id);
        setComplaints(myComplaints);
      } else {
        setComplaints([]);
      }

    } catch (error) {
      console.error("Error loading complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStudentAndComplaints();
    }
  }, [user, loadStudentAndComplaints]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!studentProfile) {
      toast.error("Student profile not found. Cannot submit complaint.");
      return;
    }

    try {
      await complaintService.createComplaint({
        student_id: studentProfile.id,
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        status: 'Pending',
      });

      toast.success("Complaint submitted successfully");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        category: "Other",
        description: "",
        priority: "Medium",
      });
      loadStudentAndComplaints(); // Reload
    } catch (error) {
      console.error("Failed to submit complaint:", error);
      toast.error("Failed to submit complaint");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading complaints...</div>;
  }

  return (
    <div>
      <PageHeader
        title="My Complaints"
        description="Submit and track your complaints"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!studentProfile}><Plus className="w-4 h-4 mr-2" />New Complaint</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Complaint</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Subject</Label>
                  <Input
                    id="title"
                    placeholder="e.g. AC not working"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => handleInputChange("category", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                        <SelectItem value="Mess">Mess</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(val) => handleInputChange("priority", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Complaint</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-12 px-4 text-muted-foreground bg-card rounded-xl border border-dashed">
            {studentProfile ? (
              "No complaints found. Everything seems good!"
            ) : (
              <div className="space-y-3">
                <p className="text-destructive font-medium">Student profile not linked!</p>
                <p className="text-xs max-w-xs mx-auto">
                  Your user account is not yet linked to a student record.
                  Please ask the administrator to add your email ({user?.email}) in the student management section.
                </p>
                <Button variant="outline" size="sm" onClick={() => loadStudentAndComplaints()}>
                  Check Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          complaints.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{c.title}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{c.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.priority === 'High' ? 'bg-red-100 text-red-700' :
                      c.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                      {c.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted: {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[c.status]}`}>{c.status}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentComplaints;
