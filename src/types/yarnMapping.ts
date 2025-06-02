export interface YarnMapping {
    yarn_code: string;
    yarn_id: string;
    shade_id: string;
    id: string;
    tenant_id: string;
    yarn_type_id: string;
    blend_id: string;
    count_range: string;
    base_shade: string;
    special_effect: string;
    status: string;
    created_at: string;
    blends?: {
      blend_code: string;
      description: string;
    };
    yarn_types?: {
      name: string;
      category: string;
    };
  }
  
  export interface YarnMappingForm {
    yarn_code: string | number | readonly string[] | undefined;
    yarn_id: string | number | readonly string[] | undefined;
    shade_id: string | number | readonly string[] | undefined;
    tenant_id: string;
    yarn_type_id: string;
    blend_id: string;
    count_range: string;
    base_shade: string;
    special_effect: string;
  }