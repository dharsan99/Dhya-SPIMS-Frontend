import { useEffect, useState } from 'react';
import {
  getAllSuppliers,
  createSupplier,
  deleteSupplier,
  updateSupplier,
} from '../api/suppliers';
import Loader from '../components/Loader';
import SupplierModal from '../components/SupplierModal';
import type { Supplier } from '../types/supplier'; // Adjust the path accordingly

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const fetchSuppliers = async () => {
    try {
      const res = await getAllSuppliers();
      setSuppliers(res);
    } catch (err) {
      // console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Supplier | Omit<Supplier, 'id'>) => {
    setLoading(true);
    try {
      if ('id' in data) {
        // Edit Mode
        await updateSupplier(data.id, {
          name: data.name,
          contact: data.contact,
          email: data.email,
          address: data.address,
        });
        alert('Supplier updated!');
      } else {
        // Create Mode
        await createSupplier({
          name: data.name,
          contact: data.contact,
          email: data.email,
          address: data.address,
        });
        alert('Supplier created!');
      }
  
      setIsModalOpen(false);
      setEditingSupplier(null);
      await fetchSuppliers();
    } catch (error) {
      alert('Error saving supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    try {
      await deleteSupplier(id);
      await fetchSuppliers();
    } catch {
      alert('Error deleting supplier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Suppliers</h1>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Supplier
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {['Name', 'Contact', 'Email', 'Address', 'Actions'].map((header) => (
                <th key={header} className="px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-4 py-2">{supplier.name}</td>
                <td className="px-4 py-2">{supplier.contact}</td>
                <td className="px-4 py-2">{supplier.email}</td>
                <td className="px-4 py-2">{supplier.address}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        } }
        onSaved={handleSave}
        initialData={editingSupplier} supplierToEdit={null}      />
    </div>
  );
};

export default Suppliers;