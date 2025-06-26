# What is this?

This is an minimal setup for a project.

# Setting things up

## Change class name of the svg frame if you want

The `body` of "index.html" has only one element:
```
<div class="svg-frame">
</div>
```

You're meant to insert your svg into that div.  If you want to change the class name of that div, note that you'll need to change the your new class name in "styles/styles.css" and "scripts/script.js".

## Change breakpoints and svg frame widths and heights if you want

In "styles/styles.css"...

+ Things are set up with only one media breakpoint: `min-width: 1024px`.  You might want change that breakpoint, and/or add additional breakpoints.

+ Width:height for the svg frame is set to 310px:175px for small screens and 1000px:560px for large screens.  You might want to change those.

## Change `dataURL` in "scripts/script.js"

The first thing "scripts/script.js" does is load data.  It grabs it over the wire, from the url stored in `dataURL`.  Obviously, you're going to want to change that to url to the location of whatever data you're building with.

## Change the margins for the main plot area if you want

These are set on line 23 of "scripts/script.js"