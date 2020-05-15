let Graph = document.getElementById('TotalCase');
var casi=[];
var activecase=[];
var d=[];
fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json')
.then(ret=>ret.json())
.then(els => els.forEach(el=>{
    casi.push(el.totale_casi);
    d.push(el.data);
    activecase.push(el.totale_positivi);
    //Graph.innerHTML+=`<p>${el.data} - ${el.totale_casi}</p>`;
    var trace1 = {
        x:d,
        y: casi,
        type:'scatter'
    };
    var trace2={
        x:d,
        y:activecase,
        type:'scatter'
    }

    var data=[trace1];
    var data2=[trace2];
    var layout = {
        title: 'Totale Casi',
        showlegend: false
    };
    
    Plotly.newPlot('TotalCase',data,layout,{scrollZoom:false});

    layout.title='Casi Attivi';
    Plotly.newPlot('ActiveCase',data2,layout,{scrollZoom:false})
}));
    