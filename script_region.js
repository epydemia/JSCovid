let regionSelector = document.getElementById('region');

var regionalData = [];
var NationalData=[];
var regioni = [];
var ItalyPopulation=0;
//var demographicData=[];

var DatiDemograficiRegioni=[
    {
      "Regione": "Lombardia",
      "Popolazione": 10103969,
      "Superficie": 23863.65
    },
    {
      "Regione": "Lazio",
      "Popolazione": 5865544,
      "Superficie": 17232.29
    },
    {
      "Regione": "Campania",
      "Popolazione": 5785861,
      "Superficie": 13670.95
    },
    {
      "Regione": "Sicilia",
      "Popolazione": 4968410,
      "Superficie": 25832.39
    },
    {
      "Regione": "Veneto",
      "Popolazione": 4907704,
      "Superficie": 18345.35
    },
    {
      "Regione": "Emilia-Romagna",
      "Popolazione": 4467118,
      "Superficie": 22452.78
    },
    {
      "Regione": "Piemonte",
      "Popolazione": 4341375,
      "Superficie": 25387.07
    },
    {
      "Regione": "Puglia",
      "Popolazione": 4008296,
      "Superficie": 19540.9
    },
    {
      "Regione": "Toscana",
      "Popolazione": 3722729,
      "Superficie": 22987.04
    },
    {
      "Regione": "Calabria",
      "Popolazione": 1924701,
      "Superficie": 15221.9
    },
    {
      "Regione": "Sardegna",
      "Popolazione": 1630474,
      "Superficie": 24100.02
    },
    {
      "Regione": "Liguria",
      "Popolazione": 1543127,
      "Superficie": 5416.21
    },
    {
      "Regione": "Marche",
      "Popolazione": 1518400,
      "Superficie": 9401.38
    },
    {
      "Regione": "Abruzzo",
      "Popolazione": 1305770,
      "Superficie": 10831.84
    },
    {
      "Regione": "Friuli Venezia Giulia",
      "Popolazione": 1211357,
      "Superficie": 7924.36
    },
    {
      "Regione": "P.A. Trento",
      "Popolazione": 542739, 
      "Superficie": 13605.5 // Total of Trentino alto adige
    },
    {
        "Regione": "P.A. Bolzano",
        "Popolazione": 532080, 
        "Superficie": 13605.5 // Total of Trentino alto adige
    },
    {
      "Regione": "Umbria",
      "Popolazione": 880285,
      "Superficie": 8464.33
    },
    {
      "Regione": "Basilicata",
      "Popolazione": 556934,
      "Superficie": 10073.32
    },
    {
      "Regione": "Molise",
      "Popolazione": 302265,
      "Superficie": 4460.65
    },
    {
      "Regione": "Valle d'Aosta",
      "Popolazione": 125501,
      "Superficie": 3260.9
    }
   ];


// Populate the regions dropdown menu
var italyOpt=document.createElement('option');
italyOpt.text="Italy";
regionSelector.add(italyOpt);
fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json')
    .then(ret => ret.json())
    .then(regions => {
        regions.forEach(reg => {
            regioni.push(reg.denominazione_regione);
            var option = document.createElement('option');
            option.text = reg.denominazione_regione;
            regionSelector.add(option);
            var pop=GetDemographicData(reg.denominazione_regione);
            if (pop==0)
            {
                console.log(reg.denominazione_regione);
            }
            
        })
    }


    );

    for (i=0;i<DatiDemograficiRegioni.length;i++)
    {
        ItalyPopulation+=DatiDemograficiRegioni[i].Popolazione;
    }





// Load COVID-19 data
fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
    .then(ret => ret.json())
    .then(x => {
        regionalData = x;
        //Plotdiagrams('Abruzzo',regionalData);
    });

    fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json')
    .then(ret => ret.json())
    .then(x => { NationalData = x;
    Plotdiagrams('Italy',NationalData,ItalyPopulation);
 });

 // Bind events to selector and initialize webpage
