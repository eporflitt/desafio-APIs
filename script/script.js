let graficoActual = null; 

document.getElementById('convertir').addEventListener('click', async () => {
    const cantidad = document.getElementById('cantidad').value;
    const monedaSeleccionada = document.getElementById('moneda').value;
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error');
    
    try {
        
        const respuesta = await fetch('https://mindicador.cl/api');
        if (!respuesta.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        
        const data = await respuesta.json();
        const valorMoneda = data[monedaSeleccionada].valor;

        
        const resultado = (cantidad / valorMoneda).toFixed(2);
        resultadoDiv.innerHTML = `Resultado: ${cantidad} CLP son ${resultado} ${monedaSeleccionada === 'dolar' ? 'USD' : monedaSeleccionada === 'euro' ? 'EUR' : monedaSeleccionada === 'uf' ? 'UF' : 'Bitcoin'}`;
        
        
        const historial = data[monedaSeleccionada].serie.slice(0, 10); 
        const fechas = historial.map(item => new Date(item.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' }));
        const valores = historial.map(item => item.valor);

        if (graficoActual) {
            graficoActual.destroy();
        }

        
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

        errorDiv.innerHTML = ''; 
    } catch (error) {
        errorDiv.innerHTML = `Ocurrió un error: ${error.message}`;
    }
});
