"use strict";

const botonEliminar = document.querySelector(".botonEliminar");
const botonAcumulado = document.querySelector(".botonAcumulado");
const botonIngresarMonto = document. querySelector(".botonMonto");
const botonAñadirTarjeta = document.querySelector(".botonTarjeta");

const articleEliminar = document.querySelector(".eliminar");
const articleAcumulado = document.querySelector(".acumulado");
const articleIngresarMonto = document.querySelector(".ingresar");
const articleAñadirTarjeta = document.querySelector(".alta");

/* creando la base de datos y verificando que todo salga bien */

const solicitudBD = indexedDB.open("puntosTarjetas", 1);

solicitudBD.addEventListener("upgradeneeded", (e)=> {
	let bd = solicitudBD.result;
	bd.createObjectStore("tarjetas", {keypath: "id"});
})

solicitudBD.addEventListener("error", (e)=> {
	console.log(`Ocurrio un error: ${e}`);
})

solicitudBD.addEventListener("success", ()=> {
	console.log("Base de Datos creada correctamente");
})

solicitudBD.addEventListener("versionchange", ()=> {
	let bd = solicitudBD.result;
	bd.close();
	alert("Base de Datos cerrada, por favor recargue la pagina")
})

/* checando si ocurrio un error en la subida de datos */
const respuesta = document.querySelector(".respuesta");

if (localStorage.getItem("OkEliminar")) {
	localStorage.clear();
	respuesta.classList.remove("ocultar");
	respuesta.textContent = "Tarjeta eliminada correctamente";
	respuesta.classList.add("exitoso");

}else if (localStorage.getItem("OkActualizar")) {
	localStorage.clear();
	respuesta.classList.remove("ocultar");
	respuesta.textContent = "Puntos actualizados correctamente";
	respuesta.classList.add("exitoso");

}else if (localStorage.getItem("OkAgregar")) {
	localStorage.clear();
	respuesta.classList.remove("ocultar");
	respuesta.textContent = "Tarjeta agregada correctamente";
	respuesta.classList.add("exitoso");
	
}else if (localStorage.getItem("FalloEliminar")) {
	localStorage.clear();
	respuesta.classList.remove("ocultar");
	respuesta.textContent = "No existe esa tarjeta";
	respuesta.classList.add("fallo");

}else if (localStorage.getItem("FalloActualizar")) {
	localStorage.clear();
	respuesta.classList.remove("ocultar");
	respuesta.textContent = "No existe esa tarjeta o no tienes buena conexión";
	respuesta.classList.add("fallo");

}else if (localStorage.getItem("FalloAgregar")) {
	localStorage.clear();
	respuesta.classList.remove("ocultar");
	respuesta.textContent = "Ya existe esa tarjeta o no tienes conexión";
	respuesta.classList.add("fallo");
}

/* creando las listas en base a las tarjetas que esten en la base de datos */
const actualizarDatos = () => {
	let datos = [];

	let bd = solicitudBD.result;
	let transaccion = bd.transaction("tarjetas");
	let almacenTarjetas = transaccion.objectStore("tarjetas");
	let solicitud = almacenTarjetas.openCursor();

	solicitud.addEventListener("success", ()=> {
		let cursor = solicitud.result;

		if (cursor) {
			let clave = cursor.key;
			let valor = cursor.value;
			let arr = [clave,valor];

			datos.push(arr);
			cursor.continue();
		}else {
			let listaTarjetas = document.querySelector(".listaTarjetas");

			if (datos.length == 0) {
				let fragmento = document.createDocumentFragment();
				let li = document.createElement("LI");

				li.textContent = "Aqui podras ver tus tarjetas agregadas y cuanto te falta para alcanzar tu meta";
				li.classList.add("informacionTarjetasAcumuladas");

				fragmento.appendChild(li);
				listaTarjetas.appendChild(li);
				return 0;
			}

			for (let valor of datos) {
				let fragmento = document.createDocumentFragment();
				let li = document.createElement("LI");
				let figure = document.createElement("FIGURE");
				let img = document.createElement("IMG");
				let figcaption = document.createElement("FIGCAPTION");
				let p = document.createElement("P");

				if (valor[0].startsWith("3")) {
					img.setAttribute("src", "americanExpress.png")

				}else if (valor[0].startsWith("4")) {
					img.setAttribute("src", "visa.png");

				}else if (valor[0].startsWith("5")){
					img.setAttribute("src", "mastercard.png");

				}else if (valor[0].startsWith("6")){
					img.setAttribute("src", "discoverCard.png");
				}else {
					img.setAttribute("src", "desconocida.png");
				}

				img.setAttribute("alt", "tarjeta");

				figcaption.textContent = `Num. Tarjeta: ${valor[0]}`;

				let numeroRecaudado = new Intl.NumberFormat("es-MX").format(valor[1].recaudado);
				let numeroMeta = new Intl.NumberFormat("es-MX").format(valor[1].meta);

				p.textContent = `Total acumulado: $${numeroRecaudado} / $${numeroMeta}`;
				p.classList.add("totalAcumulado");

				figure.appendChild(img);
				figure.appendChild(figcaption);

				li.appendChild(figure);
				li.appendChild(p);

				fragmento.appendChild(li);

				listaTarjetas.appendChild(fragmento);
			}
		}

	})

}

