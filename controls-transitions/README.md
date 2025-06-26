# What is this?

This is a minimal example of how to create and wire up controls that allow a user to switch between views of data in a d3 visualization.

It allows users to switch between three views of responses to a question -- dems only, reps only and both.

All kinds of features we would want in production are not included.  For instance, the buttons do not change appearance to indicate which option is currently selected.  Instead, the example focuses exclusively on the mechanics of creating three different views of the data in d3, and then using d3's methods to listen for button clicks and transition between the views in response. 