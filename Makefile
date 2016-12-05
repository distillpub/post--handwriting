STROKES = $(shell ls strokes/*.json)
VALIDATIONS = $(shell ls validation-data/*.json)

# STROKES = strokes/001.json \
# strokes/002.json \
# strokes/003.json

NUMSTROKES = 50

GENERATED_FILES = \
	$(STROKES:strokes/%.json=strokes/data/0-90/%.json) \
	$(STROKES:strokes/%.json=strokes/data/0-50/%.json) \
	$(STROKES:strokes/%.json=strokes/data/0-30/%.json) \
	$(STROKES:strokes/%.json=strokes/data/%.json) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-30-2.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-50-2.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-65-2.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-90-2.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-30-4.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-50-4.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-65-4.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-90-4.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-30-8.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-50-8.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-65-8.jpg) \
	$(STROKES:strokes/%.json=assets/strokes/jpg/%-90-8.jpg)

VALIDATION_FILES = \
  $(VALIDATIONS:validation-data/%.json=assets/validation/data/%.json) \
  $(VALIDATIONS:validation-data/%.json=assets/validation/cells/%.json)


.PHONY: all validation clean

all: $(GENERATED_FILES)

validation: $(VALIDATION_FILES)
#validation: $(VALIDATIONS)

foo:
	echo $(VALIDATIONS)
	#echo $(VALIDATION_FILES)

clean:
	rm -rf -- $(GENERATED_FILES) $(VALIDATION_FILES) build

# Generate the data
# bin/porcupine-data
strokes/data/%.json: strokes/%.json
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-data $(NUMSTROKES) 8 0.65 > $@

strokes/data/0-90/%.json: strokes/%.json
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-data $(NUMSTROKES) 8 0.90 > $@

strokes/data/0-50/%.json: strokes/%.json
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-data $(NUMSTROKES) 8 0.50 > $@

strokes/data/0-30/%.json: strokes/%.json
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-data $(NUMSTROKES) 8 0.30 > $@

# Render the generated data
# 0
# assets/strokes/jpg/%-0.jpg: strokes/data/%.json bin/porcupine-render
# 	mkdir -p $(dir $@)
# 	cat $< | bin/porcupine-render 0 0 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

# > gm convert -flatten $@
# 1

# assets/strokes/jpg/%-30-1.jpg: strokes/data/0-30/%.json bin/porcupine-render
# 	mkdir -p $(dir $@)
# 	cat $< | bin/porcupine-render $(NUMSTROKES) 1 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@
#
# assets/strokes/jpg/%-50-1.jpg: strokes/data/0-50/%.json bin/porcupine-render
# 	mkdir -p $(dir $@)
# 	cat $< | bin/porcupine-render $(NUMSTROKES) 1 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@
#
# assets/strokes/jpg/%-65-1.jpg: strokes/data/%.json bin/porcupine-render
# 	mkdir -p $(dir $@)
# 	cat $< | bin/porcupine-render $(NUMSTROKES) 1 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@
#
# assets/strokes/jpg/%-90-1.jpg: strokes/data/0-90/%.json bin/porcupine-render
# 	mkdir -p $(dir $@)
# 	cat $< | bin/porcupine-render $(NUMSTROKES) 1 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

# 2

assets/strokes/jpg/%-30-2.jpg: strokes/data/0-30/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 2 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-50-2.jpg: strokes/data/0-50/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 2 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-65-2.jpg: strokes/data/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 2 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-90-2.jpg: strokes/data/0-90/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 2 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

# 4

assets/strokes/jpg/%-30-4.jpg: strokes/data/0-30/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 4 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-50-4.jpg: strokes/data/0-50/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 4 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-65-4.jpg: strokes/data/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 4 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-90-4.jpg: strokes/data/0-90/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 4 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

# 8

assets/strokes/jpg/%-30-8.jpg: strokes/data/0-30/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 8 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-50-8.jpg: strokes/data/0-50/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 8 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-65-8.jpg: strokes/data/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 8 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

assets/strokes/jpg/%-90-8.jpg: strokes/data/0-90/%.json bin/porcupine-render
	mkdir -p $(dir $@)
	cat $< | bin/porcupine-render $(NUMSTROKES) 8 | rsvg-convert -f png | gm convert png:- -quality 70 -flatten $@

# Generate the validation data
assets/validation/data/%.json: validation-data/%.json
	mkdir -p $(dir $@)
	cat $< | bin/process-validation-samples > $@


assets/validation/cells/%.json: assets/validation/data/%.json bin/extract-cells
	mkdir -p $(dir $@)
	cat $< | bin/extract-cells > $@
