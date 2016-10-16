var chart = {}

var makeSettings = function(data) {

	var singleW = 10
	var singleH = 300
	
	var margin = {
		'top' : 20,
		'right' : 20,
		'bottom' : 20,
		'left' : 20
	}

	var chartW = margin.left + margin.right + (data.length * singleW)
	var chartH = margin.top + margin.bottom + singleH

	return {
		'singleH' : singleH,
		'singleW' : singleW,
		'margin' : margin,
		'chartH' : chartH,
		'chartW' : chartW
	}

}

chart.initialize = function(options) {

	var settings = makeSettings(options.data)

	var shell = d3.select(options.chartBody)
		.append('svg')
		.attr('width', settings.chartW)
		.attr('height', settings.chartH)

}