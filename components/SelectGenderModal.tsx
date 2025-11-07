'use client';

import { updateUserGenderAction } from '@/actions/user.action';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SelectGenderModal() {
    const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedGender, setSelectedGender] = useState('');

  const handleSubmit = async () => {
    if (!selectedGender) {
      alert('Please select a gender');
      return;
    }

    // Here you would make an API call to update the user's gender
    try {
      const response = await updateUserGenderAction(selectedGender, session?.user?.id);

      if (response) {
        toast.success("Gender Updated successfully.")
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error updating gender:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-6">
          Please select your gender to continue
        </p>

        <div className="mb-6">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Gender
          </label>
          <select
            id="gender"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}