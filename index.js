const { Pool } = require("pg")

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'supermercado',
    user: 'postgres',
    password: 'postgres'
})


const actualizacionPrecios = async () => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN") //Iniciar la transacción

        const consulta1 = { //Modificación del producto Arroz
            text: "UPDATE productos SET prod_precio = 1800 WHERE prod_id = $1 RETURNING *",
            values: [4]
        }
        const actualizacion1 = await client.query(consulta1)
        console.log(actualizacion1);


        const consulta2 = { //Modificación del producto Pasta
            text: "UPDATE productos SET prod_precio = 1900 WHERE prod_id = $1 RETURNING *",
            values: [10]
        }
        const actualizacion2 = await client.query(consulta2)
        console.log(actualizacion2);
        console.log("Ejecución exitosa");
        await client.query("COMMIT")
    } catch (error) {
        console.log(error.message);
        await client.query("ROLLBACK")
    } finally {
        await client.end()
    }
}
// actualizacionPrecios()

// Ejecutar la consulta del cliente para el proceso e venta
const procesoVenta = async() => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN") //Iniciar la transacción
        const consultaCliente = {
            text: "INSERT INTO clientes(cl_rut, cl_dv, cl_nombre, cl_apellido, cl_direccion, cl_telefono, cl_correo,cl_fecha_nacimiento) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            values: [44444444, 4, "Luis", "Medina", "Santiago", "+56912345678","lmedina@mail.com","1980-05-15"]
        }
        const registroCliente = await client.query(consultaCliente);
        const idCliente = registroCliente.rows[0].cl_id
        console.log('idCliente', idCliente);
         //Fin Registro de Cliente
        

// Ejecutar la consulta de registro de colaborador

const consultaColaborador = {
    text: "INSERT INTO colaboradores(col_rut, col_dv, col_nombre, col_apellido) VALUES($1, $2, $3, $4) RETURNING *",
    values: [5243077, 1, "María", "León"]
}
const registroColaborador = await client.query(consultaColaborador)
const idColaborador = registroColaborador.rows[0].col_id
console.log("idColaborador",idColaborador)
// Fin Registro de Colaborador
    
  

// Ejecutar registro de productos
    const consultaProducto1 = {
        text: 'insert into productos(prod_codigo, prod_nombre, prod_precio, prod_stock) values($1, $2, $3, $4) returning *',
        values: ["MART001", 'Martillo', 25000, 100]
    }
    const registroProducto1 = await client.query(consultaProducto1)
    const idProducto1 = registroProducto1.rows[0].prod_id
    console.log("idProducto1", idProducto1);
  
    const consultaProducto2 = {
        text: 'insert into productos(prod_codigo, prod_nombre, prod_precio, prod_stock) values($1, $2, $3, $4) returning *',
        values: ["DES001", 'Destornillador', 3900, 50]
    }
    const registroProducto2 = await client.query(consultaProducto2)
    const idProducto2 = registroProducto2.rows[0].prod_id
    console.log('idProducto2', idProducto2);
    // Fin Registro de Productos


    //registro de venta
    const consultaventa = {
        text: 'insert into ventas(ven_id_clientes, ven_id_colaboradores, ven_id_tipos_comprobantes, ven_fecha_hora, ven_iva, ven_tipo_pago) values($1, $2, $3, now(), $4, $5) returning *',
        values: [idCliente, idColaborador, 1, 19, 'Efectivo']
    }
    const registroVenta = await client.query(consultaventa)
    const idVenta = registroVenta.rows[0].ven_numero_transaccion
    console.log('idVenta', idVenta);
     // Fin Registro de venta

    //Asociacion de prosuctos a la venta
    const consultaVentaProducto1 = {
        text: 'insert into ventas_productos(vp_numero_transaccion, vp_id_producto, vp_cantidad) values($1, $2, $3) returning *',
        values: [idVenta, idProducto1, 1]
    }
    const registroVentaProducto1 = await client.query(consultaVentaProducto1)

    const consultaVentaProducto2 = {
        text: 'insert into ventas_productos(vp_numero_transaccion, vp_id_producto, vp_cantidad) values($1, $2, $3) returning *',
        values: [idVenta, idProducto2, 1]
    }
    const registroVentaProducto2 = await client.query(consultaVentaProducto2)

        console.log("Ejecucion Exitosa");
        await client.query("commit")
    }   catch (error) {
        console.log(error.message);
        // Finalización de la transacción en caso de error.
        await client.query('rollback')
    } finally {
        client.end()
    }
}
procesoVenta()


