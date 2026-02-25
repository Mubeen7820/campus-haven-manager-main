import { useState } from "react";
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
    DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

interface Complaint {
    id: string;
    studentName: string;
    description: string;
    category: "Mess";
    status: "Pending" | "Resolved";
    date: string;
    response?: string;
}

const mockComplaints: Complaint[] = [
    { id: "1", studentName: "Rahul Verma", description: "Lunch was cold today.", category: "Mess", status: "Pending", date: "2024-03-14" },
    { id: "2", studentName: "Priya Sharma", description: "Need more variety in breakfast.", category: "Mess", status: "Resolved", date: "2024-03-12", response: "We will update the menu next week." },
    { id: "3", studentName: "Amit Kumar", description: "Found a hair in the दाल.", category: "Mess", status: "Pending", date: "2024-03-15" },
];

const MessComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState("");

    const handleResolve = () => {
        if (!responseText.trim()) {
            toast.error("Please enter a response");
            return;
        }

        if (selectedComplaint) {
            setComplaints((prev) =>
                prev.map((c) =>
                    c.id === selectedComplaint.id
                        ? { ...c, status: "Resolved", response: responseText }
                        : c
                )
            );
            toast.success("Complaint resolved successfully");
            setSelectedComplaint(null);
            setResponseText("");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mess Complaints"
                description="View and respond to student feedback"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {complaints.map((complaint) => (
                    <Card key={complaint.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base truncate">{complaint.studentName}</CardTitle>
                                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${complaint.status === "Resolved"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    }`}>
                                    {complaint.status}
                                </div>
                            </div>
                            <CardDescription className="text-xs">{complaint.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm">{complaint.description}</p>
                            {complaint.response && (
                                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                                    <p className="font-semibold text-xs text-muted-foreground mb-1">Response:</p>
                                    {complaint.response}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            {complaint.status === "Pending" ? (
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => setSelectedComplaint(complaint)}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" /> Reply & Resolve
                                </Button>
                            ) : (
                                <div className="flex items-center justify-center w-full text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Resolved
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Respond to Complaint</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-3 bg-muted rounded-md text-sm">
                            <p className="font-semibold mb-1">{selectedComplaint?.studentName}:</p>
                            <p>{selectedComplaint?.description}</p>
                        </div>
                        <Textarea
                            placeholder="Type your response here..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleResolve}>Resolve Complaint</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessComplaints;
