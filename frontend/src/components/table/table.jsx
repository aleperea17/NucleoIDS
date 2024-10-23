export default function Table({
  columns,
  data,
  loading = false,
}) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array(4)
                .fill()
                .map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex}>
                        <div className="skeleton w-full h-20"></div>
                      </td>
                    ))}
                  </tr>
                ))
            : data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render
                        ? column.render(row[column.accessor], row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
