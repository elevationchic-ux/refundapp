'use client';

import { motion } from 'framer-motion';
import { Search, FileText, Shield, AlertTriangle, CheckCircle, Clock, Globe, Scale, Users, FileCheck, MessageSquare, TrendingUp, Lock } from 'lucide-react';

const InvestigationReviewPage = () => {
  const investigationSteps = [
    {
      step: "01",
      title: "Initial Assessment",
      description: "Our team conducts a comprehensive review of your case, analyzing the nature of the scam, the amount lost, and the available evidence. We assess the recovery probability and develop a tailored strategy for your specific situation.",
      icon: <Search className="w-8 h-8" />,
      details: [
        "Case intake and documentation review",
        "Scam type identification and categorization",
        "Recovery probability assessment",
        "Strategy development and timeline estimation"
      ]
    },
    {
      step: "02",
      title: "Evidence Collection",
      description: "We systematically gather and organize all relevant evidence including transaction records, communication logs, screenshots, and any documentation related to the scam. This evidence is crucial for building a strong recovery case.",
      icon: <FileText className="w-8 h-8" />,
      details: [
        "Bank statements and transaction records",
        "Email and communication logs",
        "Screenshots and digital evidence",
        "Contract and agreement documentation"
      ]
    },
    {
      step: "03",
      title: "Financial Analysis",
      description: "Our financial experts trace the movement of your funds through the financial system, identifying where the money went and which institutions were involved. This analysis helps determine the best recovery approach.",
      icon: <TrendingUp className="w-8 h-8" />,
      details: [
        "Fund tracing and pathway analysis",
        "Identification of involved financial institutions",
        "Assessment of fund availability",
        "Recovery route optimization"
      ]
    },
    {
      step: "04",
      title: "Bank Liaison",
      description: "We establish direct communication with relevant banks and financial institutions, presenting your case professionally and advocating for fund recovery. Our banking relationships and expertise significantly improve success rates.",
      icon: <Shield className="w-8 h-8" />,
      details: [
        "Professional documentation preparation",
        "Bank relationship management",
        "Regulatory compliance navigation",
        "Negotiation and advocacy"
      ]
    },
    {
      step: "05",
      title: "Regulatory Engagement",
      description: "When necessary, we engage with regulatory bodies and financial authorities to strengthen your case. This includes filing formal complaints and leveraging regulatory frameworks to support recovery efforts.",
      icon: <Scale className="w-8 h-8" />,
      details: [
        "Regulatory body identification",
        "Formal complaint filing",
        "Compliance requirement navigation",
        "Authority relationship management"
      ]
    },
    {
      step: "06",
      title: "International Coordination",
      description: "For cross-border cases, we coordinate with international partners and leverage our global network to pursue recovery across jurisdictions. This includes navigating international banking regulations and legal frameworks.",
      icon: <Globe className="w-8 h-8" />,
      details: [
        "International partner coordination",
        "Cross-border regulatory navigation",
        "Multi-jurisdiction strategy",
        "International legal framework compliance"
      ]
    },
    {
      step: "07",
      title: "Legal Support",
      description: "When recovery efforts require legal intervention, we work with our network of legal professionals to provide necessary legal support. This includes preparing legal documentation and engaging with legal processes when appropriate.",
      icon: <Scale className="w-8 h-8" />,
      details: [
        "Legal assessment and strategy",
        "Documentation preparation",
        "Legal partner coordination",
        "Court process support"
      ]
    },
    {
      step: "08",
      title: "Progress Monitoring",
      description: "Throughout the investigation, we continuously monitor progress, provide regular updates, and adjust our strategy as needed. You'll have visibility into the status of your case at all times.",
      icon: <Clock className="w-8 h-8" />,
      details: [
        "Regular status updates",
        "Progress tracking and reporting",
        "Strategy adjustment as needed",
        "Timeline management"
      ]
    },
    {
      step: "09",
      title: "Resolution & Recovery",
      description: "Once recovery is achieved, we ensure proper fund transfer and closure of your case. We also provide guidance on preventing future scams and securing your financial information.",
      icon: <CheckCircle className="w-8 h-8" />,
      details: [
        "Fund transfer coordination",
        "Case closure and documentation",
        "Recovery confirmation",
        "Future prevention guidance"
      ]
    },
    {
      step: "10",
      title: "Post-Recovery Support",
      description: "After successful recovery, we continue to provide support including security recommendations, monitoring for related fraud attempts, and ongoing guidance to protect your financial wellbeing.",
      icon: <Lock className="w-8 h-8" />,
      details: [
        "Security recommendations",
        "Ongoing monitoring support",
        "Future fraud prevention",
        "Financial wellbeing guidance"
      ]
    }
  ];

  const timelineMilestones = [
    { phase: "Case Initiation", duration: "1-2 days", description: "Initial assessment and strategy development" },
    { phase: "Evidence Gathering", duration: "3-5 days", description: "Collection and organization of all evidence" },
    { phase: "Financial Analysis", duration: "5-7 days", description: "Fund tracing and pathway analysis" },
    { phase: "Bank Engagement", duration: "7-14 days", description: "Communication with financial institutions" },
    { phase: "Recovery Process", duration: "14-30 days", description: "Active recovery and resolution efforts" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Search className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Scam Investigation Review Process</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive investigation process ensures the highest probability of fund recovery through systematic analysis, professional engagement, and strategic coordination.
          </p>
        </motion.div>

        {/* Investigation Steps */}
        <div className="space-y-8 mb-16">
          {investigationSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-indigo-600">{step.step}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Typical Investigation Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
            {timelineMilestones.map((milestone, index) => (
              <div key={index} className="relative flex items-start mb-6 last:mb-0">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">{milestone.phase}</h4>
                    <span className="text-sm text-indigo-600 font-medium">{milestone.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Factors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Key Success Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-white" />
                <h4 className="font-bold text-white">Speed of Action</h4>
              </div>
              <p className="text-indigo-100 text-sm">Quick reporting significantly increases recovery chances</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-5 h-5 text-white" />
                <h4 className="font-bold text-white">Evidence Quality</h4>
              </div>
              <p className="text-indigo-100 text-sm">Comprehensive documentation strengthens recovery efforts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h4 className="font-bold text-white">Scam Complexity</h4>
              </div>
              <p className="text-indigo-100 text-sm">Complex scams may require additional time and resources</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Investigation?</h2>
          <p className="text-gray-600 mb-6">
            Our team is ready to guide you through the investigation process with expertise and dedication.
          </p>
          <a
            href="/claim"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
          >
            Start Your Free Assessment
            <Search className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestigationReviewPage;