import {
  ShadeCreateInput,
  ShadeWithBlendDescription,
  FibreComposition,
  Shade,
} from '../types/shade';
import api from './axios';

const endpoint = '/api/shades';

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
    raw_cotton_compositions: shade.raw_cotton_compositions || [],
    blend_code: blend_composition.map((b) => b.fibre?.fibre_code).join(' + ') || '',
    blend_description: blend_composition
      .map(
        (b) => `${b.fibre?.fibre_name || b.fibre?.fibre_code} - ${b.percentage}%`
      )
      .join(', ') || '',
  };

  return transformed;
}

/**
 * ✅ Get all shades with fibre composition
 */
export const getAllShades = async (): Promise<Shade[]> => {
  const response = await api.get(endpoint);
  return response.data;
};

/**
 * ✅ Get a single shade by ID with composition metadata
 */
export const getShadeById = async (
  id: string
): Promise<ShadeWithBlendDescription> => {
  const response = await api.get(`${endpoint}/${id}`);
  return transformShade(response.data);
};

/**
 * ✅ Create a new shade (maps blend_composition to fibre_composition)
 */
export const createShade = async (data: Partial<Shade>): Promise<Shade> => {
  const response = await api.post(endpoint, data);
  return response.data;
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
  return api.put(`${endpoint}/${id}`, payload);
};

/**
 * ✅ Delete a shade by ID
 */
export const deleteShade = (id: string) => {
  return api.delete(`${endpoint}/${id}`);
};