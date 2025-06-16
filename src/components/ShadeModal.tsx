import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Shade, ShadeCreateInput, RawCottonCompositionInput } from '../types/shade';
import { Fiber } from '../types/fiber';

interface ShadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (shade: ShadeCreateInput) => void;
  onUpdate: (shade: Shade & ShadeCreateInput) => void;
  shadeToEdit?: Shade | null;
  fibres: Fiber[];
}

const ShadeModal = ({ isOpen, onClose, onCreate, onUpdate, shadeToEdit, fibres }: ShadeModalProps) => {
  const isEditMode = !!shadeToEdit;
  const [useRawCotton, setUseRawCotton] = useState(false);

  const [shadeCode, setShadeCode] = useState('');
  const [shadeName, setShadeName] = useState('');
  const [rawCottonDetails, setRawCottonDetails] = useState<RawCottonCompositionInput>({
    lot_number: '',
    grade: '',
    source: '',
    notes: '',
    percentage: 0
  });
  const [composition, setComposition] = useState<{
    fibre_id: string;
    percentage: number;
    selectedCategoryId: string;
    searchCategory: string;
    searchFibre: string;
    showCategoryDropdown: boolean;
    showFibreDropdown: boolean;
  }[]>([]);

  useEffect(() => {
    if (isEditMode && shadeToEdit) {
      setShadeCode(shadeToEdit.shade_code);
      setShadeName(shadeToEdit.shade_name);
      setComposition(
        shadeToEdit.blend_composition?.map((c) => ({
          fibre_id: c.fibre_id,
          percentage: c.percentage,
          selectedCategoryId: fibres.find(f => f.id === c.fibre_id)?.category?.id || '',
          searchCategory: '',
          searchFibre: '',
          showCategoryDropdown: false,
          showFibreDropdown: false,
        })) || []
      );
      if (shadeToEdit.raw_cotton_compositions?.[0]) {
        const rawCotton = shadeToEdit.raw_cotton_compositions[0];
        setRawCottonDetails({
          lot_number: rawCotton.lot_number || '',
          grade: rawCotton.grade || '',
          source: rawCotton.source || '',
          notes: rawCotton.notes || '',
          percentage: rawCotton.percentage
        });
      }
    } else {
      setShadeCode(`SHD${Math.floor(10000 + Math.random() * 90000)}`);
      setShadeName('');
      setComposition([]);
      setRawCottonDetails({
        lot_number: '',
        grade: '',
        source: '',
        notes: '',
        percentage: 0
      });
    }
  }, [shadeToEdit, isOpen, fibres]);

  const isRawCottonCategory = (name: string | undefined) =>
    name?.toLowerCase().includes('raw') && name?.toLowerCase().includes('cotton');

  const getFibresGroupedByCategory = () => {
    const groups: Record<string, { categoryName: string; fibres: Fiber[] }> = {};
    fibres.forEach((fibre) => {
      const categoryName = fibre.category?.name || 'Uncategorized';
      const categoryId = fibre.category?.id || 'uncategorized';
      if (!groups[categoryId]) {
        groups[categoryId] = { categoryName, fibres: [] };
      }
      groups[categoryId].fibres.push(fibre);
    });
    return groups;
  };

  const fibreGroups = getFibresGroupedByCategory();

  const usedPercentage = composition
  .filter(({ fibre_id }) => fibre_id)
  .reduce((sum, c) => sum + c.percentage, 0);

  const rawCottonLine = composition.find(
    (c) => !c.fibre_id && isRawCottonCategory(fibreGroups[c.selectedCategoryId]?.categoryName)
  );
  
  const rawCottonPercentage = rawCottonLine?.percentage || 0;
  const totalPercentage = Number(usedPercentage) + Number(rawCottonPercentage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shadeCode || !shadeName || composition.length === 0) {
      toast.error('All fields are required');
      return;
    }
    if (Math.round(totalPercentage * 100) / 100 !== 100) {
      toast.error(`Total percentage must equal 100%. Current total: ${totalPercentage.toFixed(2)}%`);
      return;
    }

    const blend_composition = composition
      .filter((c) => c.fibre_id)
      .map(({ fibre_id, percentage }) => ({ fibre_id, percentage }));

    const raw_cotton_composition = composition.find(
      (c) => !c.fibre_id && isRawCottonCategory(fibreGroups[c.selectedCategoryId]?.categoryName)
    );

    const payload: ShadeCreateInput = {
      shade_code: shadeCode.trim(),
      shade_name: shadeName.trim(),
      percentage: `100%`,
      blend_composition,
      ...(raw_cotton_composition && {
        raw_cotton_compositions: [{
          percentage: raw_cotton_composition.percentage,
          lot_number: rawCottonDetails.lot_number,
          grade: rawCottonDetails.grade,
          source: rawCottonDetails.source,
          notes: rawCottonDetails.notes
        }]
      }),
    };

    if (isEditMode && shadeToEdit) {
      onUpdate({ ...shadeToEdit, ...payload });
      toast.success('✅ Shade updated successfully');
    } else {
      onCreate(payload);
      toast.success('✅ Shade created successfully');
    }
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
            <Dialog.Panel className="w-full max-w-2xl bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden">

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {isEditMode ? '✏️ Edit Shade' : '➕ Add Shade'}
                  </h2>

                  {/* Shade Code & Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      value={shadeCode}
                      onChange={(e) => setShadeCode(e.target.value)}
                      placeholder="Shade Code"
                      className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                    <input
                      value={shadeName}
                      onChange={(e) => setShadeName(e.target.value)}
                      placeholder="Shade Name / Color"
                      className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
  <input
    id="rawCottonCheck"
    type="checkbox"
    checked={useRawCotton}
    onChange={(e) => {
      const isChecked = e.target.checked;
      setUseRawCotton(isChecked);
      if (isChecked) {
        const rawCottonCategory = Object.entries(fibreGroups).find(([_, group]) =>
          isRawCottonCategory(group.categoryName)
        );
        if (rawCottonCategory) {
          const remaining = Math.max(0, 100 - totalPercentage);
          setComposition((prev) => [
            ...prev,
            {
              fibre_id: '',
              percentage: remaining,
              selectedCategoryId: rawCottonCategory[0],
              searchCategory: rawCottonCategory[1].categoryName,
              searchFibre: '',
              showCategoryDropdown: false,
              showFibreDropdown: false,
            },
          ]);
        } else {
          toast.error("No 'RAW Cotton' category found.");
          setUseRawCotton(false);
        }
      } else {
        // Remove existing raw cotton entry
        setComposition((prev) =>
          prev.filter(
            (c) =>
              !isRawCottonCategory(fibreGroups[c.selectedCategoryId]?.categoryName)
          )
        );
      }
    }}
  />
  <label htmlFor="rawCottonCheck" className="text-sm text-gray-700 dark:text-gray-300">
    Auto-fill remaining with RAW Cotton
  </label>
</div>

                  {/* Fibre Composition */}
                  <div className="space-y-4">
                    {composition.map((item, idx) => (
                      <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm space-y-2">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                          {/* Category Input */}
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search Category..."
                              value={item.searchCategory || (item.selectedCategoryId ? fibreGroups[item.selectedCategoryId]?.categoryName : '')}
                              onChange={(e) => {
                                const updated = [...composition];
                                updated[idx].searchCategory = e.target.value;
                                updated[idx].showCategoryDropdown = true;
                                setComposition(updated);
                              }}
                              onFocus={() => {
                                const updated = [...composition];
                                updated[idx].showCategoryDropdown = true;
                                setComposition(updated);
                              }}
                              className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            />
                            {item.showCategoryDropdown && item.searchCategory && (
                              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md max-h-48 overflow-y-auto">
                                {Object.entries(fibreGroups)
                                  .filter(([_, group]) => group.categoryName.toLowerCase().includes(item.searchCategory.toLowerCase()))
                                  .map(([categoryId, group]) => (
                                    <div
                                      key={categoryId}
                                      onClick={() => {
                                        const updated = [...composition];
                                        updated[idx].selectedCategoryId = categoryId;
                                        updated[idx].fibre_id = '';
                                        updated[idx].searchCategory = '';
                                        updated[idx].showCategoryDropdown = false;
                                        setComposition(updated);
                                      }}
                                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                                    >
                                      {group.categoryName}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>

                          {/* Fibre Input */}
                          <div className="relative">
      {isRawCottonCategory(fibreGroups[item.selectedCategoryId]?.categoryName) ? (
        <div className="text-sm italic text-gray-500 dark:text-gray-400 px-2 py-2">
          RAW Cotton fibre lot will be added manually during production.
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search Fibre..."
            value={item.searchFibre || (item.fibre_id ? fibres.find(f => f.id === item.fibre_id)?.fibre_name : '')}
            onChange={(e) => {
              const updated = [...composition];
              updated[idx].searchFibre = e.target.value;
              updated[idx].showFibreDropdown = true;
              setComposition(updated);
            }}
            onFocus={() => {
              const updated = [...composition];
              updated[idx].showFibreDropdown = true;
              setComposition(updated);
            }}
            disabled={!item.selectedCategoryId}
            className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50"
          />

          {item.showFibreDropdown && item.searchFibre && item.selectedCategoryId && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md max-h-48 overflow-y-auto">
              {fibres
                .filter(f =>
                  f.category?.id === item.selectedCategoryId &&
                  (`${f.fibre_code} ${f.fibre_name}`.toLowerCase().includes(item.searchFibre.toLowerCase()))
                )
                .map((fibre) => (
                  <div
                    key={fibre.id}
                    onClick={() => {
                      const updated = [...composition];
                      updated[idx].fibre_id = fibre.id;
                      updated[idx].searchFibre = '';
                      updated[idx].showFibreDropdown = false;
                      setComposition(updated);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  >
                    {fibre.fibre_code} - {fibre.fibre_name}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>

                          {/* Percentage Input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={item.percentage}
                              onChange={(e) => {
                                const updated = [...composition];
                                updated[idx].percentage = parseFloat(e.target.value);
                                setComposition(updated);
                              }}
                              className="w-20 border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white text-center"
                              required
                            />
                            <span className="text-gray-600 dark:text-gray-300">%</span>
                            <button
                              type="button"
                              onClick={() => setComposition(composition.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700"
                            >
                              🗑️
                            </button>
                          </div>

                        </div>

                      
                      </div>
                    ))}

                    {/* ➕ Add Fibre Button */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setComposition([...composition, {
                          fibre_id: '',
                          percentage: 0,
                          selectedCategoryId: '',
                          searchCategory: '',
                          searchFibre: '',
                          showCategoryDropdown: false,
                          showFibreDropdown: false,
                        }])}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm text-sm"
                      >
                        ➕ Add Fibre
                      </button>
                    </div>

                  </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 flex justify-end gap-4">
                {/* Total Percentage Progress */}
<div className="flex items-center gap-2 mb-4">
<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
  Total: {totalPercentage.toFixed(1)}%
</span>
  <div className="flex-1 relative h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
    <div
      className={`absolute top-0 left-0 h-full ${
        totalPercentage === 100 ? 'bg-green-500' : 'bg-red-500'
      }`}
      style={{ width: `${Math.min(totalPercentage, 100)}%` }}
    />
  </div>
</div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md"
                  >
                    {isEditMode ? 'Update' : 'Create'}
                  </button>
                </div>

                {/* Raw Cotton Details */}
                {useRawCotton && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Raw Cotton Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        value={rawCottonDetails.lot_number}
                        onChange={(e) => setRawCottonDetails(prev => ({ ...prev, lot_number: e.target.value }))}
                        placeholder="Lot Number"
                        className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <input
                        value={rawCottonDetails.grade}
                        onChange={(e) => setRawCottonDetails(prev => ({ ...prev, grade: e.target.value }))}
                        placeholder="Grade"
                        className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <input
                        value={rawCottonDetails.source}
                        onChange={(e) => setRawCottonDetails(prev => ({ ...prev, source: e.target.value }))}
                        placeholder="Source"
                        className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <textarea
                        value={rawCottonDetails.notes}
                        onChange={(e) => setRawCottonDetails(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Notes"
                        className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

              </form>

            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShadeModal;