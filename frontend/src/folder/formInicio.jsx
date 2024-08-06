import "./formInicio.css"
import {FaUser, FaLock} from "react-icons/fa"
export function FormInicio(){
    return(

        <body> 
             <img src="NucleoColor.png" alt=""/>
        <section>
            <form className="formulario">
            <h1>Iniciar sesión</h1>
            <label>
                <FaUser className="icon"/>
                <input type="text" placeholder="Nombre de usuario"/>  
            </label>
            <label>
                <FaLock className="icon"/>
                <input type="password" placeholder="Contraseña"/>
            </label>
                <a href="#">Recuperar contraseña</a>
                <button>Ingresar</button>
            </form> 

        </section>
        </body>
    )
}
export default FormInicio;