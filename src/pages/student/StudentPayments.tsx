import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreditCard, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService, Payment } from "@/services/paymentService";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";

const StudentPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        if (!user) return;

        const student = await studentService.getStudentByProfileId(user.id);

        const allPayments = await paymentService.fetchPayments();
        if (student) {
          const myPayments = allPayments.filter(p => p.student_id === student.id);
          setPayments(myPayments);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error("Failed to load payments:", error);
        toast.error("Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadPayments();
    }
  }, [user]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading payments...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        description="View and manage your fee payments"
        action={<Button><CreditCard className="w-4 h-4 mr-2" />Pay Now</Button>}
      />

      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">No payment history found.</td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-6 font-medium">{p.type}</td>
                    <td className="py-3 px-6">₹{p.amount.toLocaleString()}</td>
                    <td className="py-3 px-6 text-muted-foreground">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "Paid" ? "bg-success/10 text-success" :
                        p.status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {p.status === "Paid" ? (
                        <button className="flex items-center gap-1 text-primary hover:underline text-xs">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      ) : "-"}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;
