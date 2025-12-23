import React from "react";
import { useTranslation } from 'react-i18next';

export default function TaskForm({ taskForm, setTaskForm, operators, onSave, onCancel, editing }) {
  const { t } = useTranslation();
  // Toggle assign for multi-select
  function toggleAssign(operatorId) {
    setTaskForm((prev) => {
      const assigned = prev.assignedTo || [];
      if (assigned.includes(operatorId)) return { ...prev, assignedTo: assigned.filter((a) => a !== operatorId) };
      return { ...prev, assignedTo: [...assigned, operatorId] };
    });
  }

  const filteredOperators = taskForm.category
    ? operators.filter(op => op.category === taskForm.category)
    : operators;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">{editing ? t('editTask') : t('createTask')}</h2>
        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">{t('title')}</label>
            <input
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t('deadline')}</label>
            <input
              type="date"
              value={taskForm.deadline}
              onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">{t('description')}</label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="mt-1 w-full rounded border px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">{t('priority')}</label>
            <select
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="Low">{t('low')}</option>
              <option value="Medium">{t('medium')}</option>
              <option value="High">{t('high')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">{t('taskCategory')}</label>
            <select
              value={taskForm.category}
              onChange={(e) =>
                setTaskForm({ ...taskForm, category: e.target.value, assignedTo: [] })
              }
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="">{t('selectCategory')}</option>
              <option value="Plastic">{t('plastic')}</option>
              <option value="Modelling">{t('modelling')}</option>
              <option value="Refining">{t('refining')}</option>
            </select>
          </div>


          <div className="mb-4">
            <label className="font-medium mb-1 block">{t('assignTo')}</label>

            {/* 🔥 POINT 4: EMPTY STATE MESSAGE */}
            {taskForm.category && filteredOperators.length === 0 && (
              <p className="text-sm text-gray-500 mb-2">
                {t('noOperatorsAvailable')}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {filteredOperators.map(op => (
                <label key={op.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={taskForm.assignedTo.includes(op.id)}
                    onChange={() => toggleAssign(op.id)}
                  />
                  {op.name}
                </label>
              ))}
            </div>
          </div>



          <div className="md:col-span-2 flex gap-2 justify-end mt-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">{t('cancel')}</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{editing ? t('save') : t('create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
