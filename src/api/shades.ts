import {
  ShadeCreateInput,
  ShadeWithBlendDescription,
  FibreComposition,
} from '../types/shade';
import api from './axios';

const endpoint = '/shades';

/**
 * 🔁 Helper: Transform raw shade from API to typed ShadeWithBlendDescription
 */
function transformShade(shade: any): ShadeWithBlendDescription {
  const blend_composition: FibreComposition[] =
    shade.shade_fibres?.map((sf: any) => ({
      fibre_id: sf.fibre_id,
      percentage: sf.percentage,
      fibre: sf.fibre,
    })) ?? [];

  const transformed = {
    ...shade,
    available_stock_kg: shade.available_stock_kg
      ? Number(shade.available_stock_kg)
      : undefined,
    blend_composition,
    blend_code: blend_composition.map((b) => b.fibre?.fibre_code).join(' + ') || '',
    blend_description: blend_composition
      .map(
        (b) => `${b.fibre?.fibre_name || b.fibre?.fibre_code} - ${b.percentage}%`
      )
      .join(', ') || '',
  };

  console.log('🔄 Transformed Shade:', transformed);
  return transformed;
}

/**
 * ✅ Get all shades with fibre composition
 */
export const getAllShades = async (): Promise<ShadeWithBlendDescription[]> => {
  console.log('📥 Fetching all shades...');
  const response = await api.get(endpoint);
  console.log('📦 Raw response:', response.data);
  return response.data.map(transformShade);
};

/**
 * ✅ Get a single shade by ID with composition metadata
 */
export const getShadeById = async (
  id: string
): Promise<ShadeWithBlendDescription> => {
  console.log(`🔍 Fetching shade by ID: ${id}`);
  const response = await api.get(`${endpoint}/${id}`);
  console.log('📦 Raw shade:', response.data);
  return transformShade(response.data);
};

/**
 * ✅ Create a new shade (maps blend_composition to fibre_composition)
 */
export const createShade = (data: ShadeCreateInput) => {
  const { blend_composition, ...rest } = data;
  const payload = {
    ...rest,
    fibre_composition: blend_composition,
  };
  console.log('🛠️ Creating new shade with payload:', payload);
  return api.post(endpoint, payload);
};

/**
 * ✅ Update an existing shade (maps blend_composition to fibre_composition)
 */
export const updateShade = (id: string, data: Partial<ShadeCreateInput>) => {
  const { blend_composition, ...rest } = data;
  const payload = {
    ...rest,
    fibre_composition: blend_composition,
  };
  console.log(`📝 Updating shade ${id} with payload:`, payload);
  return api.put(`${endpoint}/${id}`, payload);
};

/**
 * ✅ Delete a shade by ID
 */
export const deleteShade = (id: string) => {
  console.log(`🗑️ Deleting shade with ID: ${id}`);
  return api.delete(`${endpoint}/${id}`);
};