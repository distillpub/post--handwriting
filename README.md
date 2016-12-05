# post--handwriting

//multithreaded make
make -j 4

// command to build the pca.json
cat assets/validation/cells/0.json assets/validation/cells/1.json assets/validation/cells/2.json assets/validation/cells/3.json assets/validation/cells/4.json assets/validation/cells/5.json assets/validation/cells/6.json assets/validation/cells/7.json assets/validation/cells/8.json | bin/pca > assets/pca.json

// command to run tsne for sorting (copy the output into metadata.json's sortedOrder)
cat assets/validation/cells/0.json | bin/sort


##Feedback

- Fix coloring of hairs
- add dots to the prediction
- Add loading indicator to hairs.
- Add loading indicator to cells.
- Add loading indicator to predictions.
- Make footnote superscripts more visually prominent.

- for the visualizations that show each step for every cell, is there a way for me to step through it using either the arrow keys on the keyboard or clicking on the step label and dragging it left and right? i found myself trying to follow what's happening with cell 45, for example, but it is really hard to do...

- A visualization thought: you could easily fit 500 pieces of handwriting on a screen or two (10 columns x 50 rows is not so bad). If you showed 500 copies of the validation example, each one colored by the activation of one individual neuron, and arranged the grid in order of your 1D t-SNE, I bet it would make it very easy to see things like directionality, keeping track of the x-coordinate, etc.

- One thing I noticed about the overlays is that when the human handwriting is used as a baseline, the colors seem more uniform--a lot of blue followed by a lot of brown, rather than half blue/brown areas. I take this to mean that the human is way on one side or other of the learned distribution--in a sense, it's a way of visualizing how far off the human baseline is from the learned distribution. By contrast, when the machine is used as a baseline, you'd expect the baseline sample to generally be in the middle, and indeed I seem to see blue and brown mixed a lot.

##Completed
- Color key for figure-hairs diagrams.
- "Temperature" replaced with "variation" and sentence added to explain it more.
- Conclusion reworked to be less self-effacing.
- Various typos fixed.
- Mouse cursor now a pointer when it hovers over the cell links.
- In the section, Examining the Internals of the Model, now mention that each row is a cell.

##Out of Scope
- If possible, would be great to open source and provide a link to the ported javascript code of the model.
- For the overlays: could you let people write their own text (much as in the header visualization) and see the resulting overlaid predictions? This would be a way of seeing how far your own handwriting is from the learned distribution. Also it might be fun!
- Might be easier to show all options from the dropdown (generated sample 1 to 5) at once, as 5 rows, so the user won't have to go through the dropdown.
