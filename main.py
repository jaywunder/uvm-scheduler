import sys
import json
from addict import Dict
from web import classes_to_schedule, output_schedule_image
from markdown import print_file, class_to_dict, make_csv_reader, select_classes

SEMESTER = sys.argv[1]

# CHANGE THIS
wanted_classes = [
    'BSAD 060', 'CS 120', 'CS 124', 'PHYS 051', 'STAT 143',
    'ENGR 010', 'CS 125'
]

# output to file
reader = make_csv_reader()

classes = select_classes(wanted_classes, reader)

print_file(classes)

# output schedule image
with open('out/' + SEMESTER + '.csmo', 'w') as schedule_file:
    schedule = classes_to_schedule(classes)
    json = json.dumps(schedule)
    schedule_file.write(json)

output_schedule_image()
