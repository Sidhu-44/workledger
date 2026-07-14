export function SkeletonCard() {
  return (
    <div className="p-5 rounded-xl2 border border-gray-100 dark:border-gray-800">
      <div className="skeleton h-3 w-24 mb-3" />
      <div className="skeleton h-7 w-32" />
    </div>
  );
}

export function SkeletonRow({ columns = 5 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </tbody>
  );
}
