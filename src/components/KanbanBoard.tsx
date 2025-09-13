'use client';

import { useTasks } from '@/lib/TaskContext';
import { TaskStatus, Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Pagination } from './Pagination';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { useState } from 'react';

// Sortable Task Card Component
function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <TaskCard task={task} />
    </div>
  );
}

const columns: { id: TaskStatus; title: string; color: string; bgColor: string }[] = [
  { id: 'todo', title: 'TODO', color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-200' },
  { id: 'doing', title: 'DOING', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200' },
  { id: 'on_hold', title: 'ON HOLD', color: 'text-gray-500', bgColor: 'bg-gray-50 border-gray-200' },
  { id: 'done', title: 'DONE', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
];

const TASKS_PER_PAGE = 4;

export function KanbanBoard() {
  const { tasks, moveTask } = useTasks();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');
  const [currentPages, setCurrentPages] = useState<Record<TaskStatus, number>>({
    todo: 1,
    doing: 1,
    on_hold: 1,
    done: 1,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, args) => {
        const { currentCoordinates } = args;
        return currentCoordinates;
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);

    // Allow dragging for all tasks - no restrictions on status
    // This includes completed tasks that can be moved back to earlier stages
    if (task) {
      setActiveId(taskId);
      setIsDragging(true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If hovering over a column (allow dropping on any column)
    if (columns.some(col => col.id === overId)) {
      const newStatus = overId as TaskStatus;
      const task = tasks.find(t => t.id === activeId);

      // Allow moving to any status - no restrictions
      // This includes moving completed tasks back to earlier stages
      if (task && task.status !== newStatus) {
        moveTask(activeId, newStatus);

        // Announce status change to screen readers
        const statusName = columns.find(col => col.id === newStatus)?.title || newStatus;
        setStatusAnnouncement(`Task "${task.title}" moved to ${statusName}`);

        // Clear announcement after 3 seconds
        setTimeout(() => setStatusAnnouncement(''), 3000);

        // Auto-start timer if moved to 'doing' status (unless it was already doing)
        if (newStatus === 'doing' && task.status !== 'doing') {
          // Use setTimeout to ensure the task status is updated first
          setTimeout(() => {
            const updatedTask = tasks.find(t => t.id === activeId);
            if (updatedTask && updatedTask.status === 'doing') {
              // The timer will be started automatically by the TaskContext when status changes to 'doing'
            }
          }, 0);
        }

        // Stop timer if moved away from 'doing' status
        if (task.status === 'doing' && newStatus !== 'doing') {
          // The timer will be stopped automatically by the TaskContext when status changes from 'doing'
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setIsDragging(false);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getPaginatedTasks = (status: TaskStatus) => {
    const allTasks = getTasksByStatus(status);
    const currentPage = currentPages[status];
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;
    return allTasks.slice(startIndex, endIndex);
  };

  const getTotalPages = (status: TaskStatus) => {
    const totalTasks = getTasksByStatus(status).length;
    return Math.ceil(totalTasks / TASKS_PER_PAGE);
  };

  const handlePageChange = (status: TaskStatus, page: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [status]: page,
    }));
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        role="main"
        aria-label="Task management kanban board"
        aria-live="polite"
        aria-atomic="false"
      >
      {columns.map((column) => {
        const allTasks = getTasksByStatus(column.id);
        const paginatedTasks = getPaginatedTasks(column.id);
        const totalPages = getTotalPages(column.id);
        const currentPage = currentPages[column.id];

        return (
          <div
            key={column.id}
            className={`rounded-xl border overflow-hidden ${column.bgColor} ${
              isDragging && column.id !== 'done' ? 'ring-2 ring-blue-300 ring-opacity-50' : ''
            }`}
            role="region"
            aria-labelledby={`column-${column.id}-header`}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add(
                'ring-4', 'ring-blue-400', 'ring-opacity-80',
                'scale-105', 'transition-all', 'duration-300',
                'shadow-lg', 'bg-blue-50/50'
              );
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove(
                'ring-4', 'ring-blue-400', 'ring-opacity-80',
                'scale-105', 'transition-all', 'duration-300',
                'shadow-lg', 'bg-blue-50/50'
              );
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove(
                'ring-4', 'ring-blue-400', 'ring-opacity-80',
                'scale-105', 'transition-all', 'duration-300',
                'shadow-lg', 'bg-blue-50/50'
              );

              const taskId = e.dataTransfer.getData('text/plain');
              const task = tasks.find(t => t.id === taskId);

              if (task && task.status !== column.id) {
                moveTask(taskId, column.id as TaskStatus);
              }
            }}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200 bg-white/50">
              <div className="flex items-center justify-between">
                <h2
                  id={`column-${column.id}-header`}
                  className={`font-semibold text-sm uppercase tracking-wide ${column.color}`}
                >
                  {column.title}
                </h2>
                <span
                  className="bg-white text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full min-w-[24px] text-center shadow-sm border border-gray-200"
                  aria-label={`${allTasks.length} tasks in ${column.title}`}
                >
                  {allTasks.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-4 space-y-3 h-[500px] overflow-y-auto">
              <SortableContext items={paginatedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {paginatedTasks.map((task) => (
                  <SortableTaskCard key={task.id} task={task} />
                ))}
              </SortableContext>

              {/* Empty State */}
              {allTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-sm font-medium mb-1">No tasks</div>
                  <div className="text-xs opacity-75">Tasks will appear here</div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => handlePageChange(column.id, page)}
                />
              )}
            </div>
          </div>
        );
      })}
      </div>

      {/* Screen Reader Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusAnnouncement}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div
            className="transform rotate-3 opacity-90 shadow-2xl scale-105 transition-all duration-300 ease-out z-50"
            style={{
              filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))',
            }}
          >
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}