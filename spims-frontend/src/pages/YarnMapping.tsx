import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getYarnMappings,
  createYarnMapping,
  updateYarnMapping,
  deleteYarnMapping,
} from '../api/yarnMapping';
import { YarnMappingForm, YarnMapping } from '../types/yarnMapping';
import useAuthStore from '../hooks/auth';

const YarnMappingPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: yarnMappings, isLoading } = useQuery({
    queryKey: ['yarn-mappings'],
    queryFn: getYarnMappings,
  });

  const mutation = useMutation({
    mutationFn: async ({ data, isEdit, id }: { data: YarnMappingForm; isEdit: boolean; id?: string }) =>
      isEdit && id ? updateYarnMapping(id, data) : createYarnMapping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yarn-mappings'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Delete this yarn?')) {
      deleteYarnMapping(id).then(() => queryClient.invalidateQueries({ queryKey: ['yarn-mappings'] }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Yarn Mapping</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Count Range</th>
                <th className="px-4 py-2 border">Base Shade</th>
                <th className="px-4 py-2 border">Effect</th>
                <th className="px-4 py-2 border">Blend</th>
                <th className="px-4 py-2 border">Yarn Type</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {yarnMappings?.map((yarn: YarnMapping) => (
                <tr key={yarn.id}>
                  <td className="px-4 py-2 border">{yarn.count_range}</td>
                  <td className="px-4 py-2 border">{yarn.base_shade}</td>
                  <td className="px-4 py-2 border">{yarn.special_effect}</td>
                  <td className="px-4 py-2 border">{yarn.blends?.blend_code}</td>
                  <td className="px-4 py-2 border">{yarn.yarn_types?.name}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDelete(yarn.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {/* Add Edit button logic if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default YarnMappingPage;