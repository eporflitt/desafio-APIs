let graficoActual = null; // Variable para almacenar el gráfico actual

document.getElementById('convertir').addEventListener('click', async () => {
    const cantidad = document.getElementById('cantidad').value;
    const monedaSeleccionada = document.getElementById('moneda').value;
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    
    try {
        // Obtener datos de la API
        const respuesta = await fetch('https://mindicador.cl/api');
        if (!respuesta.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        
        const data = await respuesta.json();
        const valorMoneda = data[monedaSeleccionada].valor;

        // Realizar la conversión
        const resultado = (cantidad / valorMoneda).toFixed(2);
        resultadoDiv.innerHTML = `Resultado: ${cantidad} CLP son ${resultado} ${monedaSeleccionada === 'dolar' ? 'USD' : monedaSeleccionada === 'euro' ? 'EUR' : monedaSeleccionada === 'uf' ? 'UF' : 'Bitcoin'}`;
        
        // Obtener historial de los últimos 10 días para la moneda seleccionada
        const historial = data[monedaSeleccionada].serie.slice(0, 10); // Últimos 10 días
        const fechas = historial.map(item => new Date(item.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' }));
        const valores = historial.map(item => item.valor);

        // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
        if (graficoActual) {
            graficoActual.destroy();
        }

        // Crear gráfico con Chart.js
        const ctx = document.getElementById('graficoHistorial').getContext('2d');
        graficoActual = new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: `Historial últimos 10 días (${monedaSeleccionada})`,
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Días'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });

        errorDiv.innerHTML = ''; // Limpiar mensaje de error si la petición es exitosa
    } catch (error) {
        errorDiv.innerHTML = `Ocurrió un error: ${error.message}`;
    }
});
