import sys
import csv
from addict import Dict

SEMESTER = sys.argv[1]


def make_csv_reader():
    csvfile = open('out/' + SEMESTER + '.csv', 'r')

    dialect = csv.Sniffer().sniff(csvfile.read(1024))
    csvfile.seek(0)
    reader = csv.reader(csvfile, dialect)

    return reader


def select_classes(wanted_classes, reader):
    classes = []

    for line in reader:
        if (
            line[0] + ' ' + line[1] in wanted_classes or
            line[0] + ' ' + line[1] + ' ' + line[4] in wanted_classes
        ):
            classes.append(class_to_dict(line))

    return classes


def class_to_dict(class_list):
    return Dict({
        "subj": class_list[0], "number": class_list[1], "title": class_list[2], "c_number": class_list[3],
        "section": class_list[4], "lec_lab": class_list[5], "campcode": class_list[6],
        "collcode": class_list[7], "max_enroll": class_list[8], "curr_enroll": class_list[9],
        "start_time": class_list[10], "end_time": class_list[11], "days": class_list[12],
        "credits": class_list[13], "building": class_list[14], "room": class_list[15],
        "instructor": class_list[16], "netid": class_list[17], "email": class_list[18],
    })


def print_file(classes):
    for i, c in enumerate(classes):
        if classes[i].number != classes[i - 1].number:
            if i > 0:
                print('```')
            print()
            print('### ' + c.subj + ' ' + c.number + ' ' + classes[i].title)
            print('```')

        if (
            classes[i].c_number != classes[i - 1].c_number
            # and int(c.max_enroll) - int(c.curr_enroll) > 0
            # and c.start_time != '08:30'
        ):
            print(
                # c.subj, c.number, c.title,
                c.c_number,
                c.section.ljust(3), c.max_enroll.ljust(3), c.curr_enroll.ljust(3),
                c.start_time, c.end_time, c.days
            )

    print('```\n')
