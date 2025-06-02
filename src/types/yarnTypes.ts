// types/yarnTypes.ts
export interface YarnType {
    id: string;
    name: string;
    category?: string;
    created_at?: string;
  }
  
  export interface YarnTypeForm {
    name: string;
    category: string;
  }