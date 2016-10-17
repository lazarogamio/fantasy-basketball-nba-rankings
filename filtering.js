var filtering = {}

filtering.initialize = function(theChart) {
	
	d3.select('#rankings').on('change', function() {
		var theVal = d3.select(this).property('value')
		theChart.render({ 'x' : theVal, 'xLabel' : d3.select(this.options[this.selectedIndex]).text() })
	})

	d3.select('#stats').on('change', function() {
		var theVal = d3.select(this).property('value')
		theChart.render({ 'y' : theVal, 'yLabel' : d3.select(this.options[this.selectedIndex]).text() })
	})

	d3.select('#draft-pos').on('change', function() {
		var theVal = d3.select(this).property('value')
		theChart.render({ 'initialPick' : parseInt(theVal) })
	})

	d3.select('#draft-size').on('change', function() {
		var theVal = d3.select(this).property('value')
		console.debug(theVal)
		theChart.render({ 'leagueSize' : parseInt(theVal) })
	})

	d3.select('#draft-mode').on('change', function() {
		var theVal = d3.select(this).property('value')
		theChart.render({ 'draftMode' : theVal })
	})

}

