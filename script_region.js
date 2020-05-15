let regionSelector = document.getElementById('region');

var els = [];
var regioni=[];

// Populate the regions dropdown menu
fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json')
    .then(ret=>ret.json())
    .then(regions => {
        regions.forEach(reg=>{
        regioni.push(reg.denominazione_regione);
        var option = document.createElement('option');
        option.text=reg.denominazione_regione;
        regionSelector.add(option);
        })
    }
    

    );


fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
    .then(ret => ret.json())
    .then(x => { els = x;
    Plotdiagrams('Abruzzo')
 });


regionSelector.addEventListener("change", evt => {
    regione = regionSelector.options[regionSelector.selectedIndex].text;
    Plotdiagrams(regione);
});

function Plotdiagrams(region)
{
    var casi = [];
    var activecase = [];
	var average1=[];
    var d = [];
    //var x = regionSelector.selectedIndex;
    var latestUpdate;
	var count=0;
    els.forEach(el => {
       
        if (el.denominazione_regione == region) {
            casi.push(el.totale_casi);
            d.push(el.data);
            activecase.push(el.totale_positivi);
            latestUpdate=el.data;
        }
    })
    var trace1 = {
        x: d,
        y: casi,
        type: 'scatter'
    };
    var trace2 = {
        x: d,
        y: activecase,
        type: 'scatter'
    };

    var data = [trace1];
    var data2 = [trace2];
    var layout = {
        title: `${latestUpdate} - Totale Casi ${region}`,
        showlegend: false
    };

    Plotly.newPlot('TotalCase', data, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Casi Attivi ${region}`;
    Plotly.newPlot('ActiveCase', data2, layout, { scrollZoom: false })

}