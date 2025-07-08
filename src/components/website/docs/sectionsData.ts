export type Section = {
    id: string;     // 👈 always string
    label: string;
  };

export const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "getting-started", label: "Getting Started" },
    { id: "master-setup", label: "Master Setup" },
    { id: "inventory-management", label: "Inventory Management" },
    { id: "order-management", label: "Order Management" },
    { id: "production-tracking", label: "Production Tracking" },
    { id: "reports-analytics", label: "Reports & Analytics" },
    { id: "settings-customization", label: "Settings & Customization" },
    { id: "mobile-app-guide", label: "Mobile App Guide" },
    { id: "faq", label: "FAQ" },
  ];