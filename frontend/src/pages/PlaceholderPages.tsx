import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";

const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div>
    <PageHeader title={title} description={description} />
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-12 shadow-card border border-border text-center">
      <p className="text-muted-foreground">This feature will be available soon with Lovable Cloud integration.</p>
    </motion.div>
  </div>
);











