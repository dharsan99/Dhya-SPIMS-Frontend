import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiStar, FiZap, FiAward } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    billingCycle: 'month',
    description: 'Perfect for small spinning mills getting started',
    features: [
      'Up to 10 employees',
      'Basic order management',
      'Production tracking',
      'Email support',
      '1GB storage',
      'Basic reports'
    ],
    icon: FiStar,
    color: 'bg-blue-500'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    billingCycle: 'month',
    description: 'Ideal for growing mills with advanced needs',
    features: [
      'Up to 50 employees',
      'Advanced order management',
      'Real-time production tracking',
      'Priority email support',
      '10GB storage',
      'Advanced analytics',
      'API access',
      'Custom integrations'
    ],
    popular: true,
    icon: FiZap,
    color: 'bg-purple-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    billingCycle: 'month',
    description: 'For large mills with complex operations',
    features: [
      'Unlimited employees',
      'Full order management suite',
      'Real-time production & inventory',
      '24/7 phone support',
      'Unlimited storage',
      'Custom analytics dashboard',
      'Full API access',
      'White-label solutions',
      'Dedicated account manager',
      'Custom training sessions'
    ],
    icon: FiAward,
    color: 'bg-orange-500'
  }
];

const SubscriptionPlanPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  if (!formData) {
    navigate('/signup');
    return null;
  }

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.id);
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      // Here you can handle signup logic with formData and plan
      navigate('/app/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Select the perfect plan for {formData.orgName}
              </p>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  className={`relative rounded-xl border-2 p-6 transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full ${plan.color} text-white mb-4`}>
                      <plan.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">/{plan.billingCycle}</span>
                    </div>
                    <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-blue-600 text-white'
                        : plan.popular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Select ${plan.name}`
                    )}
                  </button>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All plans include a 14-day free trial. No credit card required to start.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Cancel anytime. Upgrade or downgrade your plan at any time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionPlanPage; 