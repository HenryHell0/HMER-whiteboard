# PLAN

next, I want to finish up graphs and figure out how exaclty I want them to look
I also want to rework the toolbar to support a button to add a blank graph.

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
- 4 polish - an info/credits button in the right
- 2 polish - a little tutorial when you start
- 2 polish - switch HMER select button to having a little AI star

Graphs:

- make it so that removing an equation turns it back into an expression or deletes it (user chooses)
- easy - make it so that hovering while holding an expression gives a nice background

---

okay I just noticed an issue with expressions. we aren't updating the actual widgetdata when we do stuff, just the component itself, which means that if we want to be able to stringify and save these, it won't be possible. so we'll need to v-model everything!
