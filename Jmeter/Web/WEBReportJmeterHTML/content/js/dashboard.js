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

    var data = {"OkPercent": 95.83333333333333, "KoPercent": 4.166666666666667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.473125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6675, 500, 1500, "POST /offers.json-0"], "isController": false}, {"data": [0.195, 500, 1500, "DELETE /products/{id}.json "], "isController": false}, {"data": [0.6075, 500, 1500, "GET /products.json"], "isController": false}, {"data": [0.63, 500, 1500, "GET /users/{user_id}/offers.json "], "isController": false}, {"data": [0.245, 500, 1500, "POST /products.json "], "isController": false}, {"data": [0.5, 500, 1500, "POST /offers.json-1"], "isController": false}, {"data": [0.1725, 500, 1500, "GET /products/{id}.json"], "isController": false}, {"data": [0.6575, 500, 1500, "PUT /offers/{id}.json -0"], "isController": false}, {"data": [0.5025, 500, 1500, "PUT /offers/{id}.json -1"], "isController": false}, {"data": [0.64, 500, 1500, "GET /products/{id}.json-0"], "isController": false}, {"data": [0.51, 500, 1500, "GET /products/{id}.json-1"], "isController": false}, {"data": [0.68, 500, 1500, "GET /categories/{id}.json "], "isController": false}, {"data": [0.4475, 500, 1500, "PUT /profiles.json "], "isController": false}, {"data": [0.6425, 500, 1500, "PUT /products/{id}.json -0"], "isController": false}, {"data": [0.51, 500, 1500, "PUT /products/{id}.json -1"], "isController": false}, {"data": [0.5125, 500, 1500, "DELETE /products/{id}.json -1"], "isController": false}, {"data": [0.2525, 500, 1500, "POST /offers.json"], "isController": false}, {"data": [0.2225, 500, 1500, "PUT /offers/{id}.json "], "isController": false}, {"data": [0.5675, 500, 1500, "POST login"], "isController": false}, {"data": [0.1875, 500, 1500, "PUT /products/{id}.json "], "isController": false}, {"data": [0.6775, 500, 1500, "DELETE /products/{id}.json -0"], "isController": false}, {"data": [0.665, 500, 1500, "GET /categories.json "], "isController": false}, {"data": [0.0, 500, 1500, "POST /users.json"], "isController": false}, {"data": [0.6625, 500, 1500, "GET /profiles.json"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4800, 200, 4.166666666666667, 979.6591666666661, 30, 5131, 872.5, 1654.0, 1821.0, 2457.809999999996, 29.70719842551848, 218.87539977069756, 417.9824214035723], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /offers.json-0", 200, 0, 0.0, 583.5250000000001, 174, 1174, 578.0, 868.4000000000001, 947.9499999999998, 1154.6800000000003, 1.327606922142492, 1.7204178061959416, 1.1098093763898385], "isController": false}, {"data": ["DELETE /products/{id}.json ", 200, 0, 0.0, 1524.185, 366, 2215, 1560.5, 1846.9, 1950.85, 2061.4100000000008, 1.3375600230060325, 21.635039903177372, 1.9943751421157523], "isController": false}, {"data": ["GET /products.json", 200, 0, 0.0, 649.0949999999998, 131, 1161, 649.0, 927.4000000000001, 1010.8499999999999, 1145.8200000000002, 1.335247187635611, 1.780586027472711, 1.0721487256734654], "isController": false}, {"data": ["GET /users/{user_id}/offers.json ", 200, 0, 0.0, 639.0849999999996, 210, 1181, 619.5, 895.7, 973.2499999999998, 1138.98, 1.3258994570441724, 1.7665538547211963, 0.9935182162011654], "isController": false}, {"data": ["POST /products.json ", 200, 0, 0.0, 1696.8600000000004, 890, 5131, 1530.0, 2574.3, 3192.6999999999994, 4607.420000000004, 1.3253107853791712, 3.0832242367866516, 210.3511017474223], "isController": false}, {"data": ["POST /offers.json-1", 200, 0, 0.0, 926.6999999999997, 498, 1531, 925.0, 1198.6, 1300.9999999999998, 1490.96, 1.324863042283004, 20.50704915117681, 0.9470441891506965], "isController": false}, {"data": ["GET /products/{id}.json", 200, 0, 0.0, 1567.8550000000007, 357, 2321, 1595.0, 1906.3, 2012.85, 2207.6000000000013, 1.3334311182820073, 21.567245660515105, 1.9611594433591797], "isController": false}, {"data": ["PUT /offers/{id}.json -0", 200, 0, 0.0, 593.1949999999994, 204, 1225, 581.0, 845.3000000000001, 889.9, 987.97, 1.3315845189983821, 1.742269111566809, 1.0745262888073663], "isController": false}, {"data": ["PUT /offers/{id}.json -1", 200, 0, 0.0, 949.6350000000001, 419, 1952, 946.5, 1200.7, 1267.9, 1455.2700000000007, 1.3276774274922165, 20.54978214680461, 0.9657038101022974], "isController": false}, {"data": ["GET /products/{id}.json-0", 200, 0, 0.0, 612.8549999999996, 86, 1196, 607.5, 887.4000000000001, 959.8499999999999, 1097.88, 1.3358447214095834, 0.928829532855101, 0.9947477298988766], "isController": false}, {"data": ["GET /products/{id}.json-1", 200, 0, 0.0, 954.8649999999998, 251, 1533, 970.0, 1222.7, 1339.0499999999995, 1523.1400000000008, 1.3345700348990064, 20.65772355299244, 0.9690359941879476], "isController": false}, {"data": ["GET /categories/{id}.json ", 200, 0, 0.0, 577.3399999999998, 144, 1087, 583.0, 838.8000000000001, 902.75, 1078.1300000000008, 1.323311454583951, 0.9420840335856447, 0.9679428833964112], "isController": false}, {"data": ["PUT /profiles.json ", 200, 0, 0.0, 1115.3200000000004, 245, 2225, 1075.0, 1600.2, 1764.9, 2203.6400000000003, 1.342011675501577, 2.1618969335033213, 212.73795806632893], "isController": false}, {"data": ["PUT /products/{id}.json -0", 200, 0, 0.0, 616.2200000000001, 119, 1135, 602.5, 877.8, 916.55, 1057.97, 1.3361124472235584, 0.9290156859601305, 1.0201949221046445], "isController": false}, {"data": ["PUT /products/{id}.json -1", 200, 0, 0.0, 951.3600000000002, 230, 1451, 926.0, 1268.3000000000002, 1337.0, 1432.97, 1.3352204448954523, 20.66468134338198, 0.9699646333484657], "isController": false}, {"data": ["DELETE /products/{id}.json -1", 200, 0, 0.0, 938.2199999999996, 253, 1518, 931.5, 1208.0, 1303.75, 1469.5800000000004, 1.341156747694887, 20.760693891450124, 0.9730196982397318], "isController": false}, {"data": ["POST /offers.json", 200, 0, 0.0, 1510.4499999999998, 735, 2342, 1499.0, 1834.5, 1944.9, 2232.680000000001, 1.3227863170983358, 22.1890752008155, 2.051339300477526], "isController": false}, {"data": ["PUT /offers/{id}.json ", 200, 0, 0.0, 1543.0249999999999, 961, 2466, 1534.5, 1846.9, 1931.95, 2084.96, 1.3239859922282022, 22.2249731996273, 2.031413429520916], "isController": false}, {"data": ["POST login", 200, 0, 0.0, 863.7900000000002, 161, 3401, 668.5, 1947.900000000005, 3098.95, 3316.95, 1.2921482610914776, 2.6898387883525756, 1.0317501017566755], "isController": false}, {"data": ["PUT /products/{id}.json ", 200, 0, 0.0, 1567.7049999999986, 349, 2328, 1583.0, 1908.1000000000001, 1983.6, 2253.830000000001, 1.334062620899425, 21.57435257315666, 1.9877533051401433], "isController": false}, {"data": ["DELETE /products/{id}.json -0", 200, 0, 0.0, 585.8449999999998, 101, 1132, 588.5, 861.9, 927.2999999999998, 1126.4600000000005, 1.3398270283306426, 0.9315984806361499, 1.02570039457906], "isController": false}, {"data": ["GET /categories.json ", 200, 0, 0.0, 631.6299999999998, 164, 2580, 577.0, 893.3000000000001, 1055.1499999999999, 2271.4000000000015, 1.3057898722937507, 1.3644484017131964, 0.9525762622091354], "isController": false}, {"data": ["POST /users.json", 200, 200, 100.0, 1324.3449999999998, 689, 3174, 1274.0, 1615.6, 1895.7999999999993, 3070.3400000000033, 1.2923904052936313, 0.7862883032206368, 1.0571854483302314], "isController": false}, {"data": ["GET /profiles.json", 200, 0, 0.0, 588.7150000000001, 30, 1188, 612.5, 854.4000000000001, 906.6499999999999, 1080.6600000000003, 1.3557943260007457, 2.1853444988645223, 1.0008383681320545], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 200, 100.0, 4.166666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4800, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST /users.json", 200, 200, "401/Unauthorized", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
