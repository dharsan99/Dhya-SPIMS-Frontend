import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Shade } from '../types/shade';
import { Fiber } from '../types/fiber';

interface ShadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    shade: Omit<Shade, 'id'> & {
      blend_composition: { fibre_id: string; percentage: number }[];
    }
  ) => void;
  onUpdate: (
    shade: Shade & {
      blend_composition: { fibre_id: string; percentage: number }[];
    }
  ) => void;
  shadeToEdit?: Shade | null;
  fibres: Fiber[];
}

const ShadeModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  shadeToEdit,
  fibres,
}: ShadeModalProps) => {
  const isEditMode = !!shadeToEdit;

  const [shadeCode, setShadeCode] = useState('');
  const [shadeName, setShadeName] = useState('');
  const [composition, setComposition] = useState<
    { fibre_id: string; percentage: number }[]
  >([]);

  useEffect(() => {
    if (isEditMode && shadeToEdit) {
      setShadeCode(shadeToEdit.shade_code);
      setShadeName(shadeToEdit.shade_name);
      setComposition(
        shadeToEdit.blend_composition?.map((c) => ({
          fibre_id: c.fibre_id,
          percentage: c.percentage,
        })) || []
      );
    } else {
      setShadeCode(`SHD${Math.floor(10000 + Math.random() * 90000)}`);
      setShadeName('');
      setComposition([]);
    }
  }, [shadeToEdit, isOpen]);
  const getFibresGroupedByCategory = () => {
    const groups: Record<string, { categoryName: string; fibres: Fiber[] }> = {};
  
    fibres.forEach((fibre) => {
      const categoryName = fibre.category?.name || 'Uncategorized';
      const categoryId = fibre.category?.id || 'uncategorized';
  
      if (!groups[categoryId]) {
        groups[categoryId] = {
          categoryName,
          fibres: [],
        };
      }
  
      groups[categoryId].fibres.push(fibre);
    });
  
    return groups;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('🧾 Submitting shade form...');
    console.log('📝 Shade Code:', shadeCode);
    console.log('🎨 Shade Name:', shadeName);
    console.log('🧬 Fibre Composition:', composition);
  
    if (!shadeCode || !shadeName || composition.length === 0) {
      toast.error('All fields are required');
      console.error('❌ Validation Error: Missing fields');
      return;
    }
  
    const total = composition.reduce((sum, f) => sum + f.percentage, 0);
    console.log('📊 Total Fibre %:', total);
  
    if (total !== 100) {
      toast.error(`Total percentage must equal 100%. Current total: ${total}%`);
      console.warn('⚠️ Invalid percentage total:', total);
      return;
    }
  
    const payload = {
      shade_code: shadeCode.trim(),
      shade_name: shadeName.trim(),
      percentage: `${total}%`,
      blend_composition: composition,
    };
  
    console.log('📦 Payload to submit:', payload);
  
    if (isEditMode && shadeToEdit) {
      console.log('✏️ Updating existing shade...');
      onUpdate({ ...shadeToEdit, ...payload });
      toast.success('✅ Shade updated successfully');
    } else {
      console.log('➕ Creating new shade...');
      onCreate(payload);
      toast.success('✅ Shade created successfully');
    }
  
    console.log('✅ Submission complete. Closing modal.');
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-150"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow space-y-4">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                {isEditMode ? '✏️ Edit Shade' : '➕ Add Shade'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  value={shadeCode}
                  onChange={(e) => setShadeCode(e.target.value)}
                  placeholder="Shade Code"
                  className="w-full border p-2 rounded bg-gray-50"
                  required
                />
                <input
                  value={shadeName}
                  onChange={(e) => setShadeName(e.target.value)}
                  placeholder="Shade Name / Color"
                  className="w-full border p-2 rounded"
                  required
                />

                {/* Fibre Composition */}
                <div className="space-y-2">
                  <label className="font-medium text-gray-700">Fibre Composition</label>

                  {composition.map((item, idx) => {
                    const selectedFibre = fibres.find((f) => f.id === item.fibre_id);

                    return (
                      <div key={idx} className="p-3 border bg-gray-50 rounded space-y-1">
                        <div className="flex items-center gap-2">
                        <select
  value={item.fibre_id}
  onChange={(e) => {
    const updated = [...composition];
    updated[idx].fibre_id = e.target.value;
    setComposition(updated);
  }}
  className="flex-1 border p-2 rounded"
  required
>
  <option value="">Select Fibre</option>
  {Object.entries(getFibresGroupedByCategory()).map(([categoryId, group]) => (
    <optgroup key={categoryId} label={group.categoryName}>
      {group.fibres.map((fibre) => (
        <option key={fibre.id} value={fibre.id}>
          {fibre.fibre_code}
        </option>
      ))}
    </optgroup>
  ))}
</select>

                          <input
  type="number"
  className="w-20 border p-2 rounded"
  min={0}
  max={100}
  step="0.1" // ✅ Add this line to allow decimal values like 11.5, 23.5 etc.
  value={item.percentage}
  onChange={(e) => {
    const updated = [...composition];
    updated[idx].percentage = parseFloat(e.target.value);
    setComposition(updated);
  }}
  required
/>
                          <span className="text-sm text-gray-700">%</span>

                          <button
                            type="button"
                            onClick={() =>
                              setComposition(composition.filter((_, i) => i !== idx))
                            }
                            className="text-red-500"
                          >
                            ❌
                          </button>
                        </div>

                        {selectedFibre && (
                          <div className="text-xs text-gray-700 pl-2">
                            <div><strong>Name:</strong> {selectedFibre.fibre_name}</div>
                            <div><strong>Stock:</strong> {selectedFibre.stock_kg} kg</div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className="text-blue-600 underline text-sm"
                    onClick={() =>
                      setComposition([...composition, { fibre_id: '', percentage: 0 }])
                    }
                  >
                    ➕ Add Fibre
                  </button>

                  <div className="text-right text-sm font-medium mt-1">
                    Total: {composition.reduce((sum, f) => sum + f.percentage, 0)}%
                    {composition.reduce((sum, f) => sum + f.percentage, 0) === 100 ? (
                      <span className="text-green-600 ml-1">✅</span>
                    ) : (
                      <span className="text-red-600 ml-1">❌</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isEditMode ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShadeModal;