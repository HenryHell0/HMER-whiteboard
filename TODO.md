# PLAN

### HMER

- _10/21/25_ Tue - Complete HMER model API thing and add MathJax support to a test application - possibly add expression component to app :)

---

### expression component

- _10/22/25_ Wed - Add Expression component and draggability
- _10/23/25_ Thur - keep working on that cause its probably tricky - lots of edge cases probably.

---

### graph component

- _10/24/25_ Fri - Add “graph” sbutton and Desmos API functionality
- _10/25/25 Sat_ - keep working on Desmos API integration and graph component

---

### solving component _hard!_

_note that when we do this we will have to switch backend to FastAPI and change vite proxies_

- _10/26/25_ Sun- create web server and test on test application with SymPy API
- _10/27/25_ Mon - add solve button and get response from SymPy API - potentially start on tomorrow’s stuff
- _10/28/25_ Tuesday - work on parsing(?) of SymPy response - research SymPy API functions more
- _10/29/25_ Wed - keep working with SymPy - potentially start on “solution” component
- _10/30/25_ Thu - Finish solution component & stuff - polish everything

---

### dragables

- _10/31/25_ Fri - Refactor (or just do it right) graph component to support draggability and a list of components - Styles!!
- _11/1/25_ - Sat - Add draggability to graphs!!!
- _11/2/25_ - Sun - Keep working on draggability
  -- global state
- _11/3/25_ - Mon - experiment with a desmos global state - we’ll see
- _11/4/25_ - Tue - keep experimenting
- _11/5/25_ - Wed - keep messing around with additional features. Experiment with on-line HMER model
  refactor/work on styles/polish

---

### Other stuff TODO:

- add menu bar and little info icons
- add little tip icon when you do something
- add different settings for the tools that pop down in a different menu (stoke width, color, etc. ) - make it cute

## COOL OTHER STUFF TO DO!!!

_priority from 0/10 + type_

- 11 fix - finish the damn app
- 10 feature - UNDO and REDO button!
- 8 polish - an info/credits button in the right
- 3 polish - a little tutorial when you start
- 4 polish - switch HMER select button to having a little AI star
- 2 refactor the image shown to be a canvas, and then when we select we just draw a white square on the canvas, and then when the paths are updated, we just draw a new path, and then read from the canvas, so the paths is just a list of paths instead. maybe baybe! the issue with this is the path would still exist under the square so it might start looking a littttle strange. and undo and redo would delete random things
