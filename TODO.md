# PLAN

### graph component

- _10/24/25_ Fri - Add “graph” sbutton and Desmos API functionality
- _10/25/25 Sat_ - keep working on Desmos API integration and graph component

_also if we want to have expressions draggable onto graphs we need to keep track of the current expression in memory_

---

### solving component _hard!_

_note that when we do this we will have to switch backend to FastAPI and change vite proxies_

- _10/26/25_ Sun- create web server and test on test application with SymPy API
- _10/27/25_ Mon - add solve button and get response from SymPy API - potentially start on tomorrow’s stuff
- _10/28/25_ Tuesday - work on parsing(?) of SymPy response - research SymPy API functions more
- _10/29/25_ Wed - keep working with SymPy - potentially start on “solution” component
- _10/30/25_ Thu - Finish solution component & stuff - polish everything

---

### Other stuff TODO:

- add menu bar and little info icons
- add little tip icon when you do something
- add different settings for the tools that pop down in a different menu (stoke width, color, etc. ) - make it cute

## COOL OTHER STUFF TO DO!!!

_priority from 0/10 + type_

- 11 fix - finish the damn app
- 10 feature - UNDO and REDO button!
- 10 feature - editable expression component!
- 9 feature - make the expression you drag to go on top
- 8 polish - make a minimum resize and CLAMP THE DAMN POSITION (easy actually)
- 6 polish - an info/credits button in the right
- 4 polish - a little tutorial when you start
- 4 polish - switch HMER select button to having a little AI star
- 2 refactor the image shown to be a canvas, and then when we select we just draw a white square on the canvas, and then when the paths are updated, we just draw a new path, and then read from the canvas, so the paths is just a list of paths instead. maybe baybe! the issue with this is the path would still exist under the square so it might start looking a littttle strange. and undo and redo would delete random things