regionSelector.addEventListener("change", evt => {
    regione = regionSelector.options[regionSelector.selectedIndex].text;
    if (regione=="Italy")
    {
        Plotdiagrams('Italy',NationalData,ItalyPopulation);
    }
    else
    {
        Plotdiagrams(regione,regionalData,GetDemographicData(regione));
    }
});

function Plotdiagrams(region,els,totalPopulation) {
    var casi = [];
    var activecase = [];
    var nuoviPositivi = [];
    var decessi = [];
    var deltaDecessi=[];
    var recovered=[];
    var closedCase=[];
    var deathRate=[];

    var totaleTamponi = [];
    var deltaTamponi = [];
    var newCase_Tamponi = [];
    var totale_ospedalizzati = [];
    var terapia_intensiva = [];
    var d = [];
    const averageDepth = 7;
    //var x = regionSelector.selectedIndex;
    var latestUpdate;

    var lastTamponi = 0;
    var lastDecessi=0;

    var MaxHostpital = 0;
    var MaxIntensive = 0;
    var dateMaxHospital="Never";
    var dataMaxIntensive="Never";

    els.forEach(el => {

        if ((el.denominazione_regione == region) | (region=="Italy")) {
            

            // Process Date
            d.push(el.data);
            latestUpdate = el.data;
            activecase.push(el.totale_positivi);
           
            // Process Total Case
            casi.push(el.totale_casi);

            // Process New Cases
            nuoviPositivi.push(el.nuovi_positivi);

            // Process death
            decessi.push(el.deceduti);
            deltaDecessi.push(el.deceduti-lastDecessi);
            lastDecessi=el.deceduti;

            // Process Recovered
            var currentClosedCase=el.totale_case-el.totale_positivi;
            var currentRecovered=currentClosedCase-el.deceduti;
            deathRate.push(el.deceduti/currentClosedCase);
            
            // Process Tamponi
            totaleTamponi.push(el.tamponi);
            deltaTamponi.push(el.tamponi - lastTamponi);
            
            if (el.tamponi - lastTamponi == 0) {

                newCase_Tamponi.push(0);


            }
            else {
                newCase_Tamponi.push(el.nuovi_positivi / (el.tamponi - lastTamponi));
            }

            lastTamponi = el.tamponi;

            // Process Hospital resource
            totale_ospedalizzati.push(el.totale_ospedalizzati);

            if (el.totale_ospedalizzati>=MaxHostpital)
            {
                MaxHostpital=el.totale_ospedalizzati;
                dateMaxHospital=el.data;
            }

            // Process Intensive Care
            terapia_intensiva.push(el.terapia_intensiva);

            if (el.terapia_intensiva>=MaxIntensive)
            {
                MaxIntensive=el.terapia_intensiva;
                dataMaxIntensive=el.data;
            }

        }

    });


    // Compute KPI
    var nuoviPositiviLastWeek = 0;
    for (i = 0; i < 7; i++) {
        nuoviPositiviLastWeek += nuoviPositivi[nuoviPositivi.length - i - 1];
    }

    var positivitamponiLastWeek=0;
	for (i=0;i<7;i++)
    {
		positivitamponiLastWeek+=newCase_Tamponi[nuoviPositivi.length-i-1]/7;
    }

    var KPITamponi = 0;
    for (i = 0; i < averageDepth; i++) {
        KPITamponi += deltaTamponi[deltaTamponi.length - i - 1] / averageDepth;
    }

    var KPIpositivitamponi = 0;
    for (i = 0; i < averageDepth; i++) {
        KPIpositivitamponi += newCase_Tamponi[newCase_Tamponi.length - i - 1] / averageDepth;
    }

    var KPIDeathRate=0;
    KPIDeathRate=decessi[decessi.length-1]/(casi[casi.length-1]-activecase[activecase.length-1])*100;

    var seriouscaseratio=0;
    for (i=0;i<7;i++)
    {
		seriouscaseratio+=(terapia_intensiva[nuoviPositivi.length-i-1]/totale_ospedalizzati[nuoviPositivi.length-i-1])/7;
    }

    let HistoryDiv=document.getElementById('HistoricalData');
    HistoryDiv.innerHTML=`<h3>Historical Data</h3>
                        <p>Total Death: ${decessi[decessi.length-1]}</p>
                        <p>Intensive care max: ${MaxIntensive} (${dataMaxIntensive})</p>
                        <p>Current intensive care: ${terapia_intensiva[nuoviPositivi.length-1]}</p>
                        <p>Hospital max: ${MaxHostpital} (${dateMaxHospital})</p>
                        <p>Current hospital: ${totale_ospedalizzati[nuoviPositivi.length-1]}</p>`;


    let KPIDiv = document.getElementById('KPI');
    KPIDiv.innerHTML = `<h3>KPI ${region}</h3>
                        <p>Population: ${totalPopulation}</p>
                        <p>New Cases in 7 days: ${nuoviPositiviLastWeek}</p>
                        <p>Incidence 7-days-cases/100k : ${(nuoviPositiviLastWeek/totalPopulation*100000).toFixed(1)}</p>
                        <p>Positive/Test: ${(positivitamponiLastWeek*100).toFixed(1)} %</p>
                        <p>Test/day: ${KPITamponi.toFixed(0)}</p>
                        <p>Hospital/Intensive Care ratio: ${(seriouscaseratio*100).toFixed(1)} %</p>
                        <p>Death Rate: ${KPIDeathRate.toFixed(1)} %</p>`;


    // Plot Diagrams
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
        x: d,
        y: totale_ospedalizzati,
        type: 'scatter',
        name: 'Ricoverati'
    };

    var traceTerapiaIntensiva = {
        x: d,
        y: terapia_intensiva,
        type: 'scatter',
        name: 'Terapia Intensiva'
    };

    var traceNuoviPositivi = {
        x: d,
        y: nuoviPositivi,
        type: 'scatter'
    };

    var traceDecessi = {
        x: d,
        //y: decessi,
        y:deltaDecessi,
        type: 'scatter'
    };

    var newPositiveAverage = {
        x: d,
        y:filterdata(nuoviPositivi,averageDepth),
        type: 'scatter'
    };

    var traceTotTamponi = {
        x: d,
        y: totaleTamponi,
        type: 'scatter'
    };

    var traceDeltaTamponi = {
        x: d,
        y: deltaTamponi,
        type: 'scatter'
    };

    var traceNewCaseTamponi = {
        x: d,
        y: newCase_Tamponi,
        type: 'scatter'
    };


    var data = [totalCases];
    var data2 = [traceActiveCase, traceOspedalizzati, traceTerapiaIntensiva];
    var data3 = [traceNuoviPositivi, newPositiveAverage];
    var data4 = [traceDecessi];
    var data5 = [traceNewCaseTamponi];
    var data6 = [traceDeltaTamponi];

    var layout = {
        title: `${latestUpdate} - Totale Casi ${region}`,
        showlegend: false
    };

    Plotly.newPlot('TotalCase', data, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Casi Attivi ${region}`;
    layout.showlegend = true;
    Plotly.newPlot('ActiveCase', data2, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Nuovi Positivi ${region}`;
    layout.showlegend = false;
    Plotly.newPlot('NewPositive', data3, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Decessi ${region}`;
    Plotly.newPlot('Decessi', data4, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Positivi/Tamponi ${region}`;
    Plotly.newPlot('Tamponi', data5, layout, { scrollZoom: false });

    layout.title = `${latestUpdate} - Tamponi/giorno ${region}`;
    Plotly.newPlot('Tamponi_day', data6, layout, { scrollZoom: false });

}

function filterdata(data, depth) {
    var average1 = [];
    for (n = 0; n < data.length; n++) {

        if (n < depth) {
            LowerBound = 0;
        }
        else {
            LowerBound = n - depth;
        }
        sum = 0;
        for (i = LowerBound; i < n; i++) {
            sum += (data[i] / depth);
        }
        average1.push(sum);
    }
    return average1;
}

function GetDemographicData(region)
{
    for (i=0;i<DatiDemograficiRegioni.length;i++)   
    {
        if (DatiDemograficiRegioni[i].Regione==region)
        {
            return DatiDemograficiRegioni[i].Popolazione;
        }
    }
    return 0;
}