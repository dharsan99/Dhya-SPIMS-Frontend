import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Mail} from 'lucide-react';

import { HighPriorityTaskAlert } from '../components/HighPriorityTaskAlert';

const GrowthEngine = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mail,
      title: 'Campaign Center',
      description: 'Unified campaign management for both email marketing and AI-powered growth campaigns.',
      status: 'active',
      path: '/app/campaigns',
    },
    {
      icon: Brain,
      title: 'Persona Generation',
      description: 'Create detailed company personas using advanced AI analysis of your business data.',
      status: 'active',
      path: '/app/growth/persona',
    },
    {
      icon: Users,
      title: 'Brand Discovery',
      description: 'Automatically discover potential business partners and customers in your industry.',
      status: 'active',
      path: '/app/growth/brand-discovery',
    },
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'Manage reply follow-ups and growth tasks with automated priority assignment.',
      status: 'active',
      path: '/app/growth/tasks',
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track campaign performance and growth metrics with detailed analytics.',
      status: 'active',
      path: '/app/growth/analytics',
    },
    {
      icon: MessageSquare,
      title: 'Reply Processing',
      description: 'Automated detection and task creation for email replies from prospects.',
      status: 'active',
      path: '/app/growth/tasks?filter=replies',
    },

  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.status === 'active' && feature.path) {
      navigate(feature.path);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {/* High Priority Task Alert */}
          <HighPriorityTaskAlert maxTasks={3} />

          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Texintelli Growth Engine
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leverage AI-powered automation to accelerate your business growth through 
              intelligent persona generation, campaign management, and automated reply processing.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                onClick={() => handleFeatureClick(feature)}
                className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 ${
                  feature.status === 'active' && feature.path
                    ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-teal-300'
                    : 'cursor-default'
                }`}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        feature.status === 'active' ? 'bg-teal-100' : 'bg-gray-100'
                      }`}>
                        <feature.icon 
                          className={`h-6 w-6 ${
                            feature.status === 'active' ? 'text-teal-600' : 'text-gray-500'
                          }`} 
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feature.status === 'active' 
                            ? 'bg-teal-100 text-teal-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {feature.status === 'active' ? 'Available' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                    {feature.status === 'active' && feature.path && (
                      <ArrowRight className="h-5 w-5 text-teal-600" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{feature.description}</p>
                  {feature.status === 'active' && feature.path && (
                    <div className="mt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(feature.path);
                        }}
                        className="inline-flex items-center px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Accelerate Your Growth?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Start with AI-powered persona generation, discover new brands, and let automated 
              reply processing handle your follow-ups while you focus on closing deals.
            </p>
            <div className="flex justify-center space-x-4 flex-wrap gap-2">
              <button
                onClick={() => navigate('/app/growth/persona')}
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                <Brain className="h-5 w-5 mr-2" />
                Create Your Persona
              </button>
              <button
                onClick={() => navigate('/app/growth/brand-discovery')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Users className="h-5 w-5 mr-2" />
                Discover Brands
              </button>
              <button
                onClick={() => navigate('/app/growth/tasks')}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Manage Tasks
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              <span className="font-medium">✨ New:</span> Automated reply processing creates 
              high-priority tasks instantly when prospects respond to your outreach!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthEngine; 