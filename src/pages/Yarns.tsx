import { useEffect, useState } from 'react';
import {
  getAllYarns,
  createYarn,
  updateYarn,
  deleteYarn,
} from '../api/yarns';

import {
  getAllYarnTypes,
  createYarnType,
  updateYarnType,
  deleteYarnType,
} from '../api/yarnTypes';

import { getAllBlends } from '../api/blends';

import Loader from '../components/Loader';
import YarnTypeModal from '../components/YarnTypeModal';
import YarnModal from '../components/YarnModal';

import { YarnType, YarnTypeForm } from '../types/yarnTypes';
import { Yarn, YarnForm } from '../types/yarns';
import { Blend } from '../types/blends'; // Make sure you have this

const YarnsPage = () => {
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [yarnTypes, setYarnTypes] = useState<YarnType[]>([]);
  const [blends, setBlends] = useState<Blend[]>([]);
  const [loading, setLoading] = useState(true);

  const [showYarnTypeModal, setShowYarnTypeModal] = useState(false);
  const [editingYarnType, setEditingYarnType] = useState<YarnType | null>(null);

  const [showYarnModal, setShowYarnModal] = useState(false);
  const [editingYarn, setEditingYarn] = useState<Yarn | null>(null);

  const fetchYarns = async () => {
    const res = await getAllYarns();
    setYarns(res.data);
  };

  const fetchYarnTypes = async () => {
    const res = await getAllYarnTypes();
    setYarnTypes(res.data);
  };

  const fetchBlends = async () => {
    const res = await getAllBlends();
    setBlends(res.data);
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchYarns(), fetchYarnTypes(), fetchBlends()]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveYarn = async (form: YarnForm, isEdit: boolean) => {
    try {
      if (isEdit && editingYarn?.id) {
        await updateYarn(editingYarn.id, {
            count_range: form.count_range,
            base_shade: form.base_shade,
            special_effect: form.special_effect,
            status: form.status,
          });
      } else {
        await createYarn(form);
      }
      await fetchYarns();
      setShowYarnModal(false);
      setEditingYarn(null);
    } catch {
      alert('Error saving yarn');
    }
  };

  const handleDeleteYarn = async (id: string) => {
    if (!confirm('Delete this yarn?')) return;
    try {
      setLoading(true);
      await deleteYarn(id);
      await fetchYarns();
    } catch {
      alert('Error deleting yarn');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveYarnType = async (form: YarnTypeForm, isEdit: boolean) => {
    try {
      if (isEdit && editingYarnType?.id) {
        await updateYarnType(editingYarnType.id, form);
      } else {
        await createYarnType(form);
      }
      await fetchYarnTypes();
      setShowYarnTypeModal(false);
      setEditingYarnType(null);
    } catch {
      alert('Error saving yarn type');
    }
  };

  const handleDeleteYarnType = async (id: string) => {
    if (!confirm('Delete this yarn type?')) return;
    try {
      setLoading(true);
      await deleteYarnType(id);
      await fetchYarnTypes();
    } catch {
      alert('Error deleting yarn type');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold text-blue-600">Yarns</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingYarn(null);
            setShowYarnModal(true);
          }}
        >
          + Add Yarn
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingYarnType(null);
            setShowYarnTypeModal(true);
          }}
        >
          + Add Yarn Type
        </button>
      </div>

      {/* Yarn Table */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Yarn List</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Count</th>
              <th className="text-left px-4 py-2">Base Shade</th>
              <th className="text-left px-4 py-2">Blend</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {yarns.map((yarn) => {
              const blendName = blends.find(b => b.id === yarn.blend_id)?.blend_code || 'N/A';
              return (
                <tr key={yarn.id}>
                  <td className="px-4 py-2">{yarn.count_range}</td>
                  <td className="px-4 py-2">{yarn.base_shade}</td>
                  <td className="px-4 py-2">{blendName}</td>
                  <td className="px-4 py-2">{yarn.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => {
                        setEditingYarn(yarn);
                        setShowYarnModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteYarn(yarn.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Yarn Types Table */}
      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Yarn Types</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {yarnTypes.map((yt) => (
              <tr key={yt.id}>
                <td className="px-4 py-2">{yt.name}</td>
                <td className="px-4 py-2">{yt.category}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setEditingYarnType(yt);
                      setShowYarnTypeModal(true);
                    }}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteYarnType(yt.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <YarnModal
  isOpen={showYarnModal}
  onClose={() => {
    setShowYarnModal(false);
    setEditingYarn(null);
  }}
  onSave={handleSaveYarn}
  initialData={editingYarn || undefined}
  yarnTypes={yarnTypes}
  blends={blends}
/>
      <YarnTypeModal
        isOpen={showYarnTypeModal}
        onClose={() => {
          setShowYarnTypeModal(false);
          setEditingYarnType(null);
        }}
        onSave={handleSaveYarnType}
        initialData={editingYarnType || undefined}
      />
    </div>
  );
};

export default YarnsPage;