import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { BedDouble, Wifi, Wind, Bath } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService, Student } from "@/services/studentService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StudentRoom = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!user?.id) return;
      try {
        const data = await studentService.getStudentByProfileId(user.id);
        setStudent(data);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
        toast.error("Failed to fetch room details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [user?.id]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading room details...</div>;
  }

  if (!student) {
    return (
      <div>
        <PageHeader title="My Room" description="Your hostel room details" />
        <div className="bg-card rounded-xl p-8 text-center border border-border">
          <h3 className="text-lg font-medium text-muted-foreground">Student record not found.</h3>
          <p className="text-sm text-muted-foreground mt-2">Please contact the admin to update your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Room" description="Your hostel room details" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-lg mb-4">Room Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Block</span>
              <span className="font-medium text-sm">{student.rooms?.block || "Not Assigned"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Room Number</span>
              <span className="font-medium text-sm">{student.rooms?.room_number || "Not Assigned"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Type</span>
              <span className="font-medium text-sm">Standard</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-muted-foreground text-sm">Admission No</span>
              <span className="font-medium text-sm">{student.admission_no}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
          <h3 className="font-display font-semibold text-lg mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BedDouble, label: "Bed", available: !!student.rooms },
              { icon: Wifi, label: "Wi-Fi", available: true },
              { icon: Wind, label: "Air Conditioning", available: false }, // Assuming non-AC for now or need to fetch from room type
              { icon: Bath, label: "Attached Bathroom", available: false },
            ].map((a) => (
              <div key={a.label} className={`p-4 rounded-lg border ${a.available ? "bg-green-500/5 border-green-500/20" : "bg-muted border-border"}`}>
                <a.icon className={`w-5 h-5 mb-2 ${a.available ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium">{a.label}</p>
                <p className={`text-xs ${a.available ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>{a.available ? "Available" : "Not Available"}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRoom;
