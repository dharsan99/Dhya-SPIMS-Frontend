import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  CogIcon,
  ExclamationCircleIcon,
  ChartBarSquareIcon,
  LightBulbIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Typing Animation Component
const TypingAnimation = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
      {displayedText}
      <span className="animate-pulse">|</span>
    </div>
  );
};

// AI Insights Card Component
const AIInsightsCard = ({ 
  title, 
  insight, 
  isGenerating, 
  onGenerate 
}: { 
  title: string; 
  insight?: string; 
  isGenerating: boolean; 
  onGenerate: () => void; 
}) => {
  console.log(`AIInsightsCard render - ${title}:`, { insight, isGenerating });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            isGenerating
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              Generate
            </div>
          )}
        </button>
      </div>
      <div className="min-h-[60px]">
        {insight ? (
          <TypingAnimation text={insight} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click generate to get AI insights for this metric
          </p>
        )}
      </div>
    </div>
  );
};

// AI Insights Panel Component
const AIInsightsPanel = ({ 
  insights, 
  loading, 
  onApplyRecommendation 
}: { 
  insights: Array<{
    id: string;
    type: 'optimization' | 'alert' | 'prediction' | 'recommendation';
    title: string;
    description: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    category: 'production' | 'financial' | 'quality' | 'sustainability';
    actionable: boolean;
    action?: string;
    timestamp: Date;
  }>;
  loading: boolean;
  onApplyRecommendation: (id: string) => void;
}) => {
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <CogIcon className="w-5 h-5" />;
      case 'alert': return <ExclamationCircleIcon className="w-5 h-5" />;
      case 'prediction': return <ChartBarSquareIcon className="w-5 h-5" />;
      case 'recommendation': return <LightBulbIcon className="w-5 h-5" />;
      default: return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {insights.length} insights
        </span>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  {getTypeIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getImpactColor(insight.impact)} bg-opacity-10`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Confidence: {insight.confidence}%</span>
                    <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {insight.actionable && insight.action && (
                <button
                  onClick={() => onApplyRecommendation(insight.id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                >
                  {insight.action}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// AI Insights Context Types
interface AIInsightsContextType {
  // State
  aiInsights: { [key: string]: string };
  generatingInsights: { [key: string]: boolean };
  showAiInsights: boolean;
  
  // Actions
  setShowAiInsights: (show: boolean) => void;
  generateInsight: (metricKey: string) => void;
  clearInsights: () => void;
  
  // Components
  AIInsightsCard: typeof AIInsightsCard;
  AIInsightsPanel: typeof AIInsightsPanel;
}

// Create Context
const AIInsightsContext = createContext<AIInsightsContextType | undefined>(undefined);

// AI Insights Provider Component
interface AIInsightsProviderProps {
  children: ReactNode;
}

export const AIInsightsProvider: React.FC<AIInsightsProviderProps> = ({ children }) => {
  // AI Insights State
  const [aiInsights, setAiInsights] = useState<{
    [key: string]: string;
  }>({});
  const [generatingInsights, setGeneratingInsights] = useState<{
    [key: string]: boolean;
  }>({});
  const [showAiInsights, setShowAiInsights] = useState(false);

  // Mock AI Insights Data
  const mockAiInsights = {
    'Operating Margin': [
      "Operating margin shows strong performance at 23.4%. Consider optimizing production costs to push towards 25% target.",
      "Margin is healthy but could improve by 1.6% through better inventory management and reduced waste.",
      "Current margin indicates good cost control. Focus on high-margin product lines for further improvement."
    ],
    'Production Efficiency': [
      "Production efficiency at 84.2% is above industry average. Machine maintenance optimization could push to 86%.",
      "Efficiency is good but downtime reduction could improve by 2.3%. Consider predictive maintenance.",
      "Strong efficiency metrics. Focus on quality consistency to maintain current performance levels."
    ],
    'Quality Score': [
      "Quality score of 96.3% is excellent. Minor improvements in spinning process could reach 97%.",
      "Quality metrics are strong. Consider advanced monitoring systems for real-time quality control.",
      "Outstanding quality performance. Maintain current standards while monitoring for any degradation."
    ],
    'Machine Uptime': [
      "Uptime at 94.7% is good but preventive maintenance could push to 96%. Schedule maintenance during low-demand periods.",
      "Machine availability is healthy. Consider implementing IoT sensors for predictive maintenance.",
      "Strong uptime performance. Focus on reducing unplanned downtime through better scheduling."
    ],
    'Revenue Growth': [
      "Revenue growth shows positive trend. Campaign optimization could accelerate growth by 15%.",
      "Strong revenue performance. Focus on customer retention and new market expansion.",
      "Revenue metrics indicate healthy growth. Consider diversifying product portfolio for sustained growth."
    ],
    'Customer Acquisition': [
      "Customer acquisition rate is positive. Marketing campaigns are effective. Consider referral programs.",
      "Good customer growth. Focus on customer lifetime value and retention strategies.",
      "Acquisition metrics are strong. Consider expanding to new market segments."
    ]
  };

  // Generate AI Insight
  const generateInsight = (metricKey: string) => {
    console.log(`Generating insight for: ${metricKey}`);
    setGeneratingInsights(prev => ({ ...prev, [metricKey]: true }));
    
    // Simulate AI generation delay
    setTimeout(() => {
      const insights = mockAiInsights[metricKey as keyof typeof mockAiInsights];
      const randomInsight = insights ? insights[Math.floor(Math.random() * insights.length)] : "No insights available for this metric.";
      
      console.log(`Generated insight for ${metricKey}:`, randomInsight);
      
      setAiInsights(prev => {
        const newInsights = { ...prev, [metricKey]: randomInsight };
        console.log('Updated aiInsights state:', newInsights);
        return newInsights;
      });
      setGeneratingInsights(prev => ({ ...prev, [metricKey]: false }));
    }, 2000 + Math.random() * 1000); // Random delay between 2-3 seconds
  };

  // Clear all insights
  const clearInsights = () => {
    setAiInsights({});
    setGeneratingInsights({});
  };

  const value: AIInsightsContextType = {
    // State
    aiInsights,
    generatingInsights,
    showAiInsights,
    
    // Actions
    setShowAiInsights,
    generateInsight,
    clearInsights,
    
    // Components
    AIInsightsCard,
    AIInsightsPanel
  };

  return (
    <AIInsightsContext.Provider value={value}>
      {children}
    </AIInsightsContext.Provider>
  );
};

// Custom hook to use AI Insights Context
export const useAIInsights = () => {
  const context = useContext(AIInsightsContext);
  if (context === undefined) {
    throw new Error('useAIInsights must be used within an AIInsightsProvider');
  }
  return context;
};

export default AIInsightsProvider; 