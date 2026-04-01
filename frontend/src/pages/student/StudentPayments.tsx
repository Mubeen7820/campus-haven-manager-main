import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreditCard, Download, Loader2, CheckCircle2, ChevronDown, Share2, Plus, Info, ShieldCheck, User, QrCode, Clock, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService, Payment } from "@/services/paymentService";
import { studentService } from "@/services/studentService";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const StudentPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [paymentOutcome, setPaymentOutcome] = useState<'Success' | 'Pending' | 'Rejected'>('Success');
  const [timeLeft, setTimeLeft] = useState(30);
  const [pendingPayment, setPendingPayment] = useState<Payment | null>(null);

  const handlePayNow = () => {
    if (!pendingPayment) {
      toast.info("You have no pending payments at this time.");
      return;
    }
    setIsScannerOpen(true);
    setTimeLeft(30);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isScannerOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isScannerOpen && timeLeft === 0) {
      setIsScannerOpen(false);
      
      // Determine outcome (Randomized for demo purposes as requested)
      const outcomes: ('Success' | 'Pending' | 'Rejected')[] = ['Success', 'Pending', 'Rejected'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setPaymentOutcome(randomOutcome);
      setIsOutcomeModalOpen(true);
    }
    return () => clearInterval(timer);
  }, [isScannerOpen, timeLeft]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        if (!user) return;

        const student = await studentService.getStudentByProfileId(user.id);
        
        if (student) {
          const [allPayments, currentPending] = await Promise.all([
            paymentService.fetchPayments(),
            paymentService.getPendingPaymentForStudent(student.id)
          ]);
          
          const myPayments = allPayments.filter(p => p.student_id === student.id);
          setPayments(myPayments);
          setPendingPayment(currentPending);
        } else {
          setPayments([]);
          setPendingPayment(null);
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
        action={<Button onClick={handlePayNow}><CreditCard className="w-4 h-4 mr-2" />Pay Now</Button>}
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
      {/* Payment Scanner Modal - Simplified to show only QR */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="sm:max-w-xs p-6 bg-white border-none shadow-3xl rounded-[32px] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Payment Scanner</DialogTitle>
            <DialogDescription>Use your UPI app to scan and pay the current fee.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">Scan to Pay</h3>
              {pendingPayment && (
                <p className="text-primary font-bold text-lg">₹{pendingPayment.amount.toLocaleString()}</p>
              )}
            </div>

            {/* Payment QR Image Display */}
            <div className="relative overflow-hidden rounded-[32px] shadow-2xl border border-slate-100 transition-all duration-500 hover:scale-[1.05]">
              <div className="w-full max-w-[280px] aspect-[4/5] bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/payment-qr.png" 
                  alt="Payment QR" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const amount = pendingPayment?.amount || 0;
                    const upiId = "shaik.mubeen@upi"; // Placeholder
                    const studentName = user?.name || "Student";
                    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(studentName)}&am=${amount}&cu=INR`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x350&data=${encodeURIComponent(upiUrl)}&bgcolor=ffffff&color=000000`;
                    
                    e.currentTarget.src = qrUrl;
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            </div>

            {/* Timer and Instructions */}
            <div className="text-center space-y-4 w-full">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment active...</p>
              
              <div className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-2xl border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <p className="text-sm font-bold text-slate-600">Completing in <span className="text-slate-900 font-black tabular-nums">{timeLeft}s</span></p>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setIsScannerOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                Cancel Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Outcome Modal */}
      <Dialog open={isOutcomeModalOpen} onOpenChange={setIsOutcomeModalOpen}>
        <DialogContent className="sm:max-w-md bg-white border-none shadow-3xl p-0 overflow-hidden rounded-[32px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Payment {paymentOutcome}</DialogTitle>
            <DialogDescription>Details regarding your transaction result.</DialogDescription>
          </DialogHeader>
          
          <div className={`p-8 text-center bg-gradient-to-b ${
            paymentOutcome === 'Success' ? 'from-emerald-50' : 
            paymentOutcome === 'Pending' ? 'from-amber-50' : 'from-red-50'
          } to-white`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                paymentOutcome === 'Success' ? 'bg-emerald-100 shadow-emerald-500/20' : 
                paymentOutcome === 'Pending' ? 'bg-amber-100 shadow-amber-500/20' : 'bg-red-100 shadow-red-500/20'
              }`}
            >
              {paymentOutcome === 'Success' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
              {paymentOutcome === 'Pending' && <Clock className="w-12 h-12 text-amber-500 animate-pulse" />}
              {paymentOutcome === 'Rejected' && <XCircle className="w-12 h-12 text-red-500" />}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                {paymentOutcome === 'Success' ? 'Congratulations!' : 
                 paymentOutcome === 'Pending' ? 'Payment Pending' : 'Payment Failed'}
              </h2>
              <p className="text-slate-500 font-medium mb-8 px-4">
                {paymentOutcome === 'Success' && (
                  <>Your payment of <span className="text-slate-900 font-bold">₹{(pendingPayment?.amount || 0).toLocaleString()}</span> has been successfully processed. The receipt is now available.</>
                )}
                {paymentOutcome === 'Pending' && (
                  <>We are verifying your transaction with the bank. Please check back in a few minutes to confirm your status.</>
                )}
                {paymentOutcome === 'Rejected' && (
                  <>Unfortunately, the transaction could not be completed at this time. Please try again or use a different payment method.</>
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button 
                onClick={() => setIsOutcomeModalOpen(false)} 
                className={`w-full h-14 text-white rounded-2xl font-bold shadow-xl transition-all hover:scale-[1.02] ${
                  paymentOutcome === 'Success' ? 'bg-slate-900 shadow-slate-900/10' : 
                  paymentOutcome === 'Pending' ? 'bg-amber-600 shadow-amber-600/10' : 'bg-red-600 shadow-red-600/10'
                }`}
              >
                {paymentOutcome === 'Rejected' ? 'Try Again' : 'Continue Flow'}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsOutcomeModalOpen(false)}
                className="w-full text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                View Transaction History
              </Button>
            </motion.div>
          </div>
          
          {/* Decorative circles with dynamic colors */}
          <div className={`absolute top-0 left-0 w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2 ${
            paymentOutcome === 'Success' ? 'bg-emerald-400/10' : 
            paymentOutcome === 'Pending' ? 'bg-amber-400/10' : 'bg-red-400/10'
          }`} />
          <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full translate-x-1/3 translate-y-1/3 ${
            paymentOutcome === 'Success' ? 'bg-blue-400/10' : 
            paymentOutcome === 'Pending' ? 'bg-amber-400/10' : 'bg-red-400/10'
          }`} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPayments;
