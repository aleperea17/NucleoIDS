import fotos from './img'

const Table = () => {
    return (
    
<div className="">

<div className="hero">
 
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">Lista de profesores</h1>
      <br/>
    </div>
</div>

  <table className="table">
    {/* head */}
    
    <thead>

      <tr>
        <th>
        </th>
        <th className="text-xl">Nombre y apellido</th>
        <th className="text-xl">Taller</th>
        <th className="text-xl" >Edición</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr>
        <th>
          
        </th>
        <td>
          <div className="flex items-center gap-5">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={fotos.img1}
                  alt="Photo" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">Diego Padula</div>
              
            </div>
          </div>
        </td>
        <td>
          <span className="badge text-base">Diseño 3D</span>
        </td>
        <th>
          <button className="btn btn-link">Editar</button>
        </th>
      </tr>
      {/* row 2 */}
      <tr>
        <th>
        </th>
        <td>
          <div className="flex items-center gap-5">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={fotos.img2}
                  alt="photo" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">Verónica Rossi</div>
            </div>
          </div>
        </td>
        <td>
          <span className="badge text-base">Inglés</span>
        </td>
        <th>
          <button className="btn btn-link btn-sms">Editar</button>
        </th>
      </tr>
      {/* row 3 */}
      <tr>
        <th> 
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={fotos.img3}
                  alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">Alejandro Perea</div>
            </div>
          </div>
        </td>
        <td>
          <span className="badge text-base">Programación</span> 
        </td>
        <th>
          <button className="btn btn-link btn-sms">Editar</button>
        </th>
      </tr>
      {/* row 4 */}
      <tr>
        <th>   
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={fotos.img4}
                  alt="Photo" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">Matías Salvatelli</div>
             
            </div>
          </div>
        </td>
        <td>
          <span className="badge text-base">Impresión 3D</span>
        </td>
       
        <th>
          <button className="btn btn-link btn-sms">Editar</button>
        </th>
      </tr>
      <tr>
        <th>
        
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={fotos.img5}
                  alt="Photo" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg">Jorge Boggio</div>
              
            </div>
          </div>
        </td>
        <td>
         
          <span className="badge text-base">Robótica</span>
        </td>
     
        <th>
          <button className="btn btn-link btn-sms">Editar</button>
        </th>
      </tr>
    </tbody>
    {/* foot */}
    <tfoot>
     
    </tfoot>
  </table>
</div>

    );
}

export default Table;