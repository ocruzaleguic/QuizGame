📘 Proyecto Quiz Web (HTML, CSS, JS)

--------------------------------------------------------------

📌 Descripción del Proyecto

Este proyecto es una aplicación web de quiz interactivo,
desarrollada con HTML, CSS y JavaScript,
siguiendo una arquitectura modular basada en archivos independientes.

Incluye:

    Sistema de Login y Registro
    Usuarios semilla desde JSON
    Usuarios registrados en LocalStorage
    Sesiones usando LocalStorage
    Preguntas desde JSON
    Puntaje y avance guardado
    Pantallas separadas: Index, Login, Registro, Menú, Quiz, Final, Settings

--------------------------------------------------------------

▶️ Cómo Ejecutar

Descargar o clonar el proyecto
Abrir index.html en cualquier navegador moderno
Usar el sistema de login y jugar el quiz


--------------------------------------------------------------

🔐 Sistema de Autenticación

    El sistema de autenticación combina:

    ✔ Usuarios Semilla
    Cargados desde /data/users.json.

    ✔ Usuarios Registrados
    Guardados en LocalStorage bajo la clave: registeredUsers

    ✔ Usuario Logueado
    Cuando el usuario inicia sesión, se almacena en: loggedUser


    Al cerrar sesión, se borra todo menos los registeredUsers.



🔑 Flujo del Login

    1. Se lee username + password desde el formulario.
    2. Se cargan usuarios semilla desde users.json.
    3. Se cargan usuarios registrados desde LocalStorage.
    4. Se unen ambas listas.
    5. Se valida la credencial.
    6. Si coincide → se guarda loggedUser y se redirige al menú.
    7. Si no coincide → se muestra mensaje de error.



📝 Registro de Usuarios

    En register.html el usuario ingresa:

    Nombre
    Correo
    Usuario
    Contraseña

    Validaciones:

    El correo no puede repetirse
    El nombre de usuario no puede repetirse
    Si todo es correcto:
        ✔ Se agrega el usuario a registeredUsers
        ✔ Se redirige a login.html



🎮 Sistema de Quiz

    Controlado por quiz.js

    Funciones principales:

        Cargar preguntas desde quiz.json
        Mostrar una pregunta por vez
        Permitir seleccionar una opción
        Validar contra correctIndex
        Sumar puntaje con cada respuesta correcta
        Avanzar automáticamente
        Al terminar → redirigir a quizEnd.html

    El progreso se guarda en localStorage con:

    quiz_score
    quiz_index



🏁 Pantalla Final

    En quizEnd.html se muestra:

    Puntaje final (correctas / total)
    Botón “Reiniciar Quiz”
    Botón “Terminar” (volver al menú)