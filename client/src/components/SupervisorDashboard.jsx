import TaskForm from "./CreateTaskDialog";
import DocumentTab from "./DocumentsTab";
import CommentPopup from "./CommentPopup.jsx";
import { useState, useMemo, useEffect } from "react";

import {
  getTasksAPI,
  deleteTaskAPI,
  editTaskAPI,
  createTaskAPI,
  assignTaskAPI,
  getAllOperatorsAPI,
  updateOperatorAPI,
} from "../services/apiTask.services.js";

import { useTranslation } from 'react-i18next';

export default function SupervisorDashboard() {
  const { t } = useTranslation();
  const profile = { name: "Anish Patil", role: "Supervisor" };

  // Operators & Tasks state
  const [operators, setOperators] = useState([]);
  const [availableOperators, setAvailableOperators] = useState([]);
  const [tasks, setTasks] = useState([]);

  // UI state
  const [activeTab, setActiveTab] = useState("tasks");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Comment Popup State
  const [activeCommentTask, setActiveCommentTask] = useState(null);

  const initialForm = {
    title: "",
    description: "",
    deadline: "",
    priority: "Medium",
    category: "",
    assignedTo: [],
  };
  const [taskForm, setTaskForm] = useState(initialForm);


  const updateOperatorCategory = async (operatorId, category) => {
    try {
      // call backend update API
      await updateOperatorAPI(operatorId, { category });

      // update UI instantly
      setOperators((prev) =>
        prev.map((op) =>
          op.id === operatorId ? { ...op, category } : op
        )
      );
    } catch (error) {
      console.error("Failed to update category", error);
      alert("Failed to update operator category");
    }
  };



  // Derived counts
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const overdue = tasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== "Completed"
    ).length;
    const members = operators.length;
    return { total, completed, overdue, members };
  }, [tasks, operators]);

  // 1. FETCH OPERATORS (Updated to use Backend Global Data)
  useEffect(() => {
    async function fetchOperators() {
      try {
        const res = await getAllOperatorsAPI();
        if (res.data.success) {
          // Your backend now returns: { _id, name, totalTasks, availability }
          const allOps = res.data.operators.map((op) => ({
            id: op._id,
            name: op.name,
            email: op.email,

            category: op.category || "Unassigned",

            // ⭐ USE BACKEND DATA: This count is now Global (across all supervisors)
            totalTasks: op.totalTasks,
            status: op.availability
          }));
          setOperators(allOps);
        }
      } catch (err) {
        console.error("Error fetching operators:", err);
      }
    }
    fetchOperators();
    // ⭐ Re-fetch operators whenever 'tasks' change so the count updates immediately after you assign someone
  }, [tasks]);

  // Fetch tasks (Supervisor's specific tasks)
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await getTasksAPI();
        if (res.data.success) {
          setTasks(
            res.data.tasks.map((t) => ({
              ...t,
              _id: t._id,
              assignedTo: t.assignedTo?.map((u) => u._id) || [],
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    }
    fetchTasks();
  }, []);

  // 2. UPDATE AVAILABLE OPERATORS
  useEffect(() => {
    if (operators.length === 0) return;

    // We rely purely on the Backend's "totalTasks" count now.
    // No more local filtering of the 'tasks' array.
    const available = operators.filter((op) => op.totalTasks < 3);

    setAvailableOperators(available);
  }, [operators]);

  // --- Task Handlers ---
  const saveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.deadline)
      return alert("Please provide title and deadline");

    try {
      let taskId;
      if (editingTaskId) {
        // Edit Mode
        const res = await editTaskAPI(editingTaskId, taskForm);
        if (res.data.success) {
          taskId = editingTaskId;
          setTasks((prev) =>
            prev.map((t) =>
              t._id === editingTaskId
                ? {
                  ...res.data.task,
                  assignedTo: res.data.task.assignedTo?.map((u) => u._id) || [],
                }
                : t
            )
          );

          if (taskForm.assignedTo?.length) {
            await assignTaskAPI(taskId, { assignedTo: taskForm.assignedTo });
            setTasks((prev) =>
              prev.map((t) =>
                t._id === editingTaskId
                  ? { ...t, assignedTo: taskForm.assignedTo }
                  : t
              )
            );
          }
        }
      } else {
        // Create Mode
        const res = await createTaskAPI(taskForm);
        if (res.data.success) {
          const newTask = res.data.data;
          taskId = newTask._id;
          if (taskForm.assignedTo?.length) {
            const assignRes = await assignTaskAPI(taskId, {
              assignedTo: taskForm.assignedTo,
            });
            newTask.assignedTo = assignRes.data.task.assignedTo || [];
          }
          setTasks((prev) => [newTask, ...prev]);
        }
      }
      setShowTaskForm(false);
      setTaskForm(initialForm);
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error saving task", err);
      alert(err.response?.data?.message || "Failed to save task");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await deleteTaskAPI(id);
      if (res.data.success)
        setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const openCreateTask = () => {
    setEditingTaskId(null);
    setTaskForm(initialForm);
    setShowTaskForm(true);
  };

  const openEditTask = (task) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      priority: task.priority,
      assignedTo: task.assignedTo || [],
    });
    setShowTaskForm(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 relative">

      {activeCommentTask && (
        <CommentPopup
          task={activeCommentTask}
          onClose={() => setActiveCommentTask(null)}
        />
      )}

      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('supervisorDashboard')}
            </h1>
            <p className="text-blue-500">{t('welcome')}, {profile.name}</p>
          </div>
          <div className="text-sm bg-white px-3 py-1 rounded shadow-sm border">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <section className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 md:mb-12">
            <StatCard title={t('totalTasks')} value={counts.total} icon="📋" />
            <StatCard title={t('completed')} value={counts.completed} icon="✅" />
            <StatCard title={t('overdue')} value={counts.overdue} icon="⚠️" />
            <StatCard title={t('members')} value={counts.members} icon="👥" />
          </div>
        </section>

        <div className="my-8 border-t border-gray-200" />

        {/* Tabs */}
        <div className="bg-white p-2 rounded-lg shadow-sm flex gap-2 mb-6 w-fit border border-gray-100">
          <Tab label={t('taskManagement')} active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} />
          <Tab label={t('teamOverview')} active={activeTab === "team"} onClick={() => setActiveTab("team")} />
          <Tab label={t('documents')} active={activeTab === "docs"} onClick={() => setActiveTab("docs")} />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[500px]">
          {/* TASKS TAB */}
          {activeTab === "tasks" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('activeTasks')}</h2>
                <button
                  onClick={openCreateTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  + {t('createTask')}
                </button>
              </div>

              {showTaskForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <TaskForm
                    taskForm={taskForm}
                    setTaskForm={setTaskForm}
                    // Fallback to all operators if no one is 'available' (Urgent override)
                    operators={availableOperators.length > 0 ? availableOperators : operators}
                    onSave={saveTask}
                    onCancel={() => setShowTaskForm(false)}
                    editing={!!editingTaskId}
                  />
                </div>
              )}

              <div className="overflow-x-auto">
                {tasks.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    {t('noTasksFound')}
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm uppercase">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Deadline</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Assigned To</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{task.title}</td>
                          <td className="py-3 px-4 text-sm">
                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge type={task.priority} />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {task.assignedTo.length > 0 ? (
                              <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                                {t('assignedTo', { count: task.assignedTo.length })} {task.assignedTo.length} Operators
                              </span>
                            ) : (
                              t('unassigned')
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={task.status} />
                          </td>

                          <td className="py-3 px-4">
                            {(task.comments && task.comments.length > 0) ? (
                              <button
                                onClick={() => setActiveCommentTask(task)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-100"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className="text-xs font-semibold">{t('view')}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveCommentTask(task)}
                                className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <span className="text-xs ">{t('empty')}</span>
                              </button>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right space-x-2">
                            <button onClick={() => openEditTask(task)} className="text-blue-600 hover:underline text-sm">{t('edit')}</button>
                            <button onClick={() => deleteTask(task._id)} className="text-red-600 hover:underline text-sm">{t('delete')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <div className="overflow-x-auto">
              <h2 className="text-xl font-semibold mb-6">{t('teamMembers')}</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b text-gray-600 text-sm uppercase">
                    <th className="py-3 px-4">{t('name')}</th>
                    <th className="py-3 px-4">{t('email')}</th>
                    <th className="py-3 px-4">{t('category')}</th> {/* 🔥 */}
                    <th className="py-3 px-4">{t('globalActiveTasks')}</th>
                    <th className="py-3 px-4">{t('status')}</th>
                    <th className="py-3 px-4 text-right">{t('action')}</th> {/* 🔥 */}

                  </tr>
                </thead>
                <tbody>
                  {operators.map((op) => {
                    // ⭐ UPDATED LOGIC: Use values directly from Backend
                    const activeTasks = op.totalTasks;
                    const isBusy = activeTasks >= 3;

                    return (
                      <tr key={op.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">{op.name}</td>
                        <td className="py-3 px-4 text-gray-600">{op.email}</td>

                        <td className="py-3 px-4">
                          <select
                            value={op.category || ""}
                            onChange={(e) => updateOperatorCategory(op.id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm bg-white"
                          >
                            <option value="">{t('unassigned')}</option>
                            <option value="Plastic">{t('plastic')}</option>
                            <option value="Modelling">{t('modelling')}</option>
                            <option value="Refining">{t('refining')}</option>
                          </select>
                        </td>


                        <td className="py-3 px-4 font-bold text-gray-700">{activeTasks}</td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${isBusy ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isBusy ? t('busy') : t('available')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "docs" && <DocumentTab />}
        </div>
      </main>
    </div>
  );
}

// Helpers... (StatCard, Tab, Badge, StatusBadge - Keep same as before)
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{label}</button>
  );
}

function Badge({ type }) {
  const colors = { High: "bg-red-100 text-red-800", Medium: "bg-yellow-100 text-yellow-800", Low: "bg-green-100 text-green-800" };
  return <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[type] || "bg-gray-100"}`}>{type}</span>;
}

function StatusBadge({ status }) {
  const normalizedStatus = status ? status.toLowerCase() : "";
  let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
  if (normalizedStatus === "completed") colorClass = "bg-green-100 text-green-700 border-green-200";
  else if (normalizedStatus === "pending") colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
  else if (normalizedStatus.includes("process")) colorClass = "bg-blue-100 text-blue-700 border-blue-200";
  return <span className={`px-2.5 py-0.5 rounded border text-xs font-bold capitalize ${colorClass}`}>{status}</span>;
}