import { motion } from "framer-motion";
interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
}
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
export default function HowItWorksStep({ step, title, description }: HowItWorksStepProps) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
        {step}
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </motion.div>
  );
}