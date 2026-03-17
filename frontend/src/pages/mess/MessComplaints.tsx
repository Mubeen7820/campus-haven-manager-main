import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { complaintService, Complaint } from "@/services/complaintService";
import { supabase } from "@/lib/supabase";

const MessComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState("");

    const loadComplaints = useCallback(async () => {
        try {
            setIsLoading(true);
            const allComplaints = await complaintService.fetchComplaints();
            // Filter for 'Mess' or 'Other' (assuming 'Other' is often used for mess if 'Mess' category is new)
            const messComplaints = allComplaints.filter(c => c.category === 'Mess' || c.category === 'Other');
            setComplaints(messComplaints);
        } catch (error) {
            console.error("Error loading complaints:", error);
            toast.error("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadComplaints();

        const channel = supabase
            .channel('mess_complaints_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
                loadComplaints();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadComplaints]);

    const handleResolve = async () => {
        if (!responseText.trim()) {
            toast.error("Please enter a response");
            return;
        }

        if (selectedComplaint) {
            try {
                // We're using the status update, but in the future we might want to store the response too
                // For now, we'll just update the status to 'Resolved'
                await complaintService.updateComplaintStatus(selectedComplaint.id, 'Resolved');

                toast.success("Complaint resolved successfully");
                setSelectedComplaint(null);
                setResponseText("");
                loadComplaints(); // Reload
            } catch (error) {
                console.error("Failed to resolve complaint:", error);
                toast.error("Failed to resolve complaint");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading mess complaints...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Complaints"
                description="View and respond to student feedback"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {complaints.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                        No mess-related complaints found.
                    </div>
                ) : (
                    complaints.map((complaint) => (
                        <Card key={complaint.id} className="flex flex-col shadow-card border-border hover:shadow-elevated transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="overflow-hidden">
                                        <CardTitle className="text-base truncate">{complaint.students?.name || "Unknown Student"}</CardTitle>
                                        <CardDescription className="text-xs truncate">Room: {complaint.students?.rooms?.room_number || "N/A"}</CardDescription>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${complaint.status === "Resolved"
                                        ? "bg-success/10 text-success"
                                        : complaint.status === "In Progress"
                                            ? "bg-info/10 text-info"
                                            : "bg-warning/10 text-warning"
                                        }`}>
                                        {complaint.status}
                                    </div>
                                </div>
                                <CardDescription className="text-[10px] mt-1">
                                    {new Date(complaint.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="font-semibold text-sm mb-1">{complaint.title}</p>
                                <p className="text-sm text-muted-foreground">{complaint.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                {complaint.status !== "Resolved" ? (
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedComplaint(complaint)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" /> Reply & Resolve
                                    </Button>
                                ) : (
                                    <div className="flex items-center justify-center w-full text-sm text-success font-medium">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Resolved
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Respond to Complaint</DialogTitle>
                        <DialogDescription>
                            Review the student's complaint and provide a resolution response.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-3 bg-muted rounded-md text-sm border border-border">
                            <p className="font-semibold mb-1 text-primary">{selectedComplaint?.students?.name}:</p>
                            <p className="font-medium mb-1">{selectedComplaint?.title}</p>
                            <p className="text-muted-foreground">{selectedComplaint?.description}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Internal Note / Response</label>
                            <Textarea
                                placeholder="Typing a response will mark the complaint as resolved..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResolve}>Mark as Resolved</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessComplaints;
