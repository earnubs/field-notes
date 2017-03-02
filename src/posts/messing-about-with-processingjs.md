---
title: Visualising NINIS Data
draft: true
publishedDate: 2009-10-08T14:48
---
I was messing about with Processing.js, NI postcodes from <a href="http://www.nisra.gov.uk/">NISRA</a> and some <a href="http://www.ninis.nisra.gov.uk/">NINIS</a> data, nothing terribly exciting but I thought some sketches looked cool so I'm posting them here now.

<p><img src=/media/visual/figure-sketch.gif width=778 height=405 alt="postcodes of northern ireland joined to each other with a line">

Figure 1. is simply a join the dots exercise, each postcode in Northern Ireland is joined sequentially to the next one in alphanumeric order (BT1 1AA <i>to</i> BT1AB). I think it looks pretty, not sure it tells you much other than maybe Belfast ran out of its first allocation of BT's ages ago. The real thing is available <a href="http://carisenda.com/sandbox/processing/join/">here</a>, WARNING: it won't work in IE and it might slow down your browser a bit.

<p><img src=/media/visual/figure-hospitals.gif width=778 height=405 alt="postcodes of northern ireland coloured by distance from hospital">

. each postcode is coloured by its distance (straight line) to the nearest hospital, red is near, blue is far. The real thing is available <a href="http://carisenda.com/sandbox/processing/hospital/">here</a>, WARNING: it won't work in IE and it might slow down your browser a bit. Distance calculations were done by PostGIS, I wrote a Perl script to convert Irish Grid x,y to lat/lon and then find the distance to the nearest hospital for each BT.

Both examples are rendered in browser using the Canvas tag from HTML5 and Processing.js/JavaScript.

NINIS and NISRA both deserve praise for making all this data available, both are excellent resources.
