export default function Table({
  columns,
  data,
  loading = false,
  withCheckbox = true,
}) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="table table-zebra-zebra">
        {/* head */}
        <thead>
          <tr>
            {withCheckbox && (
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
            )}
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
                  {withCheckbox && (
                    <th>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox skeleton"
                        />
                      </label>
                    </th>
                  )}
                  {columns.map((_, colIndex) => (
                    <td key={colIndex}>
                      <div className="skeleton w-full h-20"></div>
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {withCheckbox && (
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                )}
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
            {withCheckbox && <th></th>}
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
