import React from "react";
import { useTable } from "react-table";

const Table = ({ columns, data }) => {
  // Use the useTable hook to create your table configuration
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <div className="overflow-x-auto shadow-md bg-gray-800 rounded-tl-lg rounded-tr-lg">
      {" "}
      {/* Add shadow for better border visibility */}{" "}
      <table {...getTableProps()} className="min-w-full bg-gray-800 text-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="   bg-gray-600 text-gray-400 uppercase tracking-wider  "
            >
              {headerGroup.headers.map((column) => (
                <th className="py-5 px-6 text-left text-bold  ">
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-500">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="py-3 px-4">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
