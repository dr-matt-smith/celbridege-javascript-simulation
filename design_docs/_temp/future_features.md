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

-[] in the file explorer on the left, remove all the folders (except the top level python1 folder). and also remove the readme.md and pygthon1.celbridge files
-[] update the tmerminal to reasd simply:  run "calculator.py"
-[] in the file explorer also add a green RUN triangle button to the right of the calculator.py file
-[] fix the code in the file editor to "print(60 / (5 + 15) * 3)"


