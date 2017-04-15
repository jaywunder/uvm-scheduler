import sys
import base64
import time
from selenium import webdriver

SEMESTER = sys.argv[1]
WAIT_TIME = 2


def output_schedule_image():
    driver = webdriver.Chrome()
    driver.set_window_position(0, 0)
    driver.set_window_size(0, 0)
    driver.get("http://freecollegeschedulemaker.com/")

    with open('out/' + SEMESTER + '.csmo', 'r') as f:
        time.sleep(WAIT_TIME)
        driver.execute_script('localStorage.setItem("courses", \'' + f.read() + '\');')

    driver.get("http://freecollegeschedulemaker.com/")
    time.sleep(WAIT_TIME)

    canvas = driver.find_element_by_css_selector("#schedule_display")

    # get the canvas as a PNG base64 string
    canvas_base64 = driver.execute_script("return arguments[0].toDataURL('image/png').substring(21);", canvas)

    # decode
    canvas_png = base64.b64decode(canvas_base64)

    # save to a file
    with open('out/' + SEMESTER + ".png", 'wb') as f:
        f.write(canvas_png)

    driver.quit()


def classes_to_schedule(classes):
    DATA_CHECK = '69761aa6-de4c-4013-b455-eb2a91fb2b76'
    courses = []
    schedule = {"scheduleTitle": "", "courses": courses}

    for i, c in enumerate(classes):
        start = [x for x in map(int, c.start_time.split(':'))]
        end = [x for x in map(int, c.end_time.split(':'))]

        startHour = start[0]
        startMinute = start[1]
        startIsAM = True
        if startHour > 12:
            startHour -= 12
            startIsAM = False
        if startHour == 12:
            startIsAM = False

        endHour = end[0]
        endMinute = end[1]
        endIsAM = True
        if endHour > 12:
            endHour -= 12
            endIsAM = False
        if endHour == 12:
            endIsAM = False

        courses.append({
            "title": c.title + ' ' + c.subj + c.number + c.section,
            "meetingTimes": [
                {
                    "startHour": startHour,
                    "startMinute": startMinute,
                    "startIsAM": startIsAM,
                    "endHour": endHour,
                    "endMinute": endMinute,
                    "endIsAM": endIsAM,
                    "meetsOnMonday": 'M' in c.days,
                    "meetsOnTuesday": 'T' in c.days,
                    "meetsOnWednesday": 'W' in c.days,
                    "meetsOnThursday": 'R' in c.days,
                    "meetsOnFriday": 'F' in c.days,
                    "meetsOnSaturday": False,
                    "meetsOnSunday": False,
                    "classType": "",
                    "location": "",
                    "instructor": ""
                }
            ],
            "color": "#FFE37D",
            "SAVE_VERSION": 1,
            "DATA_CHECK": "69761aa6-de4c-4013-b455-eb2a91fb2b76"
        })

    return schedule