/* ------------------------------------------------------------- */
botonEliminar.addEventListener("click", ()=> {
	articleEliminar.classList.remove("ocultar")
	articleAcumulado.classList.add("ocultar");
	articleIngresarMonto.classList.add("ocultar");
	articleAñadirTarjeta.classList.add("ocultar");
	respuesta.classList.add("ocultar");
})

botonAcumulado.addEventListener("click", ()=> {
	articleAcumulado.classList.remove("ocultar");
	articleEliminar.classList.add("ocultar");
	articleIngresarMonto.classList.add("ocultar");
	articleAñadirTarjeta.classList.add("ocultar");
	respuesta.classList.add("ocultar");

	let listaTarjetas = document.querySelector(".listaTarjetas");
	let listas = listaTarjetas.getElementsByTagName("li");

	if (listas.length > 0) {
		listas.forEach(t => {
			t.remove();
		})
	}

	actualizarDatos();
})

botonIngresarMonto.addEventListener("click", ()=> {
	articleIngresarMonto.classList.remove("ocultar");
	articleEliminar.classList.add("ocultar");
	articleAcumulado.classList.add("ocultar");
	articleAñadirTarjeta.classList.add("ocultar");
	respuesta.classList.add("ocultar");
})

botonAñadirTarjeta.addEventListener("click", ()=> {
	articleAñadirTarjeta.classList.remove("ocultar");
	articleIngresarMonto.classList.add("ocultar");
	articleEliminar.classList.add("ocultar")
	articleAcumulado.classList.add("ocultar");
	respuesta.classList.add("ocultar");
})

/* creando los eventos ara añadir y actualizar los datos de las tajetas */

const calculoPuntos = (monto, porcentajePorCompra, puntosPorPeso) => {
	return (((porcentajePorCompra * monto) / 100) / puntosPorPeso);
}

const botonEliminarTarjeta = document.querySelector(".botonEliminarTarjeta");
const botonNuevoMonto = document.querySelector(".botonNuevoMonto");
const botonNuevaTarjeta = document.querySelector(".botonNuevaTarjeta");

botonEliminarTarjeta.addEventListener("click", ()=> {
	localStorage.clear();
	localStorage.setItem("FalloEliminar", "Ocurrio un error");
	const tarjeta = document.querySelector(".tarjetaEliminar").value;

	let bd = solicitudBD.result;
	let transaccion = bd.transaction("tarjetas", "readwrite");
	let almacenTarjetas = transaccion.objectStore("tarjetas");

	let solicitud = almacenTarjetas.get(tarjeta);

	solicitud.addEventListener("success", ()=> {
		const valores = solicitud.result;

		if(valores.meta != undefined) {
			localStorage.clear();
			localStorage.setItem("OkEliminar", "Todo bien");

			almacenTarjetas.delete(tarjeta);
		}
	})
})

botonNuevoMonto.addEventListener("click", ()=> {
	localStorage.clear();
	localStorage.setItem("FalloActualizar", "Ocurrio un error");

	const tarjeta = document.querySelector(".numeroTarjeta").value;
	const monto = document.querySelector(".nuevoMonto").value;

	let bd = solicitudBD.result;
	let transaccion = bd.transaction("tarjetas", "readwrite");
	let almacenTarjetas = transaccion.objectStore("tarjetas");

	let informacion = almacenTarjetas.get(tarjeta);

	informacion.addEventListener("success", ()=> {
		const info = informacion.result;

		const meta = info.meta;
		const porcentajePorCompra = info.porcentajePorCompra;
		const puntosPorPeso = info.puntosPorPeso;

		const valorFinal = calculoPuntos(monto, porcentajePorCompra, puntosPorPeso);
		let recaudado = info.recaudado + valorFinal;

		let nuevoObj = {meta, porcentajePorCompra, puntosPorPeso, recaudado};
		almacenTarjetas.put(nuevoObj, tarjeta);

		localStorage.clear();
		localStorage.setItem("OkActualizar", "Monto actualizado correctamente");
	})
})

botonNuevaTarjeta.addEventListener("click", (e)=> {
	localStorage.clear();
	localStorage.setItem("FalloAgregar", "Ocurrio un fallo");

	const numeroTarjeta = document.querySelector(".numeroNuevaTarjeta").value;
	const meta = document.querySelector(".metaTarjeta").value;
	const porcentajePorCompra = document.querySelector(".porcentajeCompra").value;
	const puntosPorPeso = document.querySelector(".puntosPorPeso").value;

	let bd = solicitudBD.result;
	let transaccion = bd.transaction("tarjetas", "readwrite"); 
	let almacenTarjetas = transaccion.objectStore("tarjetas");

	let recaudado = 0;

	const informacion = {recaudado, meta, porcentajePorCompra, puntosPorPeso};

								/* add(valor, clave) */
	let alta = almacenTarjetas.add(informacion, numeroTarjeta);

	alta.addEventListener("success", ()=> {
		console.log("Tarjeta añadida correctamente");

		localStorage.clear();
		localStorage.setItem("OkAgregar", "Todo bien");
	})
})