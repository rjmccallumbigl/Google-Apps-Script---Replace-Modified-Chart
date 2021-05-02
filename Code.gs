/*********************************************************************************************************
*
* Create and insert modified chart that graphs all true values as large red stars
*
* Instructions
* 1. Open Google Apps Script.
* 2. Delete all text in the scripting window and paste all this code.
* 3. Replace col1 and col2 with the actual columns you are graphing.
* 4. Run onOpen(). Accept the permissions.
* 5. Then run "Replace Modified Chart" from the spreadsheet or insertModifiedChart from the Script.
*
* Inspiration
* https://www.reddit.com/r/spreadsheets/comments/n284bh/how_can_i_place_booleansmarks_in_a_graph/
*
*********************************************************************************************************/

function insertModifiedChart() {

  // Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var dataRange = sheet.getDataRange();
  var dataRangeValues = dataRange.getDisplayValues();
  var col1 = 'A1:A8'; // Replace with number column (A1 notation)
  var col2 = 'B1:B8'; // Replace with checkmark/boolean column (A1 notation)
  var trueValues = [];
  var charts = sheet.getCharts();

  // Get true values
  for (var x = 0; x < dataRangeValues.length; x++) {
    for (var y = 0; y < dataRangeValues[0].length; y++) {
      if (dataRangeValues[x][y] == "TRUE") {
        trueValues.push(x - 1);
      }
    }
  }

  // Clear old chart(s)  
  for (var i in charts) {
    sheet.removeChart(charts[i]);
  }

  // Build new chart
  chart = sheet.newChart()
    .asLineChart()
    .addRange(spreadsheet.getRange(col2))
    .addRange(spreadsheet.getRange(col1))
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setTransposeRowsAndColumns(false)
    .setNumHeaders(1)
    .setHiddenDimensionStrategy(Charts.ChartHiddenDimensionStrategy.IGNORE_BOTH)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('isStacked', 'false')
    .setOption('title', dataRangeValues[0][0] + ' vs. ' + dataRangeValues[0][1])
    .setXAxisTitle(dataRangeValues[0][1])
    .setYAxisTitle(dataRangeValues[0][0])
    .setOption('series.0.pointSize', 2)
    .setPosition(7, 5, 16, 15);

  // Morph true values to be red stars and larger than the other points
  for (var z = 0; z < trueValues.length; z++) {
    chart.setOption('series.0.items.' + trueValues[z] + '.point.size', 21);
    chart.setOption('series.0.items.' + trueValues[z] + '.point.shape', 'star');
    chart.setOption('series.0.items.' + trueValues[z] + '.color', 'red');
  }

  // Build and insert chart
  chart = chart.build();
  sheet.insertChart(chart);
}

/*********************************************************************************************************
*
* Create Google Sheet menu allowing script to be run from the spreadsheet.
*
*********************************************************************************************************/

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Functions')
    .addItem('Replace Modified Chart', 'insertModifiedChart')
    .addToUi();
}