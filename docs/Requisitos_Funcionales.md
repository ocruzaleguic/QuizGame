

📄 01_Requisitos_Funcionales

    > Proyecto: Mini Aplicación Web — Quiz Game
    > Versión: 1.0.0
    > Tecnologías permitidas: HTML, CSS y JavaScript puro


🧭 1. Descripción General

    Este documento describe qué debe hacer la mini aplicación web Quiz Game.
    La idea es que puedas construir una aplicación sencilla que permita:
    Registrarse e iniciar sesión (autenticación simulada).


    - Acceder a un menú principal.
    - Realizar un quiz de preguntas y respuestas.
    - Ver un puntaje final.
    - Reiniciar o terminar el juego.



📌 2. Alcance del Proyecto

    ✔️ Incluye

        - Interfaz web con varias pantallas.
        - Navegación entre vistas.
        - Autenticación simulada usando datos de ejemplo + localStorage.
        - Menú principal con acceso al juego.
        - Quiz de preguntas basado en un archivo JSON.
        - Cálculo de puntaje.
        - Pantalla/popup final con opciones de:
            Reiniciar el quiz
            Terminar (volver al Menú)
            Logout del usuario.


    ❌ No incluye

        - Consumo de APIs reales.
        - Backend.
        - Configuración de sonido (solo pantalla placeholder).
        - Seguridad avanzada.
        - Diseño visual complejo.
        - Base de datos.
        - Lógica de audio.



🧑‍💻 3. Usuarios del Sistema

    - Usuario Invitado

        No autenticado.

        Solo puede acceder a:
        Login
        Registro


    - Usuario Autenticado

        Accede a:
        Menú principal
        Quiz
        Selección de Area
        Settings (placeholder)
        Logout



🧩 4. Flujo General de la Aplicación


    4.1 Inicio de la aplicación
        
        Si el usuario NO está autenticado: debe ver la pantalla de Login
        Si el usuario SÍ está autenticado:
            Si no tiene Área seleccionada, debe ver la Selcción de Area
            Si SÍ tiene Área seleccionada, debe ver el Menú principal


    4.2 Login

        El usuario puede: Ingresar username y password.

        Validar sus datos contra:

        - El archivo users.json (usuarios semilla)
        - Los usuarios registrados previamente en localStorage
        - Ver un mensaje si los datos son incorrectos
        - Acceder a la pantalla de Registro mediante un enlace
        - Si los datos son válidos:
        - Se debe guardar en localStorage que el usuario está autenticado
        - El usuario es llevado al Menú principal


    4.3 Registro

        El usuario puede:

            Ingresar username, email y password
            Verificar que el username no exista:
                Ni en users.json
                Ni en los usuarios de localStorage
            Si el registro es válido:
                El usuario se almacena en localStorage


        El sistema puede:

            Iniciar sesión automáticamente o
            Redirigir al Login (a elección del practicante)
            Debe existir un enlace para volver al Login


    4.4 Menú Principal

        El menú contiene:

        - Botón Play
            Inicia el Quiz

        - Botón Settings
            Lleva a una pantalla simple (placeholder) que no contiene funcionalidad aún

        - Botón Logout
            Borra estado de autenticación
            Redirige al Login


        Si un usuario intenta entrar al Menú sin estar autenticado:
        Debe redirigirse a Login automáticamente


    4.5 Settings (placeholder)

        Debe mostrar:

        - Un mensaje informativo indicando que la configuración se añadirá más adelante
        - Un botón de “Volver” que regrese al Menú
        - No tiene funcionalidades adicionales


    4.6 Quiz

        El sistema debe:

        - Cargar las preguntas desde quiz.json
        - Mostrar una pregunta a la vez
        - Mostrar opciones de respuesta
        - Permitir seleccionar solo una respuesta
        - Avanzar a la siguiente pregunta después de responder
        - Llevar puntaje basado en respuestas correctas


    4.7 Final del Quiz

        - Cuando se terminan todas las preguntas:
        - Debe mostrarse el puntaje final del usuario
        - Debe visualizarse un popup o pantalla final con:
        - Reiniciar → volver a la primera pregunta y puntaje en 0
        - Terminar → regresar al Menú principal



📑 5. Requisitos Funcionales (RF)

    Autenticación

        RF-01: Debe existir una pantalla de Login.
        RF-02: Debe existir una pantalla de Registro.
        RF-03: El Login valida los datos usando users.json y localStorage.
        RF-04: El Registro guarda nuevos usuarios en localStorage.
        RF-05: Debe guardarse en localStorage el estado de sesión.
        RF-06: El sistema debe controlar acceso según si el usuario está autenticado.
        RF-07: Debe existir un botón de Logout que elimine el estado de sesión.

    Menú Principal

        RF-08: Debe tener botones para Play, Settings y Logout.
        RF-09: Si un usuario no autenticado accede al Menú, debe ser redirigido.

    Settings

        RF-10: Debe existir una pantalla placeholder con un mensaje informativo.
        RF-11: Debe existir un botón para regresar al Menú.

    Quiz

        RF-12: Debe cargar preguntas desde quiz.json.
        RF-13: Debe mostrar una pregunta a la vez.
        RF-14: Debe permitir seleccionar una respuesta.
        RF-15: Debe validar respuesta usando correctIndex.
        RF-16: Debe sumar puntaje por respuestas correctas.

    Pantalla Final

        RF-17: Debe mostrar el puntaje final.
        RF-18: Debe tener un botón para Reiniciar el quiz.
        RF-19: Debe tener un botón para Terminar (volver al Menú).



🧪 6. Requisitos No Funcionales (RNF)

        RNF-01: La aplicación debe estar construida usando únicamente:

            HTML5
            CSS
            JavaScript Puro

        RNF-02: El código debe estar organizado de forma modular.
        RNF-03: La navegación puede ser SPA simple (mostrar/ocultar secciones) o varias páginas HTML.
        RNF-04: Debe existir un archivo README.md que explique cómo ejecutar el proyecto.
        RNF-05: Los JSON deben ubicarse correctamente en una carpeta /data/.



🗂️ 7. Estructura del Proyecto

    root/
    │
    ├── index.html
    ├── styles.css
    ├── /js
    │   ├── areaselect.js
    │   ├── auth.js
    │   ├── quiz.js
    │   └── utils.js
    │
    ├── /data
    │   ├── users.json
    │   └── quiz.json
    │
    └── /docs
        ├── Requisitos_Funcionales.md
        └── readme.md
        └── documentacionDeVersiones.md
