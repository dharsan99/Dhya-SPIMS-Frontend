import React from 'react';
import BulkEmailPanel from './BulkEmailPanel';
import MailingListPanel from './MailingListPanel';
import TemplatePanel from './TemplatePanel';
import PotentialBuyersPanel from './PotentialBuyersPanel';
import EmailAnalyticsPanel from './EmailAnalyticsPanel';
import DirectEmailRecovery from './DirectEmailRecovery';

export type TabKey = 'bulk' | 'lists' | 'templates' | 'potential' | 'analytics' | 'recovery';

interface MarketingTabsProps {
  activeTab: TabKey;
}

const MarketingTabs: React.FC<MarketingTabsProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'bulk':
      return <BulkEmailPanel />;
    case 'lists':
      return <MailingListPanel />;
    case 'templates':
      return <TemplatePanel />;
    case 'potential':
      return <PotentialBuyersPanel />;
    case 'analytics':
      return <EmailAnalyticsPanel />;
    case 'recovery':
      return <DirectEmailRecovery />;
    default:
      return <div className="text-red-500">Invalid Tab</div>;
  }
};

export default MarketingTabs;