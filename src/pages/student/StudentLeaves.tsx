import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { leafService, Leaf } from "@/services/leafService";
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
  Approved: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

const StudentLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: "Leave" as Leaf['type'],
    reason: "",
    start_date: "",
    end_date: "",
  });

  const loadStudentAndLeaves = useCallback(async () => {
    try {
      if (!user) return;

      const student = await studentService.getStudentByProfileId(user.id);
      setStudentProfile(student);

      if (student) {
        const myLeaves = await leafService.fetchLeavesByStudentId(student.id);
        setLeaves(myLeaves);
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error("Failed to load leaves:", error);
      toast.error("Failed to load leave requests");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadStudentAndLeaves();
    }
  }, [user, loadStudentAndLeaves]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!studentProfile || !user) {
      toast.error("Student profile not found. Cannot apply for leave.");
      return;
    }

    try {
      await leafService.createLeaf({
        student_id: studentProfile.id,
        user_id: user.id,
        type: formData.type,
        reason: formData.reason,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),

      });

      toast.success("Leave application submitted");
      setIsDialogOpen(false);
      setFormData({
        type: "Leave",
        reason: "",
        start_date: "",
        end_date: "",
      });
      loadStudentAndLeaves();
    } catch (error) {
      console.error("Failed to submit leave:", error);
      toast.error("Failed to submit leave application");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading leaves...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Leave Requests"
        description="Manage your leave applications"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!studentProfile}><Plus className="w-4 h-4 mr-2" />Apply Leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => handleInputChange("type", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leave">Leave</SelectItem>
                      <SelectItem value="Outing">Outing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">From Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange("start_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">To Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange("end_date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Reason for leave/outing..."
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit Application</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-4">
        {leaves.length === 0 ? (
          <div className="text-center py-12 px-4 text-muted-foreground bg-card rounded-xl border border-dashed">
            {studentProfile ? (
              "No leave requests found."
            ) : (
              <div className="space-y-3">
                <p className="text-destructive font-medium">Student profile not linked!</p>
                <p className="text-xs max-w-xs mx-auto">
                  Your user account is not yet linked to a student record.
                  Please ask the administrator to add your email ({user?.email}) in the student management section.
                </p>
                <Button variant="outline" size="sm" onClick={() => loadStudentAndLeaves()}>
                  Check Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          leaves.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{l.reason}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{l.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(l.start_date).toLocaleDateString()} → {new Date(l.end_date).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentLeaves;

