'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, FileText, Scale } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, profile details)",
        "Conversation content and interaction data",
        "Usage patterns and preferences",
        "Technical information (device type, browser, IP address)"
      ]
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        "Provide personalized AI conversation experiences",
        "Improve our AI models and service quality",
        "Generate insights and analytics for your benefit",
        "Ensure platform security and prevent abuse"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "End-to-end encryption for all conversations",
        "Secure cloud storage with enterprise-grade protection",
        "Regular security audits and compliance checks",
        "Limited access controls for authorized personnel only"
      ]
    },
    {
      icon: Eye,
      title: "Your Privacy Rights",
      content: [
        "Access and download your personal data",
        "Correct or update your information",
        "Delete your account and associated data",
        "Opt-out of data processing for marketing purposes"
      ]
    },
    {
      icon: UserCheck,
      title: "Data Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Anonymous, aggregated data may be used for research",
        "Required disclosures only when legally mandated",
        "Service providers bound by strict confidentiality agreements"
      ]
    },
    {
      icon: Scale,
      title: "Compliance",
      content: [
        "GDPR compliant for European users",
        "CCPA compliant for California residents",
        "SOC 2 Type II certified security practices",
        "Regular third-party privacy assessments"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is our priority. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                At VivaTalk, we believe in transparent and ethical data practices. Our AI-powered conversation platform 
                is designed with privacy by design principles, ensuring your personal information and conversations 
                remain secure and confidential. This privacy policy outlines our commitment to protecting your data 
                while providing you with meaningful AI interactions.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-primary to-secondary w-10 h-10 rounded-lg flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-muted-foreground">
                        <span className="text-primary mt-1 text-xs">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Questions About Your Privacy?</CardTitle>
              <CardDescription className="text-lg">
                We're here to help and ensure your data is protected
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy or how we handle your data, 
                please don't hesitate to contact our privacy team.
              </p>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Email:</strong> privacy@vivatalk.com
                </div>
                <div className="text-sm">
                  <strong>Data Protection Officer:</strong> dpo@vivatalk.com
                </div>
                <div className="text-sm">
                  <strong>Mailing Address:</strong> VivaTalk Privacy Team, 123 AI Street, Tech City, TC 12345
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}