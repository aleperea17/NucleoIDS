import fotos from './img';

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
              <th key={index} className="text-xl">
                {column.label}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th></th>
              <td>
                <div className="flex items-center gap-5">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img src={item.avatar || fotos.img1} alt="Photo" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{item.name}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge text-base">{item.badge}</span>
              </td>
              <th>
                <button className="btn btn-link">Editar</button>
              </th>
            </tr>
          ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
};

export default Table;
