For each new version please:
- create Vitests for each feature
- add logging (to a folder /logs) to help you confirm features are working property
- save a copy of the prompt log & your work/updates to a suitable named file, e.g. "version2_claude_transcript.md", "version3_claude_transcript.md"  etc.


Version 2
---------

folders for panels, and JSON data for panels

-[x] create folders for the data for each panel
    - e.g 
      -[x] public/data/explorer
      -[x] public/data/console
      -[x] public/data/inspector
      -[x] public/data/document_editor

-[x] extract the content from each panel, and drive what we see from data in JSON files for each panel, e.g.
    -[x] public/data/explorer/explorer.json
    -[x] public/data/explorer/console.json


Version 3
---------

mockup 1: Python tutorial
test indicator: /python1

-[x] modify the project to mock up a python interactive coding test when the test indicator is appended to the website URL
    - use /screenshots/check/to_python.png as guide


Version 4 - (version 3 refined)
---------

mockup 1: Python tutorial
test indicator: /python1

-[x] in the file explorer on the left, remove all the folders (except the top level python1 folder). and also remove the readme.md and pygthon1.celbridge files
-[x] update the tmerminal to reasd simply:  run "calculator.py"
-[x] in the file explorer also add a green RUN triangle button to the right of the calculator.py file
-[x] fix the code in the file editor to "print(60 / (5 + 15) * 3)"

Version 5
---------

mockup 2: Python with tests
test indicator: /python2

-[x] modify the project to mock up a python interactive coding test when the test indicator is appended to the website URL

-[x] make the "Task" prompt:

    - Write a Python function my_min(<int1>, <int2>, ...) that accepts a variable number of integer arguments, and returns the value of the samllest number
        - you can safely assume:
            - there is always at least 1 integer argument
            - all arguments are integers

    - here is some sample input and output
        my_min(3, 1, 4, 1, 5)  RETURNS: 1
        my_min(7, 2)           RETURNS: 2

-[x] replace the terminal to be a pname named "Check against test data" where the user can see the functions expected and actual output for different inputs, with a button "Re-run tests"
    e.g.
    Call       | Expected output | Actual output  |  Pass/Fail
    my_min(-1)  | -1               | -1               | Pass (green color / tick)
    my_min(0)  | 0               | 0               | Pass (green color / tick)
    my_min(1)  | 1               | 1               | Pass (green color / tick)
    my_min(1, 2)  | 1               | 0               | Fail (red color / tick)
    my_min(2, 1)  | 1               | 0               | Fail (red color / tick)


-[x] show the following for the user's code in the file editor, for a file name "my_functions.py":
    
    ```python
    def my_min(*args):
        smallest = 0
    
        for item in args:
            if item < smallest:
                smallest = item
    
        return smallest
    ```

Version 6
---------

mockup 2: knowledege map
test indicator: /map1

-[] modify the project to mock up a map of concepts for a programming tutorial system

-[] make the middle panel show the concept map of Python programming concepts
- use this screenshot as a guide: /screenshots/jetbrains/knowledge_map2.png

-[] make the right hand panel, a top level "Learning" panel
- with a brief overview about an introductory Python programing course
- use this screenshot as a guide: /screenshots/jetbrains/about_course.png

Version 7
---------

mockup 2: knowledege map refinement
test indicator: /map2

-[] can you modifiy the center panel to display something like this
- screenshots/svg/skill_tree_TARGET.png

-[] use this SVG as a reference, but use CSS SVG, so JSON data can be used to populate the hexagons
- screenshots/svg/skill_tree.svg






