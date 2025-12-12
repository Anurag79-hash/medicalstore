/* admin.js: load low-stock graph + simple list actions */

async function fetchLowStock(threshold=5){
  const res = await fetch(`/admin/low-stock?threshold=${threshold}`);
  return res.json();
}

async function drawLowStock(){
  const data = await fetchLowStock(5);
  const labels = data.map(d => d.name);
  const values = data.map(d => d.stock);
  const ctx = document.getElementById('lowStockChart').getContext('2d');
  // create Chart.js chart (assumes Chart.js included in template)
  if(window.lowStockChart) window.lowStockChart.destroy();
  window.lowStockChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Stock', data: values }] },
    options: { responsive:true, maintainAspectRatio:false }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('lowStockChart')) drawLowStock();
});
