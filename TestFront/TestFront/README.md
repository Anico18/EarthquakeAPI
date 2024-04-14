## Frontend

La versión de Node que hace funcionar a React en esta aplicación es la v18.18.0. Se utilizó Vite como ambiente de desarrollo haciendo uso del comando `npm create vite@latest` y seleccionado `React + Javascript`.

### Estructura

Se siguió una estructura escalable basada en componentes y páginas, estándar de React. Algunos componentes cuentan con su propia hoja de estilos de `scss`. Además, se utilizó `BrowserRouter` para el ruteo de la página y crearon un total de 4 páginas: `Home.jsx`, `CreateComment.jsx`, `CommentIndex.jsx` y `Err404.jsx`. Ésta última para indicar que el usuario ha llegado a una página sin ruta. Asimismo, existen 3 componentes principales: `form`, `navbar` y `table`. Cabe indicar que la página es sencilla y se ha priorizado la funcionalidad por sobre la apariencia. Se utiliza el hook `useNavigate` para permitir el envío de Id del terremoto a la página de comentarios.

### Fetch de datos

Se utiliza la función `fetch` de React para obtener los datos del backend, y los hooks `useState` y `useEffect` para poder gestionar las funcionalidades básicas de la obtención de datos y la paginación en sí mismo.
En el caso de la obtención y renderizado de los terremotos se utiliza una función asíncrona a partir del siguiente código:

```
const loadEarthquakes = async () => {
  setLoading(true);
  try {
    const response = await fetch(`http://localhost:3000/api/features/test/?limit=${PER_PAGE}&offset=${offset}`);
    if(!response.ok) {
      throw new Error('Failed loading earthquakes');
    }
    const data = await response.json();
    setEarthquakes(data.data);
    setTotal(data.total);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching earthquakes', error);
    setLoading(false);
  }
};
```

Por otro lado, en los comentarios, es una propuesta síncrona y se realiza a partir del siguiente código:

```
useEffect(() => {
  fetch("http://localhost:3000/api/features/comments/")
    .then((response) => response.json())
    .then((responseData) => {
      
      if (Array.isArray(responseData.data)) {
        setData(responseData.data);
      } else {
        console.error("Invalid data format:", responseData);
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}, []);
```

### Paginación

La paginación en el frontend se realiza a partir de una constante `PER_PAGE` y dos funciones `handlePageClickPrev` y `handlePageClickNext`, las cuales manejan la actualización de las variables que controlan la paginación:

```
const handlePageClickPrev = () => {
  const newOffset = offset - PER_PAGE;
  if (newOffset >= 0) {
    setOffset(newOffset);
  }
};

const handlePageClickNext = () => {
  const newOffset = offset + PER_PAGE;
  if (newOffset <= total) {
    setOffset(newOffset);
  }
};
```

