import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { messService, MessMenu } from "@/services/messService";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const StudentMenu = () => {
  const [menu, setMenu] = useState<MessMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMenu = async () => {
    try {
      const data = await messService.fetchMenu();
      setMenu(data);
    } catch (error) {
      console.error("Failed to load menu:", error);
      toast.error("Failed to load mess menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('mess_menu_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mess_menu'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          loadMenu();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getMenuItems = (day: string, meal: string) => {
    return menu.find(m => m.day_of_week === day && m.meal_type === meal)?.items || "-";
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading menu...</div>;
  }

  return (
    <div>
      <PageHeader title="Mess Menu" description="Weekly mess menu schedule" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">Day</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">🌅 Breakfast</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">☀️ Lunch</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">🌙 Dinner</th>
                <th className="text-left py-5 px-6 font-semibold text-muted-foreground text-lg">☕ Snacks</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-5 px-6 font-semibold text-lg">{day}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Breakfast')}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Lunch')}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Dinner')}</td>
                  <td className="py-5 px-6 text-muted-foreground text-base">{getMenuItems(day, 'Snacks')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentMenu;
