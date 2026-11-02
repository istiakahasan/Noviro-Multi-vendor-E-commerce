"use client";

import React, { useState } from "react";
import {
  useGetCommissionSettingsQuery,
  useCreateCommissionSettingsMutation,
  useUpdateCommissionSettingsMutation,
} from "@/redux/features/setting/settingsApi";
import { toast } from "sonner";
import PageLoading from "@/components/shared/PageLoading";

const ComitionRate = () => {
  const { data, isLoading, isError, error } = useGetCommissionSettingsQuery();
  const [createCommission] = useCreateCommissionSettingsMutation();
  const [updateCommission] = useUpdateCommissionSettingsMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const [formValues, setFormValues] = useState({
    commissionPercent: 0,
    minWithdrawal: 30,
    maxWithdrawal: 10000,
    withdrawalFee: 10,
    processingDays: 3,
  });

  const commissionData = data?.data;

  // Open edit modal (only commissionPercent)
  const handleEditClick = () => {
    if (!commissionData) return;
    setFormValues({
      commissionPercent: Number(commissionData.commissionPercent),
      minWithdrawal: 0,
      maxWithdrawal: 0,
      withdrawalFee: 0,
      processingDays: 0,
    });
    setIsCreate(false);
    setIsModalOpen(true);
  };

  // Open create modal (all values)
  const handleCreateClick = () => {
    setFormValues({
      commissionPercent: 0,
      minWithdrawal: 30,
      maxWithdrawal: 10000,
      withdrawalFee: 10,
      processingDays: 3,
    });
    setIsCreate(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isCreate) {
        await createCommission(formValues).unwrap();
        toast.success("Commission created successfully!");
      } else if (commissionData) {
        await updateCommission({
          id: commissionData.id,
          data: { commissionPercent: formValues.commissionPercent },
        }).unwrap();
        toast.success("Commission updated successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save commission.");
    }
  };

  if (isLoading) return <PageLoading />;
  // if (isError) return <p>Error loading commission settings.</p>;
  if (isError) {
    console.log(isError);
  }

  return (
    <div className="">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Commission Settings</h2>

        {/* Create Button Always Visible */}
        <button
          onClick={handleCreateClick}
          className="mb-4 px-4 py-2 bg-gray-500 rounded-lg text-white"
        >
          {commissionData ? "Update Commission" : "Create Commission"}
        </button>
      </div>

      {isError ? (
        //@ts-ignore
        <div className="text-red-600 py-10">{error?.data?.message}</div>
      ) : (
        <>
          {/* Table */}

          {commissionData && (
            <table className="table-auto border border-gray-100 rounded-md overflow-hidden w-full">
              <thead className="bg-gray-100">
                <tr className="">
                  <th className="border text-start border-gray-100 px-4 py-2">
                    Field
                  </th>
                  <th className="border text-start border-gray-100 px-4 py-2">
                    Value
                  </th>
                  <th className="border text-start border-gray-100 px-4 py-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-100 px-4 py-2">
                    Commission Percent
                  </td>
                  <td className="border border-gray-100 px-4 py-2">
                    {commissionData.commissionPercent}%
                  </td>
                  <td className="border border-gray-100 px-4 py-2">
                    <button
                      onClick={handleEditClick}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-100 px-4 py-2">
                    Min Withdrawal
                  </td>
                  <td className="border border-gray-100 px-4 py-2">
                    {commissionData.minWithdrawal}
                  </td>
                  <td className="border border-gray-100 px-4 py-2">-</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-100 px-4 py-2">
                    Max Withdrawal
                  </td>
                  <td className="border border-gray-100 px-4 py-2">
                    {commissionData.maxWithdrawal}
                  </td>
                  <td className="border border-gray-100 px-4 py-2">-</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-100 px-4 py-2">
                    Withdrawal Fee
                  </td>
                  <td className="border border-gray-100 px-4 py-2">
                    {commissionData.withdrawalFee}
                  </td>
                  <td className="border border-gray-100 px-4 py-2">-</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-100 px-4 py-2">
                    Processing Days
                  </td>
                  <td className="border border-gray-100 px-4 py-2">
                    {commissionData.processingDays}
                  </td>
                  <td className="border border-gray-100 px-4 py-2">-</td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-gray-100 px-4 py-2">Status</td>
                  <td className="border border-gray-100 px-4 py-2">
                    {commissionData.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="border border-gray-100 px-4 py-2">-</td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-md w-80">
            <h3 className="text-lg font-semibold mb-2">
              {isCreate ? "Create Commission" : "Edit Commission Percent"}
            </h3>

            {isCreate ? (
              <div className="space-y-2">
                <label className="block">
                  Commission Percent
                  <input
                    type="number"
                    value={formValues.commissionPercent}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        commissionPercent: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>
                <label className="block">
                  Min Withdrawal
                  <input
                    type="number"
                    value={formValues.minWithdrawal}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        minWithdrawal: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>
                <label className="block">
                  Max Withdrawal
                  <input
                    type="number"
                    value={formValues.maxWithdrawal}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        maxWithdrawal: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>
                <label className="block">
                  Withdrawal Fee
                  <input
                    type="number"
                    value={formValues.withdrawalFee}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        withdrawalFee: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>
                <label className="block">
                  Processing Days
                  <input
                    type="number"
                    value={formValues.processingDays}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        processingDays: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 rounded mt-1"
                  />
                </label>
              </div>
            ) : (
              <label className="block mb-4">
                Commission Percent
                <input
                  type="number"
                  value={formValues.commissionPercent}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      commissionPercent: Number(e.target.value),
                    })
                  }
                  className="w-full border p-2 rounded mt-1"
                />
              </label>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComitionRate;
