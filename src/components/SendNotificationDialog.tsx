
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NotificationType } from "@/utils/mockData";
import { sendNotificationToRecipients } from "@/services/notificationService";

interface SendNotificationDialogProps {
  contractorId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const SendNotificationDialog = ({ 
  contractorId, 
  trigger, 
  onSuccess 
}: SendNotificationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<string>(NotificationType.GENERAL);
  const [recipientType, setRecipientType] = useState<"homeowners" | "installers" | "both">("both");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      await sendNotificationToRecipients({
        contractorId,
        type,
        title,
        message,
        recipientType,
        scheduledFor: date?.toISOString()
      });
      
      toast.success("Notification sent successfully");
      setOpen(false);
      resetForm();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType(NotificationType.GENERAL);
    setRecipientType("both");
    setDate(undefined);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send Notifications
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Notification Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NotificationType.GENERAL}>General</SelectItem>
                <SelectItem value={NotificationType.WARNING}>Warning</SelectItem>
                <SelectItem value={NotificationType.CRITICAL_ALERT}>Critical Alert</SelectItem>
                <SelectItem value={NotificationType.MAINTENANCE_DUE}>Maintenance Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Recipients</Label>
            <RadioGroup
              value={recipientType}
              onValueChange={(value) => 
                setRecipientType(value as "homeowners" | "installers" | "both")
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="homeowners" id="homeowners" />
                <Label htmlFor="homeowners">Homeowners only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="installers" id="installers" />
                <Label htmlFor="installers">Installers only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both homeowners and installers</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Schedule for later (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <span className="mr-2">...</span>}
              Send Notification
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationDialog;
