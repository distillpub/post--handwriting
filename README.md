# post--handwriting

// multithreaded make
make -j 4

// command to build the pca.json
cat assets/validation/cells/0.json assets/validation/cells/1.json assets/validation/cells/2.json assets/validation/cells/3.json assets/validation/cells/4.json assets/validation/cells/5.json assets/validation/cells/6.json assets/validation/cells/7.json assets/validation/cells/8.json | bin/pca > assets/pca.json

// command to run tsne for sorting (copy the output into metadata.json's sortedOrder)
cat assets/validation/cells/0.json | bin/sort


