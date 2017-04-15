# uvm-scheduler
A (kinda jank) tool to help UVM students plan out their schedules

UVM's system for figuring out your schedule is really obnoxious, and everyone has a different method of going about 
making their schedule.  This is my method. 

 1. Enter the classes you want to take in the `wanted_classes` list in `main.py`.  The classes should be in 
 the form: `'CS 064'`.  Notice the `0` before a two digit course number. Optionally you can add a section letter 
 once you've decided what section you want to take.
 2. Run `./classes.sh`.  This will create a few files in the `out` folder. 
 3. The png file is a schedule made by http://freecollegeschedulemaker.com. The markdown file is a list of the classes
 you listed as `wanted_classes` each with all of their sections in markdown.  I use a markdown editor to make this
 file look pretty


# Contributing
If you see anywhere where you'd like to contribute feel free to make a PR.

If you have an issue with how this works, you can open an issue, but don't expect it to get solved. :smile:
