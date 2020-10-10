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
    var nuoviPositivi=[];
    var decessi=[];
    var average1=[];
    var totaleTamponi=[];
    var deltaTamponi=[];
    var newCase_Tamponi=[];
    var totale_ospedalizzati=[];
    var terapia_intensiva=[];
    var d = [];
    const averageDepth = 7;
    //var x = regionSelector.selectedIndex;
    var latestUpdate;
    var count=0;
    var lastTamponi=0;

    els.forEach(el => {
       
        if (el.denominazione_regione == region) {
            casi.push(el.totale_casi);
            d.push(el.data);
            activecase.push(el.totale_positivi);
            latestUpdate=el.data;
            nuoviPositivi.push(el.nuovi_positivi);
            decessi.push(el.deceduti);
            totaleTamponi.push(el.tamponi);
            deltaTamponi.push(el.tamponi-lastTamponi);
            newCase_Tamponi.push(el.nuovi_positivi/(el.tamponi-lastTamponi));
            totale_ospedalizzati.push(el.totale_ospedalizzati);
            terapia_intensiva.push(el.terapia_intensiva);
            lastTamponi=el.tamponi;
            if (count<averageDepth)
            {
                LowerBound=0;
            }
            else
            {
            LowerBound=count-averageDepth;
                }
                sum=0;

            for (i=LowerBound;i<count;i++){
                sum+=(nuoviPositivi[i]/averageDepth);
            }
            average1.push(sum);

            count++;
        }
        
    });
    var nuoviPositiviLastWeek=0;
        for (i=0;i<7;i++)
        {
            nuoviPositiviLastWeek+=nuoviPositivi[nuoviPositivi.length-i-1];
        }

    var KPITamponi=0;
        for (i=0;i<averageDepth;i++)
        {
            KPITamponi+=deltaTamponi[deltaTamponi.length-i-1]/averageDepth;
        }
    var KPIpositivitamponi=0;
        for (i=0;i<averageDepth;i++)
        {
            KPIpositivitamponi+=newCase_Tamponi[newCase_Tamponi.length-i-1]/averageDepth;
        }

    let KPIDiv=document.getElementById('KPI')
    KPIDiv.innerHTML=`<h3>KPI ${region}</h3>
                        <p>Tamponi/giorno: ${KPITamponi.toFixed(0)}</p>
                        <p>Positivi/Tampone: ${(KPIpositivitamponi*100).toFixed(1)}%</p>`


    
    var totalCases = {
        x: d,
        y: casi,
        type: 'scatter'
    };
    var traceActiveCase = {
        x: d,
        y: activecase,
        type: 'scatter',
        name: 'Active Case'
    };

    var traceOspedalizzati = {
        x:d,
        y:totale_ospedalizzati,
        type:'scatter',
        name:'Ricoverati'
    };

    var traceTerapiaIntensiva={
        x:d,
        y:terapia_intensiva,
        type:'scatter',
        name:'Terapia Intensiva'
    };

    var trace3={
        x:d,
        y:nuoviPositivi,
        type: 'scatter'
    };

    var trace4={
        x:d,
        y:decessi,
        type:'scatter'
    };

    var newPositiveAverage={
        x:d,
        y:average1,
        type:'scatter'
    };

    var traceTotTamponi={
        x:d,
        y:totaleTamponi,
        type:'scatter'
    };

    var traceDeltaTamponi={
        x:d,
        y:deltaTamponi,
        type:'scatter'
    };

    var traceNewCaseTamponi={
        x:d,
        y:newCase_Tamponi,
        type:'scatter'
    };

    var data = [totalCases];
    var data2 = [traceActiveCase,traceOspedalizzati,traceTerapiaIntensiva];
    var data3=[trace3,newPositiveAverage];
    var data4=[trace4];
    var data5=[traceNewCaseTamponi];
    var data6=[traceDeltaTamponi];

    var layout = {
        title: `${latestUpdate} - Totale Casi ${region}`,
        showlegend: false
    };

    Plotly.newPlot('TotalCase', data, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Casi Attivi ${region}`;
    layout.showlegend=true;
    Plotly.newPlot('ActiveCase', data2, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Nuovi Positivi ${region}`;
    layout.showlegend=false;
    Plotly.newPlot('NewPositive',data3,layout,{scrollZoom: false});

    layout.title = `${latestUpdate} - Decessi ${region}`;
    Plotly.newPlot('Decessi',data4,layout,{scrollZoom: false});

    layout.title = `${latestUpdate} - Positivi/Tamponi ${region}`;
    Plotly.newPlot('Tamponi',data5,layout,{scrollZoom: false});

    layout.title = `${latestUpdate} - Tamponi/giorno ${region}`;
    Plotly.newPlot('Tamponi_day',data6,layout,{scrollZoom: false});

}