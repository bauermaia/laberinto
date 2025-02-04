//proyecto para que haya un efecto siguiendo el puntero
import { useEffect, useState } from "react"

function App() {

  //laberinto
  const mazeData= [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]  
  ]

  const [meta, setMeta]= useState(false)

  //crea un estado para saber si el efecto está activo o no
  //por defecto es enabled
  const [enabled, setEnabled] = useState(false)
  
  //crea otro efecto para guardar la posicion del puntero, es la que le trasladamos al circulo
  //en el style del div
  const [position, setPosition] = useState({x: 600, y: 431})

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [offset, setOffset] = useState({x: 0, y: 0})
  const [validPath, setValidPath] = useState(false)

  const cellSize = 40;

useEffect(()=>{
  const mazeElement = document.getElementById('maze');
    if (mazeElement) {
      const rect = mazeElement.getBoundingClientRect();
      setOffset({ x: rect.left, y: rect.top }); // Guardar en el estado
    }
},[]) //solo se ejecuta una vez cuando se monta el componente

  //efecto poiner move
  useEffect(()=>{
 
    //crea una función para manejar el movimiento del ratón, que recibe la posición x e y del puntero
    //y actualiza el estado de la posición
    const handleMove= (event) => {
      const {clientX, clientY} = event
      setPosition({ x: clientX, y: clientY })
    }

    if(enabled) {
    //dentro del efecto, añade un addEventListener al window para cuando se mueve el ratón
    //solo si el estado enabled es true
    window.addEventListener('pointermove', handleMove)
  }

  //el problema es que aunque le demos al boton desactivar seguir al ratón, el evento sigue suscripto
  //por lo que hay que limpiarlo en el return
  //esto se ejecuta siempre que se desmonte el componente y cada vez que cambie la dependencia
  return()=>{
    window.removeEventListener('pointermove', handleMove)
  }

  }, [enabled])

  //crea otro efecto para detectar si se perdió

  useEffect(()=>{
    const row = Math.floor((position.y - offset.y) / cellSize);
    const col = Math.floor((position.x - offset.x) / cellSize);

    if(
      row >= 0 &&
      row < mazeData.length &&
      col >= 0 &&
      col < mazeData[0].length) 
      {
      if( mazeData[row][col] === 1) {
        setEnabled(false);
        setModalMessage("Inténtalo de nuevo, has chocado con una pared" + "🤦");
        setShowModal(true);
      } else  {
        setValidPath(true);
      }
    }
  }, [position, offset]) //se actualiza cuando cambia la posicion o el offset


  //inicia el juego
  const handleButtonClick = () => {
    setEnabled(true)
    setMeta(false)
    setShowModal(false);  
    setValidPath(false);
  }
  

  //detecta llegada a la meta
  const handleMetaEnter = () => {
    if(validPath) {
      setMeta(true);
      setModalMessage("¡Felicidades, has llegado a la meta! 🎉");
      setShowModal(true);
      setEnabled(false);
      setTimeout(() => {
        setPosition({ x: 600, y: 431 });
      }, 10);
    }
  }  

  //al hacer clic al boton se llama a la función para cambiar el estado
  //y cambia también el texto del boton. Dentro del div crea la bolita que seguira al puntero
  return (
    <>
    <div className="meta"
    onMouseEnter={handleMetaEnter}>
      Meta
    </div>


    <div id="maze" style={{display: 'grid', gridTemplateColumns:`repeat(${mazeData[0].length}, 40px)`, gap: '2px'}}>
      {mazeData.map((row, rowIndex)=>
      row.map((cell, colIndex)=>(
        <div
          key={`${rowIndex}-${colIndex}`}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: cell === 1 ? 'black' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeigth: 'bold'
          }}
          >
             {
      enabled && (
        <div className={meta ? 'no-cursor' : 'cursor'} style={{left: position.x, top: position.y}}></div>
      )
      }
        </div> 
      ))
      )}
    </div>
   

    <button onClick={handleButtonClick}> Click para comenzar</button>

     {showModal && (
        <div className="modal">
          <p>{modalMessage}</p>
        </div>
      )}   

    
    </>
  )
}

export default App
