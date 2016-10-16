var filtering = {}

filtering.initialize = function(theChart) {
	
	d3.select('#rankings').on('change', function() {
		var theVal = d3.select(this).property('value')
		theChart.render({ 'x' : theVal })
	})

	d3.select('#stats').on('change', function() {
		var theVal = d3.select(this).property('value')
		theChart.render({ 'y' : theVal })
	})

}

