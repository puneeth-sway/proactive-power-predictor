
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LineChart, AlertTriangle, Gauge } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  // Add smooth scroll effect
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);
  
  // Function to navigate to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  // Use framer-motion to create enhanced animations 
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
                <Gauge className="mr-2 h-4 w-4" />
                Proactive Power Prediction
              </div>
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Predict issues before they become problems
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground mb-8"
            >
              Our AI-powered system analyzes patterns and detects early warning signs to help you
              maintain peak performance and prevent costly breakdowns.
            </motion.p>
            
            <motion.div variants={fadeIn}>
              <Button size="lg" onClick={goToDashboard} className="animate-pulse-slow">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform transforms data into actionable insights to protect your investments
              and improve customer satisfaction.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
                title: "Early Warning Detection",
                description: "Identify potential system failures before they occur through advanced pattern recognition."
              },
              {
                icon: <LineChart className="h-8 w-8 text-primary" />,
                title: "Performance Prediction",
                description: "Visualize system performance trends and forecast maintenance needs with precision."
              },
              {
                icon: <Gauge className="h-8 w-8 text-green-500" />,
                title: "Proactive Notifications",
                description: "Automatically alert homeowners and installers when maintenance is needed."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-background rounded-lg p-6 shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="size-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={goToDashboard}>
              View System Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to transform reactive maintenance into proactive care?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start monitoring your systems today and prevent costly failures before they happen.
            </p>
            <Button size="lg" onClick={goToDashboard}>
              Launch Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2023 PowerPredictor. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">Privacy</Button>
              <Button variant="ghost" size="sm">Terms</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
