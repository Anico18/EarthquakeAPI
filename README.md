# EarthquakeAPI

Prueba técnica con Ruby On Rails y React.JS.

Esta prueba se divide en dos partes: Backend y Frontend. Para la parte de Backend, se utilizó Ruby, apoyándose del framework Rails. Por otro lado, para el Frontend, se utilizó React.JS a partir de Vite. El presente repositorio se encuentra dividido en dos carpetas: Test (esta parte contiene el Backend en Ruby On Rails) y TestFront (carpeta que incluye el frontend en React.JS).

Es necesario mencionar que, antes de esta prueba, no tenía conocimiento de Ruby ni Rails, por lo que se realizaron investigaciones extensas y soporte en la [documentación propia de Rails](https://guides.rubyonrails.org/). A continuación, se incluye una explicación de las partes más importantes y los detalles de las aplicaciones realizadas.

## Aspectos generales

Ambos aplicativos hace uso de API, es decir, el backend expone tres endpoints principales y el front recibe información de dos de ellos. Las pruebas del backend se realizaron a partir del aplicativo de **Postman** y la base de datos es la que Ruby On Rails configura por defecto: **SQLite3**. Se realizó la programación de ambos aplicativos en **Visual Studio Code** y para revisar los contenidos de la base de datos, se utilizó la extensión _SQLite3_, la cual permite crear un visualizador de tablas para SQLite3 en el mismo editor de código. El proyecto obtiene, por el lado del backend, una [lista de terremotos](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson) ocurridos en territorio estadounidense en el último mes en formato geojson y lo expone, además de persistirlo y validarlo, para que el frontend pueda presentarlo de manera visual al usuario.

## Backend

La versión de Ruby que se utilizó en el presente proyecto es _ruby 3.0.0p0 (2020-12-25 revision 95aff21468) [arm64-darwin23]_, y la versión de Rails es Rails 7.1.3.2. Se utilizaron las _gem_ de apoyo **rest-client**, **will_paginate** y **rack-cors**.

### Configuración

Se utilizaron las configuraciones por defecto de Rails, teniendo en cuenta su orientación a _Convention over Configuration_ y se utilizó el comando `rails new Test --api` para generar el proyecto y se utilizó también `rails generate model Feature f_type:string external_id:string magnitude:float place:string time:datetime tsunami:boolean mag_type:string title:string longitude:float latitude:float external_url:string` para generar el modelo que corresponde a los terremotos que se obtendrá de la API y `rails g model Comment feature_id:integer body:text` para generar el modelo de los comentarios que se pueden asignar a los terremotos.

Además, en los modelos, se realizaron relaciones entre las tablas a partir de `belongs_to :feature, foreign_key: :feature_id` en el modelo de **Comentarios** y `has_many :comments` en el modelo de **Terremotos (Features)**.

### Validaciones

Se incluyeron validaciones para evitar que, en caso se vuelva a ejecutar la función de persistencia, no se vuelvan a guardar nuevamente en la base de datos las _features_ que ya se encuentran persistidas. Las validaciones son las siguientes:

```
    validates :title, presence: true
    validates :external_url, presence: true, uniqueness: true
    validates :place, presence: true
    validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90.0, less_than_or_equal_to: 90.0 }
    validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180.0, less_than_or_equal_to: 180.0 }
    validates :mag_type, presence: true
    validates :magnitude, numericality: { greater_than_or_equal_to: -1.0, less_than_or_equal_to: 10.0 }

```

Estas validaciones indican que `title`, `external_url`, `place`, `latitude`, `longitude` y `mag_type` no pueden ser `NULL` en la base de datos a partir de `presence: true`; también se revisa que los valores de `latitude` estén entre -90.0 y 90.0, los de `longitude` estén entre -180.0 y 180.0 y los de `magnitude` estén entre -1 y 10 haciendo uso de `numericality: { greater_than_or_equal_to: XY.Z, less_than_or_equal_to: AB.C }`. Para impedir que se registren dos terremotos iguales, se tomó `external_url` como valor único para cada uno de los terremotos, pues se trata de un identificador web que debe ser distinto para cada uno de ellos, esta validación se hace con `uniqueness: true`.

### Paginación

La paginación, por el lado del backend se realizó recibiendo información del frontend a partir de las variables `limit` y `offset`. Se utiliza la siguiente línea de código para realizar la paginación:

```
earthquakes = Feature.limit(params[:limit]).offset(params[:offset])
```
Y la siguiente para indicarle al frontend la cantidad máxima de entradas que tiene la base de datos con los terremotos ya persistidos y permitirle desactivar los botonoes de **Next** o **Prev** si se cumplen condiciones específicas:

```
total = Feature.count
```

### Formato JSON de exposición:

El aplicativo toma información de la base de datos para exponerla en formato JSON y evitar estar haciendo _queries_ constantes a la fuente de información de los terremotos y, por consiguiente, agilizar el funcionamiento del aplicativo. Además, le da formato específico para que el frontend pueda leer la información a partir de las siguientes líneas:

```
rendered_earthquakes = earthquakes.map do |earthquake|
{
    id: earthquake.id,
    type: 'feature',
    attributes: {
    external_id: earthquake.external_id,
    magnitude: earthquake.magnitude,
    place: earthquake.place,
    time: earthquake.time,
    tsunami: earthquake.tsunami,
    mag_type: earthquake.mag_type,
    title: earthquake.title,
    coordinates: {
        longitude: earthquake.longitude,
        latitude: earthquake.latitude
    }
    },
    links: {
    external_url: earthquake.external_url
    }
}

end
total = Feature.count
render json: {
status: 'SUCCESS',
message: 'Loaded earthquakes',
data: rendered_earthquakes,
total: total
}
end
```

La información de los terremotos está en el payload llamado `data` y `total` incluye el total de entradas registradas en la base de datos.

### Comentarios

Se pueden asignar varios comentarios a un mismo terremoto (feature), pero solo uno por vez a partir del frontend o **Postman**.

```
def create
    earthquake = Feature.find(params[:feature_id])
    comment = earthquake.comments.build(body: params[:body])
    if comment.save
        render json: { status: 'SUCCESS', message: 'Comment created successfully', data: comment }, status: :created
    else
        render json: { status: 'ERROR', message: 'Failed to create comment', errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
end

    private
    
    def comment_params
        params.require(:comment).permit(:feature_id, :body) 
    end
end
```

Se encuentra el terremoto en cuestión con `Feature.find` y se asigna el ID a una entrada en la tabla de _Comentarios_ llamada `feature_id`, y el comentario se guarda en la entrada `body` de la misma tabla.

Para tener una ayuda visual de los comentarios, se incluyó una vista simple de los comentarios que es apoyada, desde el backend, con el siguente fragmento de código:

```
def index
    comments = Comment.order('created_at ASC').paginate(page: params[:page], per_page: 1000)
    rendered_comments = comments.map do |comment|
    {
        id: comment.id,
        body: comment.body
    }
end
```

Este fragmento muestra todos los comentarios ordenados de manera ascendente por fecha de creación y limita 1000 comentarios por página. Esta paginación es sencilla y no permite el movimiento entre páginas (a diferencia de la versión de paginación incluida en `test_controller.rb`. Se decidió dejar así para tener en cuenta la primera aproximación que se hizo para cumplir la tarea de paginación.

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

## Dificultades de desarrollo

La principal dificultad en el desarrollo de este proyecto fue el formato API. Siempre he aprendido a desarrollar con renderización de vistas directamente en el proyecto MVC, por lo que exponer APIs y leer APIs fue el reto más grande que he enfrentado en este proyecto; es necesario mencionar que fue complicado hacer que React comprenda la información y no falle en caso de recibir `NULL` y espera a que llegue la información. A su vez, la paginación fue complicada sobre todo por el envío de información de frontend al backend para que se envíe el siguiente _chunk_ de información. Asimismo, me resultó complicado el filtro de información y, lamentablemente, no se ha podido implementar de manera satisfactoria.
