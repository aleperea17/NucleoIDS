import fotos from "./img";

const Table = ({ title, data, columns }) => {
  return (
    <div className="">
      <div className="hero">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold">{title}</h1>
          <br />
        </div>
      </div>

      <table className="table">
        {/* head */}
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`table-column-${index}`} className="text-xl">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
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
        <tfoot></tfoot>
      </table>
    </div>
  );
};

export default Table;
