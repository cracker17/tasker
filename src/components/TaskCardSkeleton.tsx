export function TaskCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-muted rounded"></div>
          <div className="w-6 h-6 bg-muted rounded"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-muted rounded w-full"></div>
        <div className="h-3 bg-muted rounded w-2/3"></div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs mb-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
        <div className="h-5 bg-muted rounded w-8"></div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="h-7 bg-muted rounded px-3 flex-1"></div>
        <div className="h-7 bg-muted rounded px-3 flex-1"></div>
      </div>
    </div>
  );
}

export function KanbanColumnSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-16"></div>
          <div className="h-6 bg-muted rounded w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="h-3 bg-muted rounded w-20 mx-auto mb-1"></div>
            <div className="h-2 bg-muted rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}