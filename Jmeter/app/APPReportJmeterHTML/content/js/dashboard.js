/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 52.59090909090909, "KoPercent": 47.40909090909091};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23977272727272728, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.485, 500, 1500, "GET/buyer/order "], "isController": false}, {"data": [0.5625, 500, 1500, "GET/buyer/order/{id}"], "isController": false}, {"data": [0.06, 500, 1500, "GET/seller/product"], "isController": false}, {"data": [0.0, 500, 1500, "POST/buyer/order"], "isController": false}, {"data": [0.0, 500, 1500, "POST/auth/register"], "isController": false}, {"data": [0.7525, 500, 1500, "GET/buyer/product/{id}"], "isController": false}, {"data": [0.0, 500, 1500, "GET/seller/product/{id}"], "isController": false}, {"data": [0.0, 500, 1500, "POST/seller/product"], "isController": false}, {"data": [0.33, 500, 1500, "PUT /buyer/order/{id}"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE/seller/product/{id} "], "isController": false}, {"data": [0.4475, 500, 1500, "POST/auth/login "], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 1043, 47.40909090909091, 1411.4872727272716, 11, 11876, 936.5, 2990.900000000001, 4276.95, 7016.939999999999, 13.281575436329938, 10.964757650866623, 30.88461518144443], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET/buyer/order ", 200, 10, 5.0, 815.7950000000001, 12, 8475, 633.5, 1262.8000000000002, 1984.2499999999975, 6003.260000000018, 1.3134477346310198, 2.579052109397062, 0.44251901215595885], "isController": false}, {"data": ["GET/buyer/order/{id}", 200, 10, 5.0, 705.7299999999999, 11, 4496, 584.0, 1284.5000000000005, 1538.0, 2560.740000000003, 1.3174015571686406, 1.497836682552334, 0.45157026031854774], "isController": false}, {"data": ["GET/seller/product", 200, 9, 4.5, 2903.9550000000004, 12, 8765, 2582.0, 5937.900000000001, 6173.5999999999985, 8716.700000000003, 1.2552091178390319, 3.001255258149445, 0.4265749736406085], "isController": false}, {"data": ["POST/buyer/order", 200, 200, 100.0, 1490.2249999999995, 11, 8186, 998.0, 2558.3000000000015, 6023.5, 7987.5300000000025, 1.3083953185615502, 0.42669786780627894, 0.5315355981656298], "isController": false}, {"data": ["POST/auth/register", 200, 185, 92.5, 899.8900000000001, 11, 3849, 597.5, 1991.4, 2189.85, 3073.820000000001, 1.2627139510950887, 0.43411957664358003, 0.7287733838839818], "isController": false}, {"data": ["GET/buyer/product/{id}", 200, 10, 5.0, 633.835, 12, 4475, 328.5, 1452.300000000001, 2823.1, 4276.99, 1.3093461125513919, 1.0999658137913426, 0.45136638450257943], "isController": false}, {"data": ["GET/seller/product/{id}", 200, 200, 100.0, 1668.9249999999997, 11, 7030, 1310.5, 3251.3, 4279.099999999996, 5759.98, 1.2871089602090267, 0.4160604852722557, 0.44495758975976113], "isController": false}, {"data": ["POST/seller/product", 200, 200, 100.0, 2062.4049999999993, 29, 6264, 1929.0, 3475.4000000000015, 5267.849999999999, 5791.6900000000005, 1.2554060924857668, 0.39666664182008776, 27.286692773882532], "isController": false}, {"data": ["PUT /buyer/order/{id}", 200, 10, 5.0, 2003.3500000000004, 13, 11876, 1154.0, 4170.9, 8042.449999999989, 11750.02000000001, 1.3180700817862485, 0.8370517326031225, 0.4762557912704219], "isController": false}, {"data": ["DELETE/seller/product/{id} ", 200, 200, 100.0, 1274.5199999999995, 14, 7011, 861.5, 2787.6, 3554.599999999999, 5475.020000000004, 1.3047250618113497, 0.42186959762279097, 0.47907873363385506], "isController": false}, {"data": ["POST/auth/login ", 200, 9, 4.5, 1067.7299999999996, 12, 5871, 834.0, 1954.4, 2162.95, 5717.670000000011, 1.2673628713373213, 0.6108342495310758, 0.5346687113454325], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 556, 53.307766059443914, 25.272727272727273], "isController": false}, {"data": ["502/Bad Gateway", 108, 10.354745925215724, 4.909090909090909], "isController": false}, {"data": ["404/Not Found", 379, 36.33748801534036, 17.227272727272727], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 1043, "400/Bad Request", 556, "404/Not Found", 379, "502/Bad Gateway", 108, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET/buyer/order ", 200, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET/buyer/order/{id}", 200, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET/seller/product", 200, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST/buyer/order", 200, 200, "400/Bad Request", 190, "502/Bad Gateway", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["POST/auth/register", 200, 185, "400/Bad Request", 175, "502/Bad Gateway", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["GET/buyer/product/{id}", 200, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET/seller/product/{id}", 200, 200, "404/Not Found", 189, "502/Bad Gateway", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["POST/seller/product", 200, 200, "400/Bad Request", 191, "502/Bad Gateway", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /buyer/order/{id}", 200, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["DELETE/seller/product/{id} ", 200, 200, "404/Not Found", 190, "502/Bad Gateway", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["POST/auth/login ", 200, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
