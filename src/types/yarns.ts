export interface Yarn {
    id: string;
    tenant_id: string;
    yarn_type_id: string;
    blend_id: string;
    count_range: string;
    base_shade: string;
    special_effect?: string;
    status?: 'active' | 'inactive';
  }
  
  export type YarnForm = Omit<Yarn, 'id'>;