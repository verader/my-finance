# Proyecto My-Finance para manejo de finanzas personales

Aplicación que permite registrar un presupuesto para un mes determinado (período) y registrar las entradas y salidas de dinero en dicho período.
Utiliza una base de datos no relacional alojada en firebase mediante el consumo de API REST

## Descripción del proyecto

### Períodos

Permite definir un período mensual en el cual se administrará un presupuesto.

Un período debe indicar un mes y año, un nombre y el presupuesto del período divido en 2 cuentas: gastos fijos y gastos variables.

El período en el cuál se registrarán las entradas y salidas de dinero será el período "Activo".

Solo puede haber un período "activo" a la vez.  Si se activa un período, se desactivará el período activo anterior.

### Dashboard

Muestra el resumen para cada una de las cuentas (gastos fijos y gastos variables) del período activo cuyo presupuesto se desea administrar.  
Por cada cuenta se muestra el saldo, las salidas de dinero (cargos), las entradas de dinero (abonos) y el presupuesto original para dicha cuenta definido en "Períodos".

Por cada cuenta es posible ingresar "Movimientos" que registrarán una entrada o salida de dinero. Al ingresar un nuevo movimento se deberá indicar
su tipo (cargo o abono) la fecha, un nombre y el monto.  Al ingresar un movimiento se actualizará el saldo para la cuenta correspondiente (los cargos serán restados del saldo y los abonos serán sumados a este).

Es posible modificar o eliminar un movimiento.  Con esto se actualizará el saldo para la cuenta correspondiente.

## Arquitectura del proyecto

### /actions/
Contiene la definición de las acciones a ejecutar por Redux

### /styles/
Contiene estilos y recursos gráficos

### /components/
Contiene todos los componentes funcionales de la app.

### /constants/
Contiene la definición de constantes de conexiones y funciones comunes.

### /containers/
Contiene los componentes que son utilizados como contenedores de los módulos de la app

### /custom-hooks/
Contiene la definición todos los custom hooks utilizados para obtener y enviar datos desde y hacia la api

### /reducers/
Contiene la definición de los reducers de Redux

### /routes/
Contiene el componente principal App y la definició de rutas.