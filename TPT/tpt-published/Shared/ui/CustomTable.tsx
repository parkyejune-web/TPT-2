import React from 'react';

type ColumnDef<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cell?: (value: unknown) => React.ReactNode;
};

type CommonTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
};

export function CustomTable<T extends object>({ data, columns, className = '' }: CommonTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto border rounded-md ${className}`}>
      <table className="table-auto w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="p-2 border font-semibold text-gray-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => {
                let value: unknown;
                if (typeof column.accessor === 'function') {
                  value = column.accessor(row);
                } else {
                  value = row[column.accessor];
                }

                const cellContent = column.cell ? column.cell(value) : value;

                return (
                  <td key={colIndex} className="p-2 border">
                    {cellContent as React.ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
