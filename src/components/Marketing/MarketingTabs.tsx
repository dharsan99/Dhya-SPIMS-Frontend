import React from 'react';
import BulkEmailPanel from './BulkEmailPanel';
import MailingListPanel from './MailingListPanel';
import TemplatePanel from './TemplatePanel';
import PotentialBuyersPanel from './PotentialBuyersPanel'; // ✅ import

export type TabKey = 'bulk' | 'lists' | 'templates' | 'potential'; // ✅ updated

interface MarketingTabsProps {
  activeTab: TabKey;
  onTabChange: React.Dispatch<React.SetStateAction<TabKey>>;
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
      return <PotentialBuyersPanel />; // ✅ added
    default:
      return <div className="text-red-500">Invalid Tab</div>;
  }
};

export default MarketingTabs;